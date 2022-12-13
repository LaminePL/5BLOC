import { Routes } from '@angular/router';
import { MetamaskGuard } from '../utils/metamask-guard';

// Components
import {AccountComponent} from "./account/account.component";
import { CardListComponent } from './card-list/card-list.component';
import { CreateCardComponent } from './create-card/create-card.component';
import {ErrorComponent} from "./error/error.component";
import { HomeComponent } from './home/home.component';
import { MyCardsComponent } from './my-cards/my-cards.component';
import { PurchaseComponent } from './purchase/purchase.component';
import {TicketListComponent} from './ticket-list/ticket-list.component'
export const UiRoute: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent ,canActivate:[MetamaskGuard]},
  { path: 'buy-ticket', component: PurchaseComponent,canActivate:[MetamaskGuard] },
  { path: 'ticket-list', component: TicketListComponent,canActivate:[MetamaskGuard] },
  { path: 'account', component: AccountComponent,canActivate:[MetamaskGuard]},
  { path: 'create-card', component: CreateCardComponent,canActivate:[MetamaskGuard]},
  { path: 'card-list', component: CardListComponent,canActivate:[MetamaskGuard]},
  { path: 'my-cards', component: MyCardsComponent,canActivate:[MetamaskGuard]},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '/404' },
];
