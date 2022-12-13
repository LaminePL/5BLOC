import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Card } from 'src/app/models/card.model';
import { ContractService } from 'src/app/services/contract/contract.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PinataService } from 'src/app/services/pinata/pinata.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})


export class CreateCardComponent implements OnInit {

  cardForm: FormGroup;
  file: File;
  currentAccount: any;
  gateway_url = environment.pinata_gateway_url;
  isAdmin: boolean;

  constructor(private pinataService: PinataService, private contractService: ContractService,private loader: LoaderService,private notifacationService : NotificationService) {


  }

  async ngOnInit() {
    this.isAdmin = await this.contractService.accountIsAdmin()
    this.currentAccount = environment.admin_address;
    this.cardForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      reduction: new FormControl("", [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      description: new FormControl("", [Validators.required])
    });
  }

  addCard(e) {
    if (this.cardForm.valid) {
      this.loader.show();
      this.pinataService.addFile(this.file).subscribe({
        next: (res) => {

          let card: Card = {

            name: this.cardForm.controls["name"].value,
            description: this.cardForm.controls["description"].value,
            price: this.cardForm.controls["price"].value,
            reduction: this.cardForm.controls["reduction"].value,
            image_url: `${this.gateway_url}/${res.IpfsHash}`,
          }

          this.pinataService.addJson(card).subscribe({
            next: res => {
              this.contractService.createNFTCard(this.currentAccount, res.IpfsHash)
                .then((r) => {
                  console.log(r);
                  this.loader.hide();
                  this.notifacationService.success("Card NFT created succefuly");
                })
                .catch((e) => {
                  console.log(e);
                  this.loader.hide();
                  this.notifacationService.error("Error while creating NFT card");
                });
            },
            error: err => {
              this.notifacationService.error("Error while adding card to Pinata");
              this.loader.hide();
            }
          });
        },
        error: (err) => {
          this.loader.hide();
          this.notifacationService.error("Error while adding file (image) to Pinata");
        }
      })

    }
  }

  async onFileChange(e) {
    if (!!e.target.files && e.target.files.length > 0) {
      this.file = e.target.files[0];
    } else
      this.file = null
  }

}
