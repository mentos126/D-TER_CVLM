import { Component, OnInit } from '@angular/core';
import { DescriptionServiceService } from '../description-service.service';
import { IDepeche } from '../depeche';
import * as moment from 'moment';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  constructor(private descriptionService: DescriptionServiceService) {}

  depeche: IDepeche;
  date: String;

  getColor() : string {
    return "background-color:"+this.depeche.couleur + ";";
  }
  getStyle() : string {
    return this.getColor();
  }
  ngOnInit() {
    this.descriptionService
    	.currentDepeche
    	.subscribe(res => {this.depeche = res; this.date = moment(res.published, "YYYY-MM-DD").format("DD-MM-YYYY").toString()});
  }

}
