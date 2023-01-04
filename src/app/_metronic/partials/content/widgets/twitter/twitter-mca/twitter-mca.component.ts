import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitter-mca-widget',
  templateUrl: './twitter-mca.component.html',
})
export class TwitterMcaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // (<any>window).twttr.widgets.load();

  } 

}
