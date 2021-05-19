import {NgModule} from '@angular/core'
import {Routes,RouterModule} from '@angular/router'
import { InvoiceComponent } from './invoice/invoice.component'
import { NewprintComponent } from './newprint/newprint.component'

const routes : Routes = [{
    path : '',
    children : [
        {
            path : 'invoice',
            component : InvoiceComponent,
            data : {
                title : 'Invoice',
                icon : 'ti-layers',
                status : true
            }
        },
        {
            path : 'newprint',
            component : NewprintComponent,
            data : {
                title : 'Newprint',
                icon : 'ti-layers',
                status : true
            }
        }
    ]
}]

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})

export class PrintRoutingModule{}