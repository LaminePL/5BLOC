import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {UiModule} from "./ui/ui.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PinataHttpInterceptor } from './utils/pinata-http-interceptor';
import { AppMaterialModule } from './app-material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    UiModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PinataHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
