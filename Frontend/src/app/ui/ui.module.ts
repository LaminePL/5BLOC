import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


// Components
import { AccountComponent } from './account/account.component';
import { NavComponent } from './nav/nav.component';
import { ErrorComponent } from './error/error.component';


// Routing
import { UiRoute} from "./ui.routes";
import { RouterModule} from "@angular/router";

// Services
import { ContractService } from "../services/contract/contract.service";
import { CreateCardComponent } from './create-card/create-card.component';
import { MatInputModule } from '@angular/material/input';
import { CardListComponent } from './card-list/card-list.component';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from '../app-material.module';
import { MyCardsComponent } from './my-cards/my-cards.component';
import { SendCardModalComponent } from './send-card-modal/send-card-modal.component';




@NgModule({
  declarations: [
    AccountComponent,
    NavComponent,
    ErrorComponent,
    CreateCardComponent,
    CardListComponent,
    HomeComponent,
    MyCardsComponent,
    SendCardModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UiRoute),
    ReactiveFormsModule,
    AppMaterialModule,
    MatInputModule

  ],
  exports: [
    NavComponent
  ],
  providers: [
    ContractService
  ],
})
export class UiModule { }
