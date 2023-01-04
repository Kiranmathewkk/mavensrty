import { Component, Input, OnInit } from '@angular/core';

import { Tab, tabs } from '../tabs';

@Component({
  selector: 'app-tabs-aside',
  templateUrl: './tabs-aside.component.html',
})
export class TabsAsideComponent implements OnInit {
  @Input() activeTab: Tab = tabs[0];
  newTab: any[];
  @Input() setActiveTab: (
    activeTabLink:
      | 'companies'
      | 'menu'
      | 'subscription'
      | 'tasks'
      | 'notifications'
      | 'authors'
     
  ) => void;
  allTabs: ReadonlyArray<Tab> = [];
  constructor() {}

  ngOnInit(): void {
    this.allTabs = tabs;
    
    
     
  }
}
