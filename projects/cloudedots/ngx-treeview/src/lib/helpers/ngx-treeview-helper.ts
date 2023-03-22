import { concat, isNil, pull } from 'lodash';
import { NgxTreeviewItem } from '../models/ngx-treeview-item';

export const NgxTreeviewHelper = {
  findItem,
  findItemInList,
  findParent,
  removeItem,
  concatSelection
};

function findItem(root: NgxTreeviewItem, value: any): NgxTreeviewItem {
  if (isNil(root)) {
    return undefined;
  }

  if (root.value === value) {
    return root;
  }

  if (root.children) {
    for (const child of root.children) {
      const foundItem = findItem(child, value);
      if (foundItem) {
        return foundItem;
      }
    }
  }

  return undefined;
}

function findItemInList(list: NgxTreeviewItem[], value: any): NgxTreeviewItem {
  if (isNil(list)) {
    return undefined;
  }

  for (const item of list) {
    const foundItem = findItem(item, value);
    if (foundItem) {
      return foundItem;
    }
  }

  return undefined;
}

function findParent(root: NgxTreeviewItem, item: NgxTreeviewItem): NgxTreeviewItem {
  if (isNil(root) || isNil(root.children)) {
    return undefined;
  }

  for (const child of root.children) {
    if (child === item) {
      return root;
    } else {
      const parent = findParent(child, item);
      if (parent) {
        return parent;
      }
    }
  }

  return undefined;
}

function removeItem(root: NgxTreeviewItem, item: NgxTreeviewItem): boolean {
  const parent = findParent(root, item);
  if (parent) {
    pull(parent.children, item);
    if (parent.children.length === 0) {
      parent.children = undefined;
    } else {
      parent.correctChecked();
    }
    return true;
  }

  return false;
}

function concatSelection(items: NgxTreeviewItem[], checked: NgxTreeviewItem[], unchecked: NgxTreeviewItem[]): { [k: string]: NgxTreeviewItem[] } {
  let checkedItems = [...checked];
  let uncheckedItems = [...unchecked];
  for (const item of items) {
    const selection = item.getSelection();
    checkedItems = concat(checkedItems, selection.checkedItems);
    uncheckedItems = concat(uncheckedItems, selection.uncheckedItems);
  }
  return {
    checked: checkedItems,
    unchecked: uncheckedItems
  };
}
