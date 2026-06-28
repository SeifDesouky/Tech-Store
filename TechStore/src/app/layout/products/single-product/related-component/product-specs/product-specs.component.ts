import {  CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-specs',
  imports: [CommonModule],
  templateUrl: './product-specs.component.html',
  styleUrl: './product-specs.component.css',
})
export class ProductSpecsComponent {

  constructor() { }
  @Input() technicalSpecs!: Record<string, any>;
  @Input() dimensions!: any;
  @Input() weight!: any;
  @Input() usedDetails!: any;
  @Input() importedDetails!: any;

  specsToShow = [
  { label: 'CPU', key: 'CPU', icon: 'cpu' },
  { label: 'GPU', key: 'GPU', icon: 'gpu' },
  { label: 'RAM', key: 'RAM', icon: 'ram' },
  { label: 'Storage', key: 'Storage', icon: 'storage' },
  { label: 'Display', key: 'Display' },
  { label: 'Screen Size', key: 'ScreenSize' }
];

  technicalSpecsArray: { key: string; value: any }[] = [];

  ngOnInit() {
    if (this.technicalSpecs) {
      this.technicalSpecsArray = Object.entries(this.technicalSpecs)
        .map(([key, value]) => ({ key, value }));
    }
  }
  downloadSpecs(): void {
    console.log('Downloading specs PDF...');
  }

  subscribe(email: string): void {
    console.log('Subscribing email:', email);
  }

}
