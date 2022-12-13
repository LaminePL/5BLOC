import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'AngularDapp';
  loading :boolean;
  constructor(private elementRef: ElementRef, public loader: LoaderService,private cdRef:ChangeDetectorRef){


  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = 'whitesmoke';
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
