import { Component } from '@angular/core';
import { CreateProductRequest, Product } from '../../../core/models/product.model';
import { AuthService, ProductsService } from '../../../core/services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-seller',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-seller.component.html',
  styleUrl: './product-seller.component.css',
})
export class ProductSellerComponent {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Laptops', 'Desktops', 'Accessories', 'Components', 'Other'];
  selectedProduct: Product | null = null;
  showProductModal = false;
  editMode = false;
  searchTerm = '';
  categoryFilter = '';
  visibilityFilter = '';
  stockSortFilter = '';
  isLoading = false;
  productForm: CreateProductRequest = this.getEmptyProductForm();
  image: File[] = [];

  stats = {
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalCategories: 0
  };

  constructor(private SProduct: ProductsService, private authS: AuthService) { }

  ngOnInit() {
    const userId = this.authS.getCurrentUser()?._id;
    if (userId) {
      this.loadProducts(userId);
    }
    this.applyFilters();
  }

  loadProducts(id: string) {
    this.isLoading = true;
    this.SProduct.getProductsBySeller(id).subscribe({
      next: (res) => {
        this.products = res.products;
        this.applyFilters();
        this.loadStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load', err);
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.stats.total = this.products.length;
    this.stats.totalCategories = this.categories.length;
    this.SProduct.getLowStockProducts().subscribe({
      next: (res) => {
        this.stats.lowStock = res.summary.totalLowStock;
      },
      error: (err) => console.error('low stock error', err)
    });
    this.SProduct.getOutOfStockProducts().subscribe({
      next: (res) => {
        this.stats.outOfStock = res.count;
      },
      error: (err) => console.error('Failed to load out of stock', err)
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter;
      let productVisibility = product.visibility || 'Draft';
      const matchesVisibility = !this.visibilityFilter
        || productVisibility.toLowerCase() === this.visibilityFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesVisibility;
    });
    if (this.stockSortFilter) {
      this.applySorting();
    }
    this.stats.total = this.filteredProducts.length;
  }

  applySorting(): void {
    if (this.stockSortFilter === 'asc') {
      this.filteredProducts.sort((a, b) => a.stockQuantity - b.stockQuantity);
    } else if (this.stockSortFilter === 'desc') {
      this.filteredProducts.sort((a, b) => b.stockQuantity - a.stockQuantity);
    }
  }

  onStockSortChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  onVisibilityFilterChange(): void {
    this.applyFilters();
  }

  handleAddProduct(): void {
    this.editMode = false;
    this.selectedProduct = null;
    this.productForm = this.getEmptyProductForm();
    this.image = [];
    this.showProductModal = true;
  }

  handleEditProduct(product: Product): void {
    this.editMode = true;
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.image = [];
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.productForm = this.getEmptyProductForm();
    this.image = [];
  }

  onImgSelect(event: any) {
    const files = event.target.files;
    if (files) {
      this.image = Array.from(files);
    }
  }

  imageBaseUrl = 'http://localhost:8000/';

  getImageSrc(image: string): string {
    if (!image) return 'assets/no-image.png';
    if (image.startsWith('http')) {
      return image;
    }
    return this.imageBaseUrl + image;
  }

  submitProduct(): void {
    if (this.editMode && this.selectedProduct) {
      this.SProduct.updateProduct(this.selectedProduct._id, this.productForm, this.image).subscribe({
        next: (res) => {
          console.log('Product updated successfully', res);
          const userId = this.authS.getCurrentUser()?._id;
          if (userId) {
            this.loadProducts(userId);
            this.loadStats(); // ✅ تحديث الـ stats بعد التعديل
          }
          this.closeProductModal();
        },
        error: (err) => {
          console.error('Failed to update product', err);
          alert('Failed to update product');
        }
      });
    } else {
      this.SProduct.createProduct(this.productForm, this.image).subscribe({
        next: (res) => {
          console.log('Product created successfully', res);
          const userId = this.authS.getCurrentUser()?._id;
          if (userId) {
            this.loadProducts(userId);
            this.loadStats(); // ✅ تحديث الـ stats بعد الإضافة
          }
          this.closeProductModal();
        },
        error: (err) => {
          console.error('Failed to create product', err);
          alert('Failed to create product');
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.SProduct.deleteProduct(product._id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          const userId = this.authS.getCurrentUser()?._id;
          if (userId) {
            this.loadProducts(userId);
            this.loadStats(); // ✅ تحديث الـ stats بعد الحذف
          }
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          alert('Failed to delete product');
        }
      });
    }
  }

  toggleVisibility(product: Product) {
    const newVisibility = product.visibility === 'Published' ? 'Draft' : 'Published';

    this.SProduct.updateVisibility(product._id, newVisibility).subscribe({
      next: (res) => {
        product.visibility = res.product.visibility;
        this.visibilityFilter = '';
        this.applyFilters();
        this.loadStats(); // ✅ تحديث الـ stats بعد تغيير الـ visibility
        console.log(product.visibility);
      }
    });
  }

  getStockBadgeClass(stock: number, threshold: number = 20): string {
    if (stock === 0) return 'badge-danger';
    if (stock < threshold) return 'badge-warning';
    return 'badge-success';
  }

  getSellerName(seller: any): string {
    if (typeof seller === 'string') return seller;
    return seller?.name || 'Unknown';
  }

  getEmptyProductForm(): CreateProductRequest {
    return {
      name: '',
      description: '',
      category: 'Laptops',
      brand: '',
      sku: '',
      condition: 'New',
      price: 0,
      stockQuantity: 0,
      visibility: 'Published'
    };
  }
}