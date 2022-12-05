import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'AngularDapp';
  loading :boolean;
  constructor(public loader: LoaderService,private cdRef:ChangeDetectorRef){

  }

  ngOnInit(): void {
      this.loader.loading$.subscribe(value =>{
        this.loading = value;
      })
  }
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }
}
