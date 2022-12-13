import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card, CardNFT } from 'src/app/models/card.model';
import { CardNFTResponse } from 'src/app/models/cardNFTResponse.model';
import { ContractService } from 'src/app/services/contract/contract.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PinataService } from 'src/app/services/pinata/pinata.service';
import { environment } from 'src/environments/environment';
import { SendCardModalComponent } from '../send-card-modal/send-card-modal.component';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  @Input() address: string;
  displayedCards: CardNFT[] = [];
  isAdmin: boolean;
  constructor(private contract: ContractService,
    private pinataService: PinataService,
    public loader: LoaderService,
    private notifacationService: NotificationService,
    public dialog: MatDialog) { }

  async ngOnInit() {
    this.loadCards();
  }

  async buyCard(id, price) {
    try {

      this.loader.show();
      await this.contract.buyNFTCard(id, price)
      this.loader.hide();
      this.notifacationService.success("Card NFT buyed succefuly");
      await this.loadCards();

    } catch (err) {
      this.loader.hide();
      this.notifacationService.error("Error while transfering NFT cards");
    };
  }


  async sendCard(id) {
    const dialogRef = this.dialog.open(SendCardModalComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loader.show();
        this.contract.sendCard(res.to, id).then(async test => {
          this.loader.hide();
          this.notifacationService.success("Card NFT sended succefuly");
          await this.loadCards();
        }).catch(err => {
          this.loader.hide();
          this.notifacationService.error("Error while sending NFT card");
        });
      }
    })

  }

  async saleCard(id) {

    try {
      this.loader.show();
      await this.contract.saleCard(id);
      this.notifacationService.success("Card added to market");
      await this.loadCards();
      this.loader.hide();
    } catch (err) {
      this.loader.hide();
      this.notifacationService.error("Error while solding card");
    }

  }

  async stopSallingCard(id) {

    try {
      this.loader.show();
      await this.contract.stopSallingCard(id);
      this.notifacationService.success("Card removed from market");
      await this.loadCards();
      await this.loader.hide();
    } catch (err) {
      this.loader.hide();
      this.notifacationService.error("Error while solding card");
    }

  }

  async loadCards() {
    try {
      this.displayedCards = [];
      this.loader.show();
      this.isAdmin = await this.contract.accountIsAdmin();
      let currentAddress = this.contract.accounts[0];
      let nfts: CardNFTResponse[] = [];
      if (!!this.address)
        nfts = await this.contract.getAccountCards(this.address);
      else
        nfts = await this.contract.getMarketCards();
      nfts.forEach(nft => {

        this.pinataService.getCard(nft.uri).subscribe({

          next: card => {
            this.displayedCards.push({
              id: nft.id,
              card: card,
              inMarket: nft.inMarket,
              isOwner: nft.owner == currentAddress
            });
          }, error: err => {
            this.loader.hide();
            this.notifacationService.error("Error while fetching card from Pinata");
          }
        })
      });

      this.loader.hide();

    } catch (err) {
      this.loader.hide();
      this.notifacationService.error("Error while getting NFT cards");
    }
  }

}
