import { Routes } from '@angular/router';
import { IndexComponent } from './layout/index/index.component';
import { CategoryComponent } from './layout/category/category.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './layout/products/products.component';
import { SingleProductComponent } from './layout/products/single-product/single-product.component';
import { PaymentComponent } from './layout/payment/payment.component';
import { CartComponent } from './layout/cart/cart.component';
import { SupportCenterComponent } from './layout/support-center/support-center.component';
import { FaqComponent } from './layout/support-center/related-support-component/faq/faq.component';
import { SupportTicketComponent } from './layout/support-center/related-support-component/support-ticket/support-ticket.component';
import { MyTicketComponent } from './layout/support-center/related-support-component/my-ticket/my-ticket.component';
import { PoliciesComponent } from './layout/support-center/related-support-component/policies/policies.component';
import { authGuard } from './core/guards/auth.guard';
import { UserComponent } from './dashboards/user/user.component';
import { ProfileComponent } from './dashboards/user/profile/profile.component';
import { OrdersComponent } from './dashboards/user/orders/orders.component';
import { ReviewsComponent } from './dashboards/user/reviews/reviews.component';
import { NotificationComponent } from './dashboards/user/notification/notification.component';
import { WishlistComponent } from './dashboards/user/wishlist/wishlist.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { DashboardComponent } from './dashboards/admin/dashboard/dashboard.component';
import { UsersComponent } from './dashboards/admin/users/users.component';
import { ProductsComponent as adminProduct } from './dashboards/admin/products/products.component'
import { adminGuard, sellerGuard } from './core/guards';
import { ResetPasswordComponent } from './layout/Auth/reset-password/reset-password.component';
import { TrackOrdersComponent } from './dashboards/admin/track-orders/track-orders.component';
import { SellersComponent } from './dashboards/admin/sellers/sellers.component';
import { PromosComponent } from './dashboards/admin/promos/promos.component';
import { ModerationComponent } from './dashboards/admin/moderation/moderation.component';
import { ReviewComponent } from './dashboards/admin/moderation/review/review.component';
import { SellerComponent } from './dashboards/seller/seller.component';
import { SellerDashboardComponent } from './dashboards/seller/seller-dashboard/seller-dashboard.component';
import { ProductSellerComponent } from './dashboards/seller/product-seller/product-seller.component';
import { OrderSellerComponent } from './dashboards/seller/order-seller/order-seller.component';
import { ReviewSellerComponent } from './dashboards/seller/review-seller/review-seller.component';
import { ReportComponent } from './dashboards/admin/reports/report.component';
import { SalesReportComponent } from './dashboards/admin/reports/sales-report/sales-report.component';
import { ProductPerformanceComponent } from './dashboards/admin/reports/product-performance/product-performance.component';
import { CustomerInsightsComponent } from './dashboards/admin/reports/customer-insights/customer-insights.component';
import { OverviewComponent } from './dashboards/admin/reports/overview/overview.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: IndexComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'product', component: ProductsComponent },
      { path: 'single-product/:id', component: SingleProductComponent },
      { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent },
      {
        path: 'support-center', component: SupportCenterComponent, children: [
          { path: 'faq', component: FaqComponent },
          { path: 'support-ticket', component: SupportTicketComponent },
          { path: 'my-ticket', component: MyTicketComponent },
          { path: 'policies', component: PoliciesComponent },
        ]
      },

    ]
  },
  {
    path: 'user', component: UserComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'wishlist', component: WishlistComponent }
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [adminGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ReportComponent, children: [
        { path: '', redirectTo: 'reports', pathMatch: 'full' },
        { path: 'reports', component: OverviewComponent },
        { path: 'sales', component: SalesReportComponent },
        { path: 'products', component: ProductPerformanceComponent },
        { path: 'customers', component: CustomerInsightsComponent }
      ] },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: adminProduct },
      { path: 'orders', component: TrackOrdersComponent },
      { path: 'seller', component: SellersComponent },
      { path: 'promos', component: PromosComponent },
      {
        path: 'moderation', component: ModerationComponent, children: [
          { path: '', redirectTo: 'review', pathMatch: 'full' },
          { path: 'review', component: ReviewComponent },
        ]
      }
      // Reports Routes
      
    ]
  },
  {
    path: 'seller', component: SellerComponent, canActivate: [sellerGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'products', component: ProductSellerComponent },
      { path: 'orders', component: OrderSellerComponent },
      { path: 'reviews', component: ReviewSellerComponent }
    ]
  }
];
