import { Component } from '@angular/core';
import { CategoryComponent } from "../category/category.component";
// import { ServicesComponent } from "../services/services.component";
import { HomeComponent } from "../home/home.component";
import { ServicesComponent } from "../services/services.component";

@Component({
  selector: 'app-index',
  imports: [CategoryComponent, HomeComponent, ServicesComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {

}
