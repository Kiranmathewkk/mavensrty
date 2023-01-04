import { Component, OnInit } from '@angular/core';
import { Environment } from 'prismjs';
import { environment } from 'src/environments/environment';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerContainerCssClasses: string = '';
  public env = environment;
  currentDateStr: string = new Date().getFullYear().toString();
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.footerContainerCssClasses =
      this.layout.getStringCSSClasses('footerContainer');
  }
}
