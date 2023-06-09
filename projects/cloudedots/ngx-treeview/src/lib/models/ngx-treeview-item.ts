import { isBoolean, isNil, isString } from 'lodash';
import { NgxTreeviewHelper } from '../helpers/ngx-treeview-helper';

export interface NgxTreeviewSelection {
  checkedItems: NgxTreeviewItem[];
  uncheckedItems: NgxTreeviewItem[];
}

export interface NgxTreeItem {
  text: string;
  value: any;
  disabled?: boolean;
  checked?: boolean;
  collapsed?: boolean;
  children?: NgxTreeItem[];
}

export class NgxTreeviewItem {
  private internalDisabled = false;
  private internalChecked = true;
  private internalCollapsed = false;
  private internalChildren: NgxTreeviewItem[];
  text: string;
  value: any;

  constructor(item: NgxTreeItem, autoCorrectChecked = false) {
    if (isNil(item)) {
      throw new Error('Item must be defined');
    }
    if (isString(item.text)) {
      this.text = item.text;
    } else {
      throw new Error('A text of item must be string object');
    }
    this.value = item.value;
    if (isBoolean(item.checked)) {
      this.checked = item.checked;
    }
    if (isBoolean(item.collapsed)) {
      this.collapsed = item.collapsed;
    }
    if (isBoolean(item.disabled)) {
      this.disabled = item.disabled;
    }
    if (!isNil(item.children) && item.children.length > 0) {
      this.children = item.children.map(child => {
        if (this.disabled === true) {
          child.disabled = true;
        }

        return new NgxTreeviewItem(child);
      });
    }

    if (autoCorrectChecked) {
      this.correctChecked();
    }
  }

  get checked(): boolean {
    return this.internalChecked;
  }

  set checked(value: boolean) {
    if (!this.internalDisabled) {
      if (this.internalChecked !== value) {
        this.internalChecked = value;
      }
    }
  }

  get indeterminate(): boolean {
    return this.checked === undefined;
  }

  setCheckedRecursive(value: boolean): void {
    if (!this.internalDisabled) {
      this.internalChecked = value;
      if (!isNil(this.internalChildren)) {
        this.internalChildren.forEach(child => child.setCheckedRecursive(value));
      }
    }
  }

  get disabled(): boolean {
    return this.internalDisabled;
  }

  set disabled(value: boolean) {
    if (this.internalDisabled !== value) {
      this.internalDisabled = value;
      if (!isNil(this.internalChildren)) {
        this.internalChildren.forEach(child => child.disabled = value);
      }
    }
  }

  get collapsed(): boolean {
    return this.internalCollapsed;
  }

  set collapsed(value: boolean) {
    if (this.internalCollapsed !== value) {
      this.internalCollapsed = value;
    }
  }

  setCollapsedRecursive(value: boolean): void {
    this.internalCollapsed = value;
    if (!isNil(this.internalChildren)) {
      this.internalChildren.forEach(child => child.setCollapsedRecursive(value));
    }
  }

  get children(): NgxTreeviewItem[] {
    return this.internalChildren;
  }

  set children(value: NgxTreeviewItem[]) {
    if (this.internalChildren !== value) {
      if (!isNil(value) && value.length === 0) {
        throw new Error('Children must be not an empty array');
      }
      this.internalChildren = value;
      if (!isNil(this.internalChildren)) {
        let checked = null;
        this.internalChildren.forEach(child => {
          if (checked === null) {
            checked = child.checked;
          } else {
            if (child.checked !== checked) {
              checked = undefined;
              return;
            }
          }
        });
        this.internalChecked = checked;
      }
    }
  }

  getSelection(): NgxTreeviewSelection {
    let checkedItems: NgxTreeviewItem[] = [];
    let uncheckedItems: NgxTreeviewItem[] = [];
    if (isNil(this.internalChildren)) {
      if (this.internalChecked) {
        checkedItems.push(this);
      } else {
        uncheckedItems.push(this);
      }
    } else {
      const selection = NgxTreeviewHelper.concatSelection(this.internalChildren, checkedItems, uncheckedItems);
      checkedItems = selection['checked'];
      uncheckedItems = selection['unchecked'];
    }

    return {
      checkedItems,
      uncheckedItems
    };
  }

  correctChecked(): void {
    this.internalChecked = this.getCorrectChecked();
  }

  private getCorrectChecked(): boolean {
    let checked: boolean = null;
    if (!isNil(this.internalChildren)) {
      for (const child of this.internalChildren) {
        child.internalChecked = child.getCorrectChecked();
        if (checked === null) {
          checked = child.internalChecked;
        } else if (checked !== child.internalChecked) {
          checked = undefined;
          break;
        }
      }
    } else {
      checked = this.checked;
    }

    return checked;
  }
}
