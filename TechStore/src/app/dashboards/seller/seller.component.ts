import { Component } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-seller',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css',
})
export class SellerComponent {

}
