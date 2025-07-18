import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from './products-service';
import { Product } from './product-model';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit, OnDestroy {
  private productsService = inject(ProductsService);
  private router = inject(Router);

  products: Product[] = [];
  productsSub: Subscription = new Subscription();
  loading = true;

  ngOnInit() {
    this.productsSub = this.productsService.products$.subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
    this.productsService.getProducts().subscribe();
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

  viewDetails(product: any) {
    this.router.navigate(['/tabs/products', product.id]);
  }
}
