import { NgModule } from '@angular/core';
import { NgxTreeviewComponent } from './components/ngx-treeview/ngx-treeview.component';
import { NgxTreeviewItemComponent } from './components/ngx-treeview-item/ngx-treeview-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NgxTreeviewComponent,
    NgxTreeviewItemComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    NgxTreeviewComponent,
    NgxTreeviewItemComponent
  ]
})
export class NgxTreeviewModule { }
