import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CvlmHomeRoutingModule } from './cvlm-home-routing.module';
import { CarteComponent } from './carte/carte.component';
import { DescriptionComponent } from './description/description.component';
import { FiltreComponent } from './filtre/filtre.component';

import { DescriptionServiceService } from './description-service.service';
import { DepecheServiceService } from './depeche-service.service';
import { CarteServiceService } from './carte-service.service';


import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModifyComponent } from './modify/modify.component';

@NgModule({
	imports: [
		HttpModule,
		CalendarModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		CvlmHomeRoutingModule,
		ModalModule.forRoot(),
		BsDropdownModule.forRoot()
		],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ], // Autorise les éléments importés
	declarations: [CarteComponent, DescriptionComponent, FiltreComponent, ModifyComponent],
  	providers: [DescriptionServiceService,DepecheServiceService, CarteServiceService]
})
export class CvlmHomeModule { }
