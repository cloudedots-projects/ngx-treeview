import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTreeviewModule } from '@cloudedots/ngx-treeview';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgxTreeviewModule
  ],
  exports: [
    FormsModule,
    NgxTreeviewModule
  ]
})
export class SharedModule { }
