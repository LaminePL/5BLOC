import { Component, OnInit } from "@angular/core";
import { ContractService } from "src/app/services/contract/contract.service";

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

  constructor(private contract: ContractService) {
    contract.connectAccount()
    .then((value: any) => {

      this.direction = value[0];
      this.showTickets(this.direction)
    })
    .catch((error: any) => {
      console.log(error);
      contract.failure(
        "Could't get the account data, please check if metamask is running correctly and refresh the page"
      );
    });

  }

  ngOnInit(): void {
    }
  showTickets(address) {
    this.contract
      .showTickets(address)
      .then((r) => {
        this.transactionHistory = r
        console.log(this.transactionHistory)

        this.contract.success();
      })
      .catch((e) => {
        this.contract.failure("Transaction failed");
      });
  }


}
