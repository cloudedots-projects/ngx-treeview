import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { includes, isNil } from 'lodash';
import { DefaultNgxTreeviewEventParser, NgxTreeviewEventParser } from '../../helpers/ngx-treeview-event-parser';
import { NgxTreeviewHelper } from '../../helpers/ngx-treeview-helper';
import { NgxTreeviewConfig } from '../../models/ngx-treeview-config';
import { NgxTreeviewHeaderTemplateContext } from '../../models/ngx-treeview-header-template-context';
import { NgxTreeviewItem, NgxTreeviewSelection } from '../../models/ngx-treeview-item';
import { NgxTreeviewItemTemplateContext } from '../../models/ngx-treeview-item-template-context';

class FilterNgxTreeviewItem extends NgxTreeviewItem {
  private readonly refItem: NgxTreeviewItem;
  constructor(item: NgxTreeviewItem) {
    super({
      text: item.text,
      value: item.value,
      disabled: item.disabled,
      checked: item.checked,
      collapsed: item.collapsed,
      children: item.children
    });
    this.refItem = item;
  }

  updateRefChecked(): void {
    this.children.forEach(child => {
      if (child instanceof FilterNgxTreeviewItem) {
        child.updateRefChecked();
      }
    });

    let refChecked = this.checked;
    if (refChecked) {
      for (const refChild of this.refItem.children) {
        if (!refChild.checked) {
          refChecked = false;
          break;
        }
      }
    }
    this.refItem.checked = refChecked;
  }
}

@Component({
  selector: 'ngx-treeview',
  templateUrl: './ngx-treeview.component.html',
  styleUrls: ['./ngx-treeview.component.scss']
})
export class NgxTreeviewComponent implements OnChanges, OnInit {

  @Input() headerTemplate: TemplateRef<NgxTreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<NgxTreeviewItemTemplateContext>;
  @Input() items: NgxTreeviewItem[];
  @Input() config: NgxTreeviewConfig;
  @Input() eventParser: NgxTreeviewEventParser;
  @Output() selectedChange = new EventEmitter<any[]>();
  @Output() filterChange = new EventEmitter<string>();
  defaultConfig = new NgxTreeviewConfig();
  defaultEventParser = new DefaultNgxTreeviewEventParser();
  headerTemplateContext: NgxTreeviewHeaderTemplateContext;
  allItem: NgxTreeviewItem;
  filterText = '';
  filterItems: NgxTreeviewItem[];
  selection: NgxTreeviewSelection;

  constructor() {
    this.config = this.defaultConfig;
    this.eventParser = this.defaultEventParser;
    this.allItem = new NgxTreeviewItem({ text: 'All', value: undefined });
  }

  get hasFilterItems(): boolean {
    return !isNil(this.filterItems) && this.filterItems.length > 0;
  }

  get maxHeight(): string {
    return `${this.config.maxHeight}`;
  }

  ngOnInit(): void {
    this.createHeaderTemplateContext();
    this.generateSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const itemsSimpleChange = changes['items'];
    if (!isNil(itemsSimpleChange) && !isNil(this.items)) {
      this.updateFilterItems();
      this.updateCollapsedOfAll();
      this.raiseSelectedChange();
    }
  }

  onAllCollapseExpand(): void {
    this.allItem.collapsed = !this.allItem.collapsed;
    this.filterItems.forEach(item => item.setCollapsedRecursive(this.allItem.collapsed));
  }

  onFilterTextChange(text: string): void {
    this.filterText = text;
    this.filterChange.emit(text);
    this.updateFilterItems();
  }

  onAllCheckedChange(): void {
    const checked = this.allItem.checked;
    this.filterItems.forEach(item => {
      item.setCheckedRecursive(checked);
      if (item instanceof FilterNgxTreeviewItem) {
        item.updateRefChecked();
      }
    });

    this.raiseSelectedChange();
  }

  onItemCheckedChange(item: NgxTreeviewItem, checked: boolean): void {
    if (item instanceof FilterNgxTreeviewItem) {
      item.updateRefChecked();
    }

    this.updateCheckedOfAll();
    this.raiseSelectedChange();
  }

  raiseSelectedChange(): void {
    this.generateSelection();
    const values = this.eventParser.getSelectedChange(this);
    setTimeout(() => {
      this.selectedChange.emit(values);
    });
  }

  private createHeaderTemplateContext(): void {
    this.headerTemplateContext = {
      config: this.config,
      item: this.allItem,
      onCheckedChange: () => this.onAllCheckedChange(),
      onCollapseExpand: () => this.onAllCollapseExpand(),
      onFilterTextChange: (text) => this.onFilterTextChange(text)
    };
  }

  private generateSelection(): void {
    let checkedItems: NgxTreeviewItem[] = [];
    let uncheckedItems: NgxTreeviewItem[] = [];
    if (!isNil(this.items)) {
      const selection = NgxTreeviewHelper.concatSelection(this.items, checkedItems, uncheckedItems);
      checkedItems = selection['checked'];
      uncheckedItems = selection['unchecked'];
    }

    this.selection = {
      checkedItems,
      uncheckedItems
    };
  }

  private updateFilterItems(): void {
    if (this.filterText !== '') {
      const filterItems: NgxTreeviewItem[] = [];
      const filterText = this.filterText.toLowerCase();
      this.items.forEach(item => {
        const newItem = this.filterItem(item, filterText);
        if (!isNil(newItem)) {
          filterItems.push(newItem);
        }
      });
      this.filterItems = filterItems;
    } else {
      this.filterItems = this.items;
    }

    this.updateCheckedOfAll();
  }

  private filterItem(item: NgxTreeviewItem, filterText: string): NgxTreeviewItem {
    const isMatch = includes(item.text.toLowerCase(), filterText);
    if (isMatch) {
      return item;
    } else {
      if (!isNil(item.children)) {
        const children: NgxTreeviewItem[] = [];
        item.children.forEach(child => {
          const newChild = this.filterItem(child, filterText);
          if (!isNil(newChild)) {
            children.push(newChild);
          }
        });
        if (children.length > 0) {
          const newItem = new FilterNgxTreeviewItem(item);
          newItem.collapsed = false;
          newItem.children = children;
          return newItem;
        }
      }
    }

    return undefined;
  }

  private updateCheckedOfAll(): void {
    let itemChecked: boolean = null;
    for (const filterItem of this.filterItems) {
      if (itemChecked === null) {
        itemChecked = filterItem.checked;
      } else if (itemChecked !== filterItem.checked) {
        itemChecked = undefined;
        break;
      }
    }

    if (itemChecked === null) {
      itemChecked = false;
    }

    this.allItem.checked = itemChecked;
  }

  private updateCollapsedOfAll(): void {
    let hasItemExpanded = false;
    for (const filterItem of this.filterItems) {
      if (!filterItem.collapsed) {
        hasItemExpanded = true;
        break;
      }
    }

    this.allItem.collapsed = !hasItemExpanded;
  }

}
