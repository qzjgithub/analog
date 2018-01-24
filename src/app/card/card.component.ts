import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  empty = false;

  @Input()
  data : any;

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
  leftDisabled = false;

  @Input()
  rightText = '';

  @Output()
  leftClick : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  rightClick : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  leftAction(e){
    if(this.leftDisabled) return;
    this.leftClick.emit(this.data);
  }

  rightAction(e){
    this.rightClick.emit(this.data);
  }
}
