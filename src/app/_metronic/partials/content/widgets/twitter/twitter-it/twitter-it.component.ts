import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitter-it-widget',
  templateUrl: './twitter-it.component.html',
})
export class TwitterItComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // (<any>window).twttr.widgets.load();
  }
}
