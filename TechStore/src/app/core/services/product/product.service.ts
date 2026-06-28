import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private mockProduct: Product = {
    id: '1',
    name: 'Lenovo Loq Essential 15IAX9E Gaming',
    subtitle: 'Lenovo Loq Essential 15IAX9E Gaming: Ci5-12450HX 16GB 512GB SSD, RTX 4050 6GB 15.6" FHD-144Hz-300nits, Backlit-AE KB gray -1 Loi RGB M100 Mouse',
    price: 38799,
    currency: 'EGP',
    rating: 2.5,
    reviewCount: 100,
    images: {
      main: 'assets/images/loq-removebg-preview.png',
      thumbnails: [
        'assets/images/laptop-1.jpg',
        'assets/images/laptop-2.jpg',
        'assets/images/laptop-3.jpg',
        'assets/images/laptop-4.jpg'
      ]
    },
    specs: {
      performance: '12. Performance with Generation Intel Core i5 processor and NVIDIA GeForce RTX 4050 graphics',
      processor: 'Processor Series Core i5-12450HX Processor Speed 3.1 GHz Processor Count 1 Processor Core 8 Cores Processor GPU Intel CPU Model Speed Maximum 4.4 GHz',
      display: '15.6" FHD-144Hz-300nits',
      graphics: 'Graphics Coprocessor NVIDIA GeForce RTX 4050',
      ram: 'RAM Memory Installed 16 GB',
      mouse: 'Loq RGB M100 Mouse'
    }
  };

  getProduct(): Observable<Product> {
    return of(this.mockProduct);
  }
}
