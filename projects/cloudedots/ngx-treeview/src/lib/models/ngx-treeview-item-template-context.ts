import { NgxTreeviewItem } from './ngx-treeview-item';

export interface NgxTreeviewItemTemplateContext {
  item: NgxTreeviewItem;
  onCollapseExpand: () => void;
  onCheckedChange: () => void;
}
