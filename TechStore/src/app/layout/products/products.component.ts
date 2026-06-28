import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { ProductsService } from '../../core/services';
import {Product} from '../../core/models/product.model'


@Component({
  selector: 'app-products',
  imports: [CommonModule, NgxPaginationModule, FormsModule,RouterLink,NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})

export class ProductsComponent {

  page: number = 1;
  states:any={
    category:true,
    brand:false,
    condition:true,
    processor:false,
    gpu:false,
    ram:false,
    storage:false,
    size:false
  }
  // products:Product[]=[]
  searchText: string = "";
  selectedCategory:string="";
  selectedCondition: string = "all";
  selectedBrand: string = "all";
  selectedProcessor: string = "all";
  selectedGPU: string = "all";
  selectedRAM: string = "all";
  selectedStorage: string = "all";
  selectedScreenSize: string = "all";
  minPrice: number = 0;
  maxPrice: number = 100000;
  currentPriceRange: number = 100000;
  sortPrice: string = "";
  wishlistIds: string[] = [];

  categories:string[]=[];
  brand:string[]=[];
  condition:string[]=[];
  processor:(string | undefined)[]=[];
  GPU:(string | undefined)[]=[];
  RAM:(string | undefined)[]=[];
  storage:(string | undefined)[]=[];
  screenSize:(string | undefined)[]=[];
  queryParams: any = {};
  filteredProducts:Product[]=[]
  allProducts:Product[]=[]

  constructor(private SProduct:ProductsService){}

  pageChanged(event: number) {
    this.page = event;
  }
  toggleSection(section:string){
    this.states[section]=!this.states[section]
  }

  ngOnInit(){
    this.loadProducts()
    this.loadFilters()
    this.loadWishlist()
  }
  
  filters(){
    this.categories=[...new Set(this.allProducts.map(p=>p.category))]
    this.brand=[...new Set(this.allProducts.map(p=>p.brand))]
    this.condition=[...new Set(this.allProducts.map(p=>p.condition))]
    this.processor = [...new Set(this.allProducts.map(p => p.technicalSpecs?.CPU).filter(p => p !== undefined))];
    this.GPU=[...new Set(this.allProducts.map(p=>p.technicalSpecs?.GPU).filter(p => p !== undefined))]
    this.RAM=[...new Set(this.allProducts.map(p=>p.technicalSpecs?.RAM).filter(p => p !== undefined))]
    this.storage=[...new Set(this.allProducts.map(p=>p.technicalSpecs?.Storage).filter(p => p !== undefined))]
    this.screenSize=[...new Set(this.allProducts.map(p=>p.technicalSpecs?.ScreenSize).filter(p => p !== undefined))]
  }

  loadFilters(){
    this.SProduct.getAllProducts().subscribe(res=>{
      this.allProducts=res.products
      this.filters()
    })
  }
  loadProducts(){
    this.SProduct.getAllProducts(this.queryParams).subscribe(res=>{
      this.filteredProducts = res.products
      console.log(res);
      
    })
  }
  loadWishlist() {
    this.SProduct.getWishlist().subscribe(res => {
      this.wishlistIds = res.product_ids.map((p: any) => p._id);
    });
  }
    isInWishlist(productId: string): boolean {
    return this.wishlistIds.includes(productId);
  }
  
  toggleWishlist(productId: string) {
    if (this.isInWishlist(productId)) {
      this.SProduct.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds = this.wishlistIds.filter(id => id !== productId);
        },
        error: err => console.error(err)
      });

    } else {
      // ❤️ ADD
      this.SProduct.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistIds.push(productId);
        },
        error: err => console.error(err)
      });
    }
  }

  searchTimeout: any;

search(value: string) {
  clearTimeout(this.searchTimeout);

  this.searchTimeout = setTimeout(() => {
    this.queryParams.search = value;
    this.loadProducts();
  }, 400);
}
  onCategoryChange(event: any) {
  const value = event.target.value;

  this.selectedCategory = value;
  this.queryParams.category = value === 'all' ? null : value;
  this.loadProducts();
  }


  onConditionChange(event: any) {
    this.selectedCondition = event.target.value;
    this.queryParams.condition=this.selectedCondition==='all'?null:this.selectedCondition
    this.loadProducts()
  }

  onBrandChange(event: any) {
    this.selectedBrand = event.target.value;
    this.queryParams.brand=this.selectedBrand==='all'?null:this.selectedBrand
    this.loadProducts()
  }

  onProcessorChange(event: any) {
    this.selectedProcessor = event.target.value;
    this.queryParams.cpu=this.selectedProcessor==='all'?null:this.selectedProcessor
    this.loadProducts()
  
  }

  onGPUChange(event: any) {
  this.selectedGPU = event.target.value;
  this.queryParams.gpu = this.selectedGPU === 'all' ? null : this.selectedGPU;
  this.loadProducts();
}


  onRAMChange(event: any) {
    this.selectedRAM = event.target.value;
    this.queryParams.ram=this.selectedRAM==='all'?null:this.selectedRAM
    this.loadProducts();

  }

  onStorageChange(event: any) {
    this.selectedStorage = event.target.value;
    this.queryParams.storage= this.selectedStorage==='all'?null:this.selectedStorage
    this.loadProducts();

  }

  onScreenSizeChange(event: any) {
  this.selectedScreenSize = event.target.value;
  this.queryParams.screenSize = this.selectedScreenSize === 'all' ? null : this.selectedScreenSize;
  this.loadProducts();
}


 onPriceRangeChange(event: any) {
  this.currentPriceRange = event.target.value;
  this.queryParams.minPrice = 0;
  this.queryParams.maxPrice = this.currentPriceRange;
  this.loadProducts();
}

  // applyAllFilters() {
  //   this.filteredProducts = this.products.filter(product => {
  //     const matchesSearch = product.name.toLowerCase().includes(this.searchText.toLowerCase());
  //     const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
  //     const matchesCondition = this.selectedCondition === 'all' || product.condition === this.selectedCondition;
  //     const matchesBrand = this.selectedBrand === 'all' || product.brand === this.selectedBrand;
  //     const matchesProcessor = this.selectedProcessor === 'all' || product.technicalSpecs?.CPU === this.selectedProcessor;
  //     const matchesGPU = this.selectedGPU === 'all' || product.technicalSpecs?.GPU === this.selectedGPU;
  //     const matchesRAM = this.selectedRAM === 'all' || product.technicalSpecs?.RAM === this.selectedRAM;
  //     const matchesStorage = this.selectedStorage === 'all' || product.technicalSpecs?.Storage === this.selectedStorage;
  //     const matchesScreenSize = this.selectedScreenSize === 'all' || product.technicalSpecs?.ScreenSize === this.selectedScreenSize;
  //     const matchesPriceRange = product.price <= this.currentPriceRange;

  //     return matchesSearch && matchesCategory && matchesCondition &&
  //           matchesBrand && matchesProcessor && matchesGPU &&
  //           matchesRAM && matchesStorage && matchesScreenSize &&
  //           matchesPriceRange;
  //   });

  //   if (this.sortPrice) {
  //     this.applySorting(this.sortPrice);
  //   }
  // }

  onPriceChange(event:any){
    this.sortPrice=event.target.value
    this.applySorting(this.sortPrice)
  }

  applySorting(sortType:string) {
    this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
    if (sortType === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
    });
  }

}
