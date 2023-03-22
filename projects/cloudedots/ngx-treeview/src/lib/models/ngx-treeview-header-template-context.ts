import { NgxTreeviewItem } from './ngx-treeview-item';
import { NgxTreeviewConfig } from './ngx-treeview-config';

export interface NgxTreeviewHeaderTemplateContext {
  config: NgxTreeviewConfig;
  item: NgxTreeviewItem;
  onCollapseExpand: () => void;
  onCheckedChange: (checked: boolean) => void;
  onFilterTextChange: (text: string) => void;
}
