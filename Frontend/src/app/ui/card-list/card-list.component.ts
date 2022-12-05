import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card, CardNFT } from 'src/app/models/card.model';
import { NFTResponse } from 'src/app/models/nFTResponse.model';
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
  cards: CardNFT[] = [];
  isAdmin:boolean;
  constructor(private contract: ContractService,
     private pinataService: PinataService,
     public loader: LoaderService,
     private notifacationService : NotificationService,
     public dialog: MatDialog) { }

   ngOnInit() {
    this.loader.show();
    this.contract.accountIsAdmin().then(isAdmin =>{
      this.isAdmin = isAdmin;
    })
    let currentAdress = !!this.address ? this.address : environment.admin_address;
    this.contract.getAccountCards(currentAdress).then((nfts: NFTResponse[]) => {
      nfts.forEach(nft => {
        this.pinataService.getCard(nft.uri).subscribe({

          next: card => {
            this.cards.push({
              id: nft.id,
              card: card
            });
          }, error: err => {
            this.loader.hide();
            this.notifacationService.error("Error while fetching card from Pinata");
          }
        })
      });
      this.loader.hide();
    })
      .catch(err => {
        this.loader.hide();
        this.notifacationService.error("Error while getting NFT cards");
      });

  }

  buyCard(id, price) {
    this.loader.show();
    this.contract.buyNFTCard(id, price).then(test => {
      this.loader.hide();
      this.notifacationService.success("Card NFT buyed succefuly");
      this.ngOnInit();
    }).catch(err => {
      this.loader.hide();
      this.notifacationService.error("Error while transfering NFT cards");
    });
  }


  sendCard(id) {
    const dialogRef = this.dialog.open(SendCardModalComponent);
    dialogRef.afterClosed().subscribe( res => {
      if(res){
        console.log(res)
        this.loader.show();
        this.contract.sendNFTCard(res.to,id,res.price).then(test => {
          this.loader.hide();
          this.notifacationService.success("Card NFT sended succefuly");
          this.ngOnInit();
        }).catch(err => {
          this.loader.hide();
          this.notifacationService.error("Error while sending NFT card");
        });
      }
    })

  }

}
