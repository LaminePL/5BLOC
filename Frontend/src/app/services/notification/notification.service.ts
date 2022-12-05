import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor( public SnackBar : MatSnackBar, private dialog:MatDialog) { }

  config:MatSnackBarConfig={
    duration: 5000,
    horizontalPosition:'right',
    verticalPosition: 'bottom'
  }

  success(msg: string){
    this.config['panelClass'] = ['notification-success'];
    this.SnackBar.open(msg,'',this.config);
  }

  error(msg:string) {
    this.config['panelClass'] = ['notification-error'];
    this.SnackBar.open(msg, '', this.config);
  }




}
