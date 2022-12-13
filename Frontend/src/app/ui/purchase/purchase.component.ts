import { Component, OnInit } from '@angular/core';
import { ContractService } from "src/app/services/contract/contract.service";
import Swal from "sweetalert2";
import { LoaderService } from "../../services/loader/loader.service";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../../services/notification/notification.service";
import { CardNFTResponse } from "../../models/cardNFTResponse.model";
import { PinataService } from "../../services/pinata/pinata.service";
import { Card, CardNFT } from "../../models/card.model";
import { from } from 'rxjs';
import { map } from "rxjs/operators";


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  address: string;
  amount: number;
  direction: string;
  chosenTransport: string;
  departure: string;
  arrival: string;
  travelTime: string
  departureDay: string
  cards: CardNFT[] = [];
  hasCard: boolean = false;
  price = 1
  discountList = []
  clicked = false;


  stations: string[] = ['Lille', 'Lens', 'Valencienne', 'Paris']
  transportsList: string[] = ['Train', 'Bus', 'Metro'];
  horaires: string[] = ['08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30'];
  weekDay: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  constructor(private contract: ContractService,
    public loader: LoaderService,
    public dialog: MatDialog,
    private notifacationService: NotificationService,
    private pinataService: PinataService
  ) {


  }

  async ngOnInit() {
    this.direction = (await this.contract.connectAccount())[0]
    this.departure = 'Lille'
    this.arrival = 'Lens'
    this.chosenTransport = 'Bus'
    this.travelTime = '08:30'
    this.departureDay = 'Lundi'
    this.chekCard()

  }


  sendEth(e) {
    this.loader.show();
    let travelDayAndTime = this.departureDay + ' ' + this.travelTime;
    this.contract
      .buyTicket(this.departure, this.arrival, travelDayAndTime, this.chosenTransport, this.price.toString())
      .then((r) => {
        this.notifacationService.success("Votre ticket est  disponible dans votre espace mes tickets");
      })
      .catch((e) => {
        this.loader.hide();
        this.notifacationService.error("Impossible de valider votre achat!");
      });
    this.loader.hide();
  }


  chekCard() {

    this.contract.getAccountCards(this.direction).then((nfts: CardNFTResponse[]) => {
      nfts.forEach(nft => {
        this.pinataService.getCard(nft.uri).subscribe((res) => {
          if (res) {
            this.hasCard = true
          }
        })
      });
    });
  }

  checkNftCard() {

    this.contract.getAccountCards(this.direction).then((nfts: CardNFTResponse[]) => {
      nfts.forEach(nft => {
        this.pinataService.getCard(nft.uri).subscribe((res) => {
          if (res) {
            this.discountList.push(res.reduction)
            var max = this.discountList.reduce(function (a, b) {
              return Math.max(a, b);
            });
            Swal.fire({
              title: 'Vous avez une réduction de ' + max + "%  voulez vous l'activer",
              icon: 'question',
              confirmButtonText: 'Oui',
              cancelButtonText: 'Non',
              showCancelButton: true,
              showCloseButton: true
            }).then((result) => {
              if (result.value) {
                this.applyReduction(max)
              } else if (result.dismiss === Swal.DismissReason.cancel) {
              }
            })
          }
        })
      });

      this.loader.hide();
    })
  }

  applyReduction(reduction) {
    return this.price = this.price - (this.price * reduction / 100)


  }

}
