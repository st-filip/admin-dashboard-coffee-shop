import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { Product } from './product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private _products = new BehaviorSubject<Product[]>([]);

  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.http
      .get<Product[]>(`${environment.API_URL}/products`)
      .pipe(tap((products) => this._products.next(products)));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/products/${id}`);
  }

  updateProduct(product: Product) {
    return this.http
      .patch(`${environment.API_URL}/products/${product.id}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      })
      .pipe(
        switchMap(() => this.products$),
        take(1),
        tap((products) => {
          const updatedProductIndex = products.findIndex(
            (p) => p.id === product.id
          );
          const updatedProducts = [...products];
          updatedProducts[updatedProductIndex] = product;
          this._products.next(updatedProducts);
        })
      );
  }
}
