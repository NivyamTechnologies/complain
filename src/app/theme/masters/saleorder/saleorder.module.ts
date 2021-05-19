import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleorderComponent } from './saleorder.component';
import { Routes,RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const routes : Routes = [{
  path : '',
  component : SaleorderComponent,
  data : {
    title : 'Sale Order',
    icon : 'ti-layers',
    status : true
  }
}]

@NgModule({
  declarations: [SaleorderComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class SaleorderModule { }
