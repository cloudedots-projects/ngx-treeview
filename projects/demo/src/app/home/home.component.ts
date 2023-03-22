import { Component, OnInit, ViewChild } from '@angular/core';
import { DefaultNgxTreeviewEventParser, DownlineNgxTreeviewEventParser, NgxTreeviewComponent, NgxTreeviewConfig, NgxTreeviewItem, OrderDownlineNgxTreeviewEventParser } from '@cloudedots/ngx-treeview';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('tree') tree: NgxTreeviewComponent;
  itemTemplateView = false;

  eventParser = new DefaultNgxTreeviewEventParser();
  config = NgxTreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 1000
  });

  nodes: NgxTreeviewItem[] = [
    new NgxTreeviewItem({
      text: 'Item 1',
      value: 'Item 1',
      checked: false,
      children: [
        new NgxTreeviewItem({
          text: 'Item 1.1',
          value: 'Item 1.1',
          checked: false,
          children: [
            new NgxTreeviewItem({
              text: 'Item 1.1.1',
              value: 'Item 1.1.1',
              checked: false,

            }),
            new NgxTreeviewItem({
              text: 'Item 1.2',
              value: 'Item 1.2',
              checked: false,
            }),
          ]
        }),
      ],
    }),
    new NgxTreeviewItem({
      text: 'Item 2',
      value: 'Item 2',
      checked: false,
      children: [
        new NgxTreeviewItem({
          text: 'Item 2.1',
          value: 'Item 2.1',
          checked: false,
        }),
        new NgxTreeviewItem({
          text: 'Item 2.2',
          value: 'Item 2.2',
          checked: true,
        }),
      ],
    }),
  ];

  constructor() { }

  ngOnInit() {
    console.log('tree: ', this.tree);
  }

  onFilterChange(value: string) {
    console.log('filter: ', value);
  }

  onSelectedChange(value: any) {
    console.log('selected: ', value);
  }

}
