import { ContractService } from "../../services/contract/contract.service";
import { Component } from "@angular/core";
import { NotificationService } from "src/app/services/notification/notification.service";


@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  direction: string;
  balance: string;


  constructor(
    private contract: ContractService,private notificationService:NotificationService
  ) {
    this.connectAccount();
  }



  connectAccount() {
    this.contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
        this.getDetails(this.direction);
      })
      .catch((error: any) => {
        this.notificationService.error(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  getDetails(account) {
    this.contract
      .accountInfo(account)
      .then((value: any) => {
        this.balance = value;
      })
      .catch((error: any) => {
       this.notificationService.error(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }
}
