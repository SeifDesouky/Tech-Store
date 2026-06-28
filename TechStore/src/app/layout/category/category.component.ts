import { Component } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  activeIndex=1
  cards=[
    {
      img:'lap.png',
      title:"Accessories",
      desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nihil laborum sequi adipisci facere Iusto nihil laborum sequi adipisci facere nesciunt!"
    },
    {
      img:'lap.png',
      title:"Laptops",
      desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nihil laborum sequi adipisci facere Iusto nihil laborum sequi adipisci facere nesciunt!"
    },
    {
      img:'lap.png',
      title:"PC Builds",
      desc:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nihil laborum sequi adipisci facere Iusto nihil laborum sequi adipisci facere nesciunt!"
    }
  ]

    setActive(index: number){
    this.activeIndex = index;
  }

  constructor(){
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        let next = this.activeIndex;
        if (e.key === 'ArrowLeft') next = Math.max(0, this.activeIndex - 1);
        if (e.key === 'ArrowRight') next = Math.min(this.cards.length - 1, this.activeIndex + 1);
        this.activeIndex = next;
      }
    });
  }
}
