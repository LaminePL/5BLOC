import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {

  currentAddress: string;
  constructor(private contractService: ContractService, private notifacationService: NotificationService) { }

  async ngOnInit() {

    this.currentAddress = (await this.contractService.connectAccount())[0]
  }

}
