import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../apicall.service';
import { ProcessSale } from '../sale/processSale';
import { SaleOrderProcess } from './processAndUpdateSale';
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-newsaleorder',
  templateUrl: './newsaleorder.component.html',
  styleUrls: ['./newsaleorder.component.scss']
})
export class NewsaleorderComponent implements OnInit {

  constructor(private api : ApicallService,private route : Router, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.params.subscribe(params=>{
      if(params['SaleId'] != "" && params['SaleId'] !=undefined)
      {
        this.Type="EditSale"
        this.title="Edit Sale"
        this.getSaleDetail(params['SaleId'])
      }
      else
      {
        let date = new Date().toISOString().split('T')[0]
        this.model['CreatedDate'] = date
      }
    })
   }

  ngOnInit() {
    this.getItemList()
    this.getSchoolList()
  }
  ItemList = []
  SchoolList = []
  dataRows = []

  Type="NewSale"
  title="New Sale"
totaldiscount=0;

  model = {
    SaleId : '',
    CustomerName : '',
    SchoolId : '',
    TotalAmount : '',
    discount : '',
    NetAmount : '',
    ListId : -1,
    CreatedDate : '',
    taxtype:'cgst',
    taxamount:'',
    billtype:'Cash'
  }
  
  saveSale = new ProcessSale(this.api)
  processSale = new SaleOrderProcess(this.api)
  
  getItemList()
  {
    let qry = "Select ItemId,ItemName,Qty,rate,tex_rate,HsnCode from item"
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe(item=>{
     this.ItemList = item['data']
     console.log("Item List :",item)
    })
  }

  getSchoolList()
  {
    let qry = "Select SchoolId,SchoolName,discount from t_school_master order by SchoolId"
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe(school=>{
      this.SchoolList = school['data']
      this.model['SchoolId'] = this.SchoolList[0]['SchoolId']
      console.log("Item List :",school)
     })
  }

  addrow()
  {
    let saleDetailModel = {
      'ItemId' : this.ItemList[0]['ItemId'],
      'rate' : this.ItemList[0]['rate'],
      'Quantity' : 1,
      'disc' : 0,
      'discrate':0,
      'HsnCode' : this.ItemList[0]['HsnCode'],
      'Qty' : this.ItemList[0]['Qty'],
      'NetPrice' : this.ItemList[0]['rate'],
      'tex_rate' : this.ItemList[0]['tex_rate'],
      'taxamount' : this.ItemList[0]['taxamount']
    }
   debugger
    this.dataRows.push(saleDetailModel)
    this.dataRows = [...this.dataRows]
    this.updateNetPrice(this.dataRows.length-1)
    this.updateTotalAmount()
    console.log("Added Sale detail model : ",saleDetailModel)
  }

  deleterow(index)
  {
    this.dataRows.splice(index,1)
    this.dataRows = [...this.dataRows]
    this.updateTotalAmount()
    this.updateTotaltax()
  }
  updateItem(index,col,value)
  {
    let qry = `Select i.ItemId, 
    (ifnull(item.Qty,0))-sum(ifnull(Quantity,0)) balance from item i  left join t_doc_detail item  on item.ItemId =i.ItemId  left JOIN t_sale_detail  on t_sale_detail.ItemId=i.ItemId where i.ItemId= ${value} GROUP by i.ItemId`
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe(itemstock=>{
     let data = itemstock['data']
     if(data[0].balance>0){
      this.dataRows[index][col] = value
      this.updateRow(index)
     }
     else{
      this.dataRows.splice(index,1)
      this.dataRows = [...this.dataRows]
       alert("Item stock is 0");
     }
    
    })
   
  }

  update(index,col,value)
  {
    this.dataRows[index][col] = value
    this.updateRow(index)
  }
  update1(index,col,value)
  {
    this.dataRows[index][col] = value
    this.updateRow1(index)
  }

  updateRow(index)
  {
    debugger
    let ItemId = this.dataRows[index]['ItemId']
    this.ItemList.forEach(item=>{
      if(item['ItemId'] == ItemId)
      {
        this.dataRows[index]['rate'] = item['rate']
        this.dataRows[index]['Qty'] = item['Qty']
        this.dataRows[index]['tex_rate'] = item['tex_rate']
        this.dataRows[index]['HsnCode'] = item['HsnCode']
        // this.dataRows[index]['taxamount'] = Number( item['rate'])* Number(item['Qty'])
      }
    })
    this.updateNetPrice(index)
  }

  
  updateRow1(index)
  {
    debugger
    let ItemId = this.dataRows[index]['ItemId']
    this.ItemList.forEach(item=>{
      if(item['ItemId'] == ItemId)
      {
        //this.dataRows[index]['rate'] = item['rate']
        this.dataRows[index]['Qty'] = item['Qty']
        this.dataRows[index]['tex_rate'] = item['tex_rate']
        this.dataRows[index]['HsnCode'] = item['HsnCode']
        // this.dataRows[index]['taxamount'] = Number( item['rate'])* Number(item['Qty'])
      }
    })
    this.updateNetPrice(index)
  }


  

  updateNetPrice(index)
  {
    let amount = 0
    let rate  = Number(this.dataRows[index]['rate'])
    let quantity = Number(this.dataRows[index]['Quantity'])
    let tax = Number(this.dataRows[index]['tex_rate'])
    let disc =  Number(this.dataRows[index]['disc'])

if(disc>0){
  this.dataRows[index]['discrate'] = rate*(disc)/100;
  
  rate = rate-(rate*(disc)/100)
 

}
    let tax_amount = (rate * (tax)/100)
    this.dataRows[index]['NetPrice'] = String(((rate+tax_amount)*quantity).toFixed(2))
    this.dataRows[index]['taxamount'] = String((tax_amount*quantity).toFixed(2))
    this.dataRows = [...this.dataRows]
    this.updateTotaltax()
    this.updateTotalAmount()
  }

  updateTotalAmount()
  {
    let totalamount = 0
    this.dataRows.forEach(row=>{
      totalamount += Number(row['NetPrice'])
    })
    this.model['TotalAmount'] = String(totalamount.toFixed(2))
    
    this.applydiscount()
  }

  updateTotaltax()
  {
    let taxamount = 0
    this.dataRows.forEach(row=>{
      taxamount += Number(row['taxamount'])
    })
    this.model['taxamount'] = String(taxamount.toFixed(2))
    
    
  }

 applydiscount()
 {
    let discount = Number(this.model['discount'])
    let totalamount = Number(this.model['TotalAmount'])
    let discountamount = totalamount * (discount/100)
    this.model['NetAmount'] = String((totalamount-discountamount).toFixed(2))
 }

  submit()
  {
    console.log("Sale Model : ",this.model)
    console.log("Sale detail :",this.dataRows)

    if(this.isValid())
    {
      if(this.Type=="NewSale")
      {
        this.processNewSale()
      }
      else
      {
        this.updateSale()
      }
    }
  }

  isValid()
  {
    let valid = true
    let errorMessage = ""
    this.totaldiscount=0;
    this.dataRows.forEach(row=>{
      let count = 0
    
    //  this.totaldiscount = this.totaldiscount;//+row['discrate'];
      this.dataRows.forEach(nextRow=>{
          if(Number(row['ItemId']) == Number(nextRow['ItemId']))
          {
            count++;
          }
          if(count > 1)
          {
            valid = false;
            errorMessage ="Multiple Item with same name"
          }
      })
    })
    if(this.model['CustomerName']=='')
    {
      valid = false;
      errorMessage="\nCustomer Name can't be empty\n"
    }

    if(!valid)
    {
      alert(errorMessage)
    }
    return valid
  }

  processNewSale()
  {
    debugger
   console.log(this.totaldiscount);
   this.model['discount']= (this.totaldiscount).toString();
    this.processSale.insertintoSaleMaster(this.model).subscribe(SaleId=>{
      this.processSale.insertintoSaleDetail(this.dataRows,SaleId).subscribe(data=>{
        this.model['SaleId']= String(SaleId)
        alert("Sale Processed\nSale Id : "+SaleId)
        this.route.navigateByUrl("/salebrowser")
      },err=>{
        console.log("Error while inserting into sale detail")
      })
    },err=>{
      console.log("Error while inserting into Sale Master",err)
    })
    this.processSale.updateItemMaster(this.dataRows)
    
    
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  //for updating Sale

  getSaleDetail(SaleId)
  {
    this.processSale.getSale(SaleId).subscribe(data=>{
      this.model = data[0]['data'][0]
      this.dataRows = data[1]['data']
      this.processSale.setOldDataRow(JSON.parse(JSON.stringify(data[1]['data'])))
    })
  }

  updateSale()
  {
    this.processSale.updateSaleMaster(this.model).subscribe(data=>{
      console.log("Updated Sale Master")
    })
    
    this.processSale.updateSaleDetail(this.dataRows,Number(this.model['SaleId'])).subscribe(data=>{
      console.log("old rows deleted from sale detail")
      this.processSale.insertintoSaleDetail(this.dataRows,this.model['SaleId']).subscribe(data=>{
        console.log("new rows inserted into datarows")
        alert("Sale detail updated")
        this.route.navigateByUrl("/salebrowser")
      })
    })

    this.processSale.updateSaleItemQuantity(this.dataRows).subscribe(()=>{
      console.log("Item quantity udpated")
    })
  }

  printInvoice() // function to generate invoice data
  {
    debugger
      localStorage.setItem("invoice",JSON.stringify({"form":this.model,"table":this.dataRows})) // storing data to print on invoice
      this.route.navigateByUrl('/print/newprint') // taking to the invoice print page
  }
}
