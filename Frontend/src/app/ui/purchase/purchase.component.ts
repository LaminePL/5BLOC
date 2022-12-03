import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ContractService } from "src/app/services/contract/contract.service";
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
  transport: string;
  departure: string;
  arrival: string;



  firstFormGroup = this.fb.group({
    transport: ['', [Validators.required]]
  })


  secondFormGroup = this.fb.group({
    departure: ['Lille', [Validators.required]],
    arrival: ['Lens', [Validators.required]]

  })


  constructor(private fb: FormBuilder,private contract: ContractService ) {
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
  stations: string[] = ['Lille', 'Lens','Valencienne', 'Paris']
  transports: string[] = ['Train', 'Bus', 'Metro'];





  ngOnInit(): void {

  }
  onSubmit(){
    this.transport = this.firstFormGroup.controls['transport'].value


    this.departure = this.secondFormGroup.controls['departure'].value
    this.arrival = this.secondFormGroup.controls['arrival'].value;
    console.log(this.firstFormGroup.controls['transport'].value)

  }
  sendEth(e) {
    console.log(e);
    this.contract
      .buyTicket(this.departure, this.arrival, this.transport, PRICE )
      .then((r) => {
        console.log(r);
        this.contract.success();
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transaction failed");
      });
  }


}
