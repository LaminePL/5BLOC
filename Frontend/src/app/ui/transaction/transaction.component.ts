import { Component, OnInit } from "@angular/core";
import { ContractService } from "src/app/services/contract/contract.service";
import {LoaderService} from "../../services/loader/loader.service";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  address: string;
  amount: number;
  direction: any;
  transactionHistory: any;

  constructor(private contract: ContractService,
              public loader: LoaderService,
              public dialog: MatDialog,
              private notifacationService: NotificationService) {
    contract.connectAccount()
    .then((value: any) => {

      this.direction = value[0];
      this.showTickets(this.direction)
    })
    .catch((error: any) => {
      console.log(error);
      this.notifacationService.error("Impossible de récuperer les informations du compte");

    });

  }

  ngOnInit(): void {
    }
  showTickets(address) {
    this.contract
      .showTickets(address)
      .then((r) => {
        this.transactionHistory = r
      })
      .catch((e) => {
        this.notifacationService.error("Impossible d'afficher les tickets'");
      });
  }


}
