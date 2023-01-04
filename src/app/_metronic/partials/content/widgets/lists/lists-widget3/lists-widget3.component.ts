import { Component } from '@angular/core';

@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component {
  constructor() {}

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
  }
}
