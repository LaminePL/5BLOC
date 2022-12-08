import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA}  from '@angular/material/dialog';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-send-card-modal',
  templateUrl: './send-card-modal.component.html',
  styleUrls: ['./send-card-modal.component.scss']
})
export class SendCardModalComponent implements OnInit {

  form:FormGroup;

  constructor(public dialogRef: MatDialogRef<SendCardModalComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      address: new FormControl(""),
      price: new FormControl("0",),
    })
  }

  validate(e){
    if(this.form.valid){
      this.dialogRef.close({
        to:this.form.controls["address"].value,
        price:this.form.controls["price"].value
      })
    }
  }

}
