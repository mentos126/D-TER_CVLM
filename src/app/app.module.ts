import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CvlmHomeModule } from './cvlm-home/cvlm-home.module';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    AppComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  imports: [
    BrowserModule,
    CvlmHomeModule,
    CommonModule,
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  exports: [ModalModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
