import { Routes } from '@angular/router';

// Components
import {AccountComponent} from "./account/account.component";
import {ErrorComponent} from "./error/error.component";
import { PurchaseComponent } from './purchase/purchase.component';
import {TransactionComponent} from "./transaction/transaction.component";

export const UiRoute: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'money', component: TransactionComponent },
  { path: 'home', component: PurchaseComponent},
  { path: 'account', component: AccountComponent},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '/404' },
];
