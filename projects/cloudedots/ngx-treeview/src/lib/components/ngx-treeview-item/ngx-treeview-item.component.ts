import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { isNil } from 'lodash';
import { NgxTreeviewConfig } from '../../models/ngx-treeview-config';
import { NgxTreeviewItem } from '../../models/ngx-treeview-item';
import { NgxTreeviewItemTemplateContext } from '../../models/ngx-treeview-item-template-context';

@Component({
  selector: 'ngx-treeview-item',
  templateUrl: './ngx-treeview-item.component.html',
  styleUrls: ['./ngx-treeview-item.component.scss']
})
export class NgxTreeviewItemComponent {
  @Input() config: NgxTreeviewConfig;
  @Input() template: TemplateRef<NgxTreeviewItemTemplateContext>;
  @Input() item: NgxTreeviewItem;
  @Output() checkedChange = new EventEmitter<boolean>();
  defaultConfig = new NgxTreeviewConfig();

  constructor() {
    this.config = this.defaultConfig;
  }

  onCollapseExpand = () => {
    this.item.collapsed = !this.item.collapsed;
  }

  onCheckedChange = () => {
    const checked = this.item.checked;
    if (!isNil(this.item.children) && !this.config.decoupleChildFromParent) {
      this.item.children.forEach(child => child.setCheckedRecursive(checked));
    }
    this.checkedChange.emit(checked);
  }

  onChildCheckedChange(child: NgxTreeviewItem, checked: boolean): void {
    if (!this.config.decoupleChildFromParent) {
      let itemChecked: boolean = null;
      for (const childItem of this.item.children) {
        if (itemChecked === null) {
          itemChecked = childItem.checked;
        } else if (itemChecked !== childItem.checked) {
          itemChecked = undefined;
          break;
        }
      }

      if (itemChecked === null) {
        itemChecked = false;
      }

      if (this.item.checked !== itemChecked) {
        this.item.checked = itemChecked;
      }

    }

    this.checkedChange.emit(checked);
  }
}
