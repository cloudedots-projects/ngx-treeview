export class NgxTreeviewConfig {
  hasAllCheckBox = true;
  hasFilter = false;
  hasCollapseExpand = false;
  decoupleChildFromParent = false;
  maxHeight = 500;
  filterPlaceholder = 'Filter';
  filterNoItemsFoundText = 'No items found';
  allCheckBoxLabel = 'All';

  get hasDivider(): boolean {
    return this.hasFilter || this.hasAllCheckBox || this.hasCollapseExpand;
  }

  getTooltipCollapseExpandText(isCollapse: boolean): string {
    return isCollapse ? 'Expand' : 'Collapse';
  }

  public static create(fields?: {
    hasAllCheckBox?: boolean,
    hasFilter?: boolean,
    hasCollapseExpand?: boolean,
    decoupleChildFromParent?: boolean
    maxHeight?: number,
    filterPlaceholder?: string,
    allCheckBoxLabel?: string,
    getTooltipCollapseExpandText?: (isCollapse: boolean) => string,
  }): NgxTreeviewConfig {
    const config = new NgxTreeviewConfig();
    Object.assign(config, fields);
    return config;
  }
}
