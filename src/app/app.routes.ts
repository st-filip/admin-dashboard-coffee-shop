import { Routes } from '@angular/router';
import { Orders } from './pages/orders/orders';
import { Products } from './pages/products/products';
import { Users } from './pages/users/users';
import { Login } from './pages/login/login';
import { TabsLayout } from './layouts/tabs-layout/tabs-layout';
import { authGuard } from './auth/auth-guard';
import { ProductDetails } from './pages/products/product-details/product-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'tabs',
    component: TabsLayout,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: Orders },
      { path: 'products', component: Products },
      { path: 'products/:id', component: ProductDetails },
      { path: 'users', component: Users },
    ],
    canActivate: [authGuard],
  },
];
