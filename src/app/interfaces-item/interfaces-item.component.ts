import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'interfaces-item',
  templateUrl: './interfaces-item.component.html',
  styleUrls: ['./interfaces-item.component.css'],
  host:{
    style:'cusor:pointer;display:block;margin-bottom:8px;'
  }
})
export class InterfacesItemComponent implements OnInit {

  @Input()
  empty: boolean;

  @Input()
  head : string;

  @Input()
  body: string;

  @Input()
  tail: string;

  constructor() {
    this.empty = false;
    this.head = "";
    this.body = "";
    this.tail = "";
  }

  ngOnInit() {
  }

}
