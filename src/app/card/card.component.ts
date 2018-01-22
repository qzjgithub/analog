import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  empty = false;

  @Input()
  title = '';

  @Input()
  tags = [];

  @Input()
  content = [];

  @Input()
  leftIcon = '';

  @Input()
  rightIcon = '';

  @Input()
  leftText = '';

  @Input()
  rightText = '';

  @Output()
  leftClick = '';

  @Output()
  rightClick = '';

  constructor() { }

  ngOnInit() {
  }

}
