import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


// Components
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ErrorComponent } from './error/error.component';
import { AppMaterialModule } from "../app-material.module";
import {MatSelectModule} from '@angular/material/select';

// Routing
import { UiRoute} from "./ui.routes";
import { RouterModule} from "@angular/router";
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
// Services
import { ContractService } from "../services/contract/contract.service";
import { ThreeBox } from "../services/3box.service";
import { PurchaseComponent } from './purchase/purchase.component'

@NgModule({
  declarations: [
    AccountComponent,
    HomeComponent,
    TopNavComponent,
    TransactionComponent,
    ErrorComponent,
    PurchaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UiRoute),
    AppMaterialModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [
    TopNavComponent,
    HomeComponent
  ],
  providers: [
    ContractService,
    ThreeBox
  ],
})
export class UiModule { }
