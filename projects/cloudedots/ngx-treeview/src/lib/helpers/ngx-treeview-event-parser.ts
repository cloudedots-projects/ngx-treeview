import { isNil } from 'lodash';
import { NgxTreeviewComponent } from '../components/ngx-treeview/ngx-treeview.component';
import { NgxTreeviewItem } from '../models/ngx-treeview-item';


export abstract class NgxTreeviewEventParser {
  abstract getSelectedChange(component: NgxTreeviewComponent): any[];
}

export class DefaultNgxTreeviewEventParser extends NgxTreeviewEventParser {
  getSelectedChange(component: NgxTreeviewComponent): any[] {
    const checkedItems = component.selection.checkedItems;
    if (!isNil(checkedItems)) {
      return checkedItems.map(item => item.value);
    }

    return [];
  }
}

export interface DownlineNgxTreeviewItem {
  item: NgxTreeviewItem;
  parent: DownlineNgxTreeviewItem;
}

export class DownlineNgxTreeviewEventParser extends NgxTreeviewEventParser {
  getSelectedChange(component: NgxTreeviewComponent): any[] {
    const items = component.items;
    if (!isNil(items)) {
      let result: DownlineNgxTreeviewItem[] = [];
      items.forEach(item => {
        const links = this.getLinks(item, null);
        if (!isNil(links)) {
          result = result.concat(links);
        }
      });

      return result;
    }

    return [];
  }

  private getLinks(item: NgxTreeviewItem, parent: DownlineNgxTreeviewItem): DownlineNgxTreeviewItem[] {
    if (!isNil(item.children)) {
      const link = {
        item,
        parent
      };
      let result: DownlineNgxTreeviewItem[] = [];
      item.children.forEach(child => {
        const links = this.getLinks(child, link);
        if (!isNil(links)) {
          result = result.concat(links);
        }
      });

      return result;
    }

    if (item.checked) {
      return [{
        item,
        parent
      }];
    }

    return null;
  }
}

export class OrderDownlineNgxTreeviewEventParser extends NgxTreeviewEventParser {
  private currentDownlines: DownlineNgxTreeviewItem[] = [];
  private parser = new DownlineNgxTreeviewEventParser();

  getSelectedChange(component: NgxTreeviewComponent): any[] {
    const newDownlines: DownlineNgxTreeviewItem[] = this.parser.getSelectedChange(component);
    if (this.currentDownlines.length === 0) {
      this.currentDownlines = newDownlines;
    } else {
      const intersectDownlines: DownlineNgxTreeviewItem[] = [];
      this.currentDownlines.forEach(downline => {
        let foundIndex = -1;
        const length = newDownlines.length;
        for (let i = 0; i < length; i++) {
          if (downline.item.value === newDownlines[i].item.value) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex !== -1) {
          intersectDownlines.push(newDownlines[foundIndex]);
          newDownlines.splice(foundIndex, 1);
        }
      });

      this.currentDownlines = intersectDownlines.concat(newDownlines);
    }

    return this.currentDownlines;
  }
}

