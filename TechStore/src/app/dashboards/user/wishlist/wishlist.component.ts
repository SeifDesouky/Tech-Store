import { Component } from '@angular/core';
import { Product,Wishlist } from '../../../core/models/product.model';
import { CartService, ProductsService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishlist:Product[]=[]
  loading=false

  constructor(private Swishlist:ProductsService,private SCart:CartService){}
  ngOnInit(){
    this.loadWishlist()
  }

  loadWishlist(){
    this.loading=true
    this.Swishlist.getWishlist().subscribe(res=>{
      this.wishlist=res.product_ids||[]
      this.loading=false
    })
  }

  removeItem(id:string){
    this.Swishlist.removeFromWishlist(id).subscribe(res=>{
      this.wishlist=this.wishlist.filter(i=>i._id!==id)
    })
  }
    addToCart(item:Product) {
    if (!this.wishlist) return;
    this.SCart.addToCart(item._id).subscribe({
      next: (res) => {
        console.log('Added to cart', res);
        alert('Product added to cart');
        // this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        alert('Failed to add to cart');
      }
    });
  }

  clearWishlist(){
    this.Swishlist.clearWishlist().subscribe(res=>{
      this.wishlist=[]
    })
  }


    get totalValue(): number {
    return this.wishlist.reduce((sum, item) => sum + item.price, 0);
  }

  get totalSavings(): number {
    return this.wishlist.reduce((sum, item) => {
      if (item.price) {
        return sum + (item.price - item.price);
      }
      return sum;
    }, 0);
  }

    calculateDiscount(originalPrice: number, price: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

}
