import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../product-model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../products-service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  product: Product | null = null;
  form!: FormGroup;
  private productSub: Subscription = new Subscription();
  productNotFound = false;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (!id) {
        this.router.navigate(['/tabs/products']);
        return;
      }
      this.productSub = this.productsService.getProductById(id).subscribe({
        next: (product) => {
          if (!product) {
            this.productNotFound = true;
          } else {
            this.product = product;
            this.form = this.fb.group({
              name: [this.product.name, Validators.required],
              description: [this.product.description],
              price: [
                this.product.price,
                [Validators.required, Validators.min(0)],
              ],
              stock: [
                this.product.stock,
                [Validators.required, Validators.min(0)],
              ],
            });
          }
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.productNotFound = true;
        },
      });
    });
  }

  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const updatedProduct = { ...this.product, ...this.form.value };

    this.productsService.updateProduct(updatedProduct).subscribe({
      next: () => {
        console.log('Product updated');
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }
}
