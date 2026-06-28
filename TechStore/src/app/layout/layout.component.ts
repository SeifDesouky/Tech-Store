import { Component } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { IndexComponent } from "./index/index.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { ProductsComponent } from "./products/products.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  
}
