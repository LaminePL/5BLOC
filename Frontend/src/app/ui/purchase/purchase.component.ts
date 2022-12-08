import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ContractService } from "src/app/services/contract/contract.service";
import Swal from "sweetalert2";
const PRICE = "2"

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  address: string;
  amount: number;
  direction: any;
  chosenTransport: string;
  departure: string;
  arrival: string;
  travelTime: string
  departureDay: string

  stations: string[] = ['Lille', 'Lens','Valencienne', 'Paris']
  transportsList: string[] = ['Train', 'Bus', 'Metro'];
  horaires: string[] = ['08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30'];
  weekDay: string[]=['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];

  constructor(private contract: ContractService ) {
    contract
    .connectAccount()
    .then((value: any) => {
      this.direction = value;
    })
    .catch((error: any) => {
      console.log(error);
      contract.failure(
        "Could't get the account data, please check if metamask is running correctly and refresh the page"
      );
    });

  }

  ngOnInit(): void {
    this.departure ='Lille'
    this.arrival ='Lens'
    this.chosenTransport = 'Bus'
    this.travelTime = '08:30'
    this.departureDay = 'Lundi'
  }


  sendEth(e) {
    console.log(e);
    let travelDayAndTime =  this.departureDay+' '+ this.travelTime;
    this.contract
      .buyTicket(this.departure, this.arrival, travelDayAndTime, this.chosenTransport, PRICE )
      .then((r) => {
        console.log(r);
        this.contract.success();
        Swal.fire(
          'Merci pour votre commande !',
          'Votre ticket est deja disponible dans votre respace transaction',
          'success'
        )
      })
      .catch((e) => {
        console.log(e);
        Swal.fire(
          'Impossible de valider votre achat!',
          e,
          'error'
        )
        this.contract.failure("Transaction failed");
      });
  }


}
