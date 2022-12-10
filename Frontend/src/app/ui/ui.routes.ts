import { Routes } from '@angular/router';

// Components
import {AccountComponent} from "./account/account.component";
import { CardListComponent } from './card-list/card-list.component';
import { CreateCardComponent } from './create-card/create-card.component';
import {ErrorComponent} from "./error/error.component";
import { HomeComponent } from './home/home.component';
import { MyCardsComponent } from './my-cards/my-cards.component';
import { PurchaseComponent } from './purchase/purchase.component';
import {TransactionComponent} from './transaction/transaction.component'
export const UiRoute: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'buy-ticket', component: PurchaseComponent },
  { path: 'ticket-list', component: TransactionComponent },
  { path: 'account', component: AccountComponent},
  { path: 'account', component: AccountComponent},

  { path: 'create-card', component: CreateCardComponent},
  { path: 'card-list', component: CardListComponent},
  { path: 'my-cards', component: MyCardsComponent},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '/404' },
];
