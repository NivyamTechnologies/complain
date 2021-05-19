import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked,AfterContentChecked } from '@angular/core';
import {ProcessSale} from '../sale/processSale'
import {updateSale} from '../sale/updateSale'
import { ApicallService } from '../../apicall.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-saleorder',
  templateUrl: './saleorder.component.html',
  styleUrls: ['./saleorder.component.scss']
})
export class SaleorderComponent implements OnInit {

  constructor(private api : ApicallService,private activatedRoute : ActivatedRoute) {
    
    this.activatedRoute.params.subscribe(params=>{
      if(params['SaleId'] != "" && params['SaleId'] !=undefined)
      {
        this.Type="EditSale"
        this.title="Edit Sale"
        this.getSaleDetail(params['SaleId'])
      }
    })
   }

  ngOnInit() {
    this.getItemDetails()
    this.getSchoolList()
  }

  

  items = []
  rate = 0

  saleDetailModel = {
    'ItemId' : '',
    'rate' : '',
    'Quantity' : '',
    'NetPrice' : ''
  }

  model = {
    SaleId : '',
    CustomerName : '',
    SchoolId : '',
    TotalAmount : '',
    discount : '',
    NetAmount : '',
    ListId : -1
  }

  title="Sale"
  Type="NewSale"
  Quantity = 1
  edt = false
  processSale = new ProcessSale(this.api)
  updateSale = new updateSale(this.api)
  oldsaleDetail = []
  SchoolList = []
  dropdownValue(value,key)
  {
    this.model[key] = value
  }

  dataRows = []
 
 
//Get Details of item ...ItemId,rate,..etc
  getItemDetails()
  {
    let qry = "Select ItemId,ItemName,Qty,rate from item"
    this.api.Post("/users/executeSelectStatement",{Query : qry}).subscribe(item=>{
    
     
     this.items = item['data']
     if(this.Type=="NewSale")
     {
      this.saleDetailModel =  item['data'][0]
      this.saleDetailModel['ItemId'] = item['data'][0]['ItemId']
      this.saleDetailModel['rate'] = item['data'][0]['rate']
      this.saleDetailModel['Quantity'] = '1'
     }
     this.totalAmount()
     console.log(this.saleDetailModel)
     console.log(item['data'])
    })
  }

  getSchoolList()
  {
    this.api.getList("School").subscribe(res=>{
      this.SchoolList = res['data']
      if(this.model['SchoolId'] == '')
      {
        this.model['SchoolId'] = this.SchoolList[0]['Id']
      }
      this.schoolChange(this.model['SchoolId'])
    })
  }

  
  //On change of item change the value of rate as well
  itemChange()
  {
    this.items.forEach(item=>{
      if(item['ItemId'] == this.saleDetailModel['ItemId'])
      {
        this.saleDetailModel['rate'] = item['rate']
      }
    })
    this.totalAmount()
  }

  //Get the total amount i.e. rate * quantity of the item
  totalAmount()
  {
    try
    {
    console.log("Rate = "+this.saleDetailModel['rate'])
    this.model['TotalAmount'] = String(Number(this.saleDetailModel['rate'])* Number(this.saleDetailModel['Quantity']))
    this.applyDiscount()
    }
    catch(error)
    {
      console.log(error)
      this.model['TotalAmount'] = ''
    }
  }

  //apply discount to the item
  applyDiscount()
  {
    try
    {
      this.model['NetAmount'] = String(Number(this.model['TotalAmount']) - (Number(this.model['discount'])*Number(this.model['TotalAmount'])/100))
    }
    catch(error)
    {
      console.log(error)
      this.model['NetAmount'] = ''
    }
  }


  // Get the sale details of specified SaleId from sale master table and sale detail table
  getSaleDetail(SaleId)
  {
    this.updateSale.getSale(SaleId).subscribe(res=>{
      console.log(res)
      this.model = res[0]['data'][0]
      if(Array(res[1]['data']).length != 0)
      {
        this.saleDetailModel = res[1]['data'][0]
      }

      //storing the data from sale detail to updateSale class to get the updated item quantity
      this.updateSale.oldDataRows = JSON.parse(JSON.stringify(res[1]['data']))
    })
  }

  //Get the discount of the specified School 
  schoolChange(SchoolId)
  {
    this.processSale.getDiscountForSpecifiedSchool(SchoolId).subscribe((school)=>{
      this.model['discount'] = school['data'][0]['discount']
      this.applyDiscount()
    })
  }

  submit()
  {
    if(this.Type=="NewSale")
    {
      //call when process New sale
      this.processNewSale()
    }
    else
    {
      //call when edit the already sold
      this.EditSale()
    }
  }


  processNewSale()
  {
    //Insert into Sale master table
    this.processSale.insertintoSaleMaster(this.model).subscribe((SaleId:string)=>{
      console.log("Sale Successfull")
      console.log(this.saleDetailModel)
      this.model['SaleId'] = SaleId
      console.log("New SaleDetailObject",this.saleDetailModel)
      let saleDetail = []
      saleDetail.push(this.saleDetailModel)

      //insert into Sale detail table
      this.processSale.insertIntoSaleDetail(saleDetail,SaleId).subscribe(res=>{
        alert("Sale successful")
      },err=>{
        alert("Error while sale item")
      })
      
    },err=>{
      console.log(err)
    })
  }


  EditSale()
  {
    //Update sale in sale master table
    this.updateSale.updateSaleMaster(this.model).subscribe(res=>{
      console.log("Sale Master Updated")
    },err=>{
      console.log("Error while updating sale")
    })

    //Update sale in sale detail table
    this.updateSale.updateSaleDetail(Number(this.model['SaleId'])).subscribe(res=>{
      let saleDetail = []
      saleDetail.push(this.saleDetailModel)

      //insert updated sale detail into sale detail table
      this.processSale.insertIntoSaleDetail(saleDetail,this.model['SaleId']).subscribe(res=>{
        alert("Sale successful")
      },err=>{
        alert("Error while sale item")
      })
      alert("Sale updated")
    },()=>{
      alert("Error while updating sale item")
    })
    let saleDetail = []
    saleDetail.push(this.saleDetailModel)

    //Update the Quantity of item in item table 
    this.updateSale.getUpdatedItemQuantity(saleDetail).subscribe(res=>{
      console.log("Item quantity updated in item table")
    },()=>{
      console.log("Error while updating item quantity")
    })
  }

  addRow()
  {
    this.dataRows.push(this.saleDetailModel)
    this.dataRows = [...this.dataRows]
  }

  update(col,value,index)
  {
    this.dataRows[index][col] = value
    this.dataRows = [...this.dataRows]
  }
}
