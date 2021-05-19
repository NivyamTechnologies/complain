import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../apicall.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sale-browser',
  templateUrl: './sale-browser.component.html',
  styleUrls: ['./sale-browser.component.scss']
})
export class SaleBrowserComponent implements OnInit {

  constructor(private api : ApicallService, private route : Router) { }

  ngOnInit() {
    this.getdata()
  }

  dataRows = []
  dataColumns = [
    {name : 'Customer Name',prop : 'CustomerName'},
    {name : 'Id', prop : 'SchoolId'},
    {name : 'ListId', prop : 'ListId'},
    {name : 'Total Amount', prop : 'TotalAmount'},
    {name : 'Discount', prop : 'discount'},
    {name : 'Net Price', prop : 'NetPrice'},
    {name : 'Created Date', prop : 'CreatedDate'}
  ]

  getdata()
  {
   
    this.api.Post("/total/getBrowser",{Condition : "where 1=1"},["EntityName=Sale"]).subscribe(data=>{
      // this.dataRows = data['data']
      console.log("browserdata",data)
      this.dataColumns = data['Columns']
      this.dataRows = data['Data']['data']
      this.dataRows = [...this.dataRows]
    })
  }

  editSale(row)
  {
    let route = '/sale'
    if(Number(row['ListId']) == -1)
    {
      route='/saleorder'
    }
    this.route.navigate([route,{SaleId : row['SaleId']}])
  }

  deleteSale(SaleId,rowIndex)
  {
    let qry = "Delete from t_sale_master where SaleId = "+SaleId
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe(()=>{
      alert("Sale delete Successfully")
      this.dataRows.splice(rowIndex,1)
      this.dataRows = [...this.dataRows]
    })
  }

  exportToExcel()
  {
    let qry = "Select * from t_sale_master"
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe((data)=>{
      console.log(data)
      this.api.exportToExcel(data['data'],"Sale")
    })
  }

}
