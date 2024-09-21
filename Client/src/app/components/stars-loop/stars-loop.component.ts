import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stars-loop',
  standalone: true,
  imports: [],
  templateUrl: './stars-loop.component.html',
  styleUrl: './stars-loop.component.scss'
})
export class StarsLoopComponent implements OnInit , OnChanges{

  @Input() rating : number = 0;
  starArray: number[] = []

  ngOnInit(): void {
    this.updateStarArray()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateStarArray()
  }


  updateStarArray(): void {
    const fullStars = Math.floor(this.rating);
    const halfStar = this.rating % 1 !== 0;

    this.starArray = Array(fullStars).fill(1);
    if (halfStar) {
      this.starArray.push(0.5);
    }
    const emptyStars = 5 - this.starArray.length;
    this.starArray.push(...Array(emptyStars).fill(0));
  }
}
