import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitter-gst-widget',
  templateUrl: './twitter-gst.component.html',
})
export class TwitterGstComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // (<any>window).twttr.widgets.load();
  }
}
