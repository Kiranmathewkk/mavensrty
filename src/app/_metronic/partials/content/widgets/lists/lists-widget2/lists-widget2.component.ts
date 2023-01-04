import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-lists-widget2',
  templateUrl: './lists-widget2.component.html',
})
export class ListsWidget2Component {
  @Output() onAddEvent  = new EventEmitter();
  constructor() {}
  addNewItem() {
    this.onAddEvent.emit(true);
  }
}
