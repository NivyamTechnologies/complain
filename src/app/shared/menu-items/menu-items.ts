import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [


  {
    label: '',
    main: [
      {
        state: 'item',
        short_label: 'P',
        main_state: 'forms',
        name: 'Add Item',
        type: 'link',
        icon: 'ti-pencil-alt',
        badge: [
          {
            type: 'warning',
            value: 'New'
          }
        ]
      },
      {
        state: 'party',
        short_label: 'S',
        main_state: 'forms',
        name: 'Add party',
        type: 'link',
        icon: 'ti-shortcode'
      },
      {
        state: 'purchase',
        short_label: 'FW',
        main_state: 'forms',
        name: 'purchase order',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'itemreport',
        short_label: 'FW',
        main_state: 'forms',
        name: 'item report',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'purchasereport',
        short_label: 'FW',
        main_state: 'forms',
        name: 'Purchase report',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'partyreport',
        short_label: 'FW',
        main_state: 'forms',
        name: 'Party report',
        type: 'link',
        icon: 'ti-crown'
      },
      // {
      //   state: 'list',
      //   short_label: 'FW',
      //   main_state: '',
      //   name: 'List',
      //   type: 'link',
      //   icon: 'ti-crown'
      // },
      // {
      //   state: 'listbrowser',
      //   short_label: 'FW',
      //   main_state: '',
      //   name: 'List Browser',
      //   type: 'link',
      //   icon: 'ti-crown'
      // },
      // {
      //   state: 'sale',
      //   short_label: 'FW',
      //   main_state: '',
      //   name: 'Sale',
      //   type: 'link',
      //   icon: 'ti-crown'
      // }, 
      {
        state: 'saleorder',
        short_label: 'FW',
        main_state: '',
        name: 'Sale Order',
        type: 'link',
        icon: 'ti-crown'
      },{
        state: 'salebrowser',
        short_label: 'FW',
        main_state: '',
        name: 'Sale Browser',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'school',
        short_label: 'FW',
        main_state: '',
        name: 'Customer',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'schoolbrowser',
        short_label: 'FW',
        main_state: '',
        name: 'Customer Browser',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'taxreport',
        short_label: 'FW',
        main_state: 'reports',
        name: 'Tax Report',
        type: 'link',
        icon: 'ti-crown'
      },

   {
        state: 'stockreport',
        short_label: 'FW',
        main_state: 'reports',
        name: 'Stock Report',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'stockvaluereport',
        short_label: 'FW',
        main_state: 'reports',
        name: 'Stock value Report',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'accountledger',
        short_label: 'FW',
        main_state: 'forms',
        name: 'Account Ledger',
        type: 'link',
        icon: 'ti-crown'
      },
      {
        state: 'ledgerbrowser',
        short_label: 'FW',
        main_state: '',
        name: 'Ledger Browser',
        type: 'link',
        icon: 'ti-crown'
      },

    ]
  }
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }
}
