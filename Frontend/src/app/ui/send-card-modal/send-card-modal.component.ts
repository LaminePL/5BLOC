import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-card-modal',
  templateUrl: './send-card-modal.component.html',
  styleUrls: ['./send-card-modal.component.scss']
})
export class SendCardModalComponent implements OnInit {

  form:FormGroup;

  constructor(public dialogRef: MatDialogRef<SendCardModalComponent>,) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      address: new FormControl("", [Validators.required])
    })
  }

  validate(e){
    if(this.form.valid){
      this.dialogRef.close({
        to:this.form.controls["address"].value
      })
    }
  }

}
