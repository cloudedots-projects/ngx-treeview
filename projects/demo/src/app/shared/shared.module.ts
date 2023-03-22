import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTreeviewModule } from '@cloudedots/ngx-treeview';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxTreeviewModule
  ],
  exports: [
    NgxTreeviewModule
  ]
})
export class SharedModule { }
