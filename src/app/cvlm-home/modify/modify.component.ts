import { Component, ChangeDetectorRef, TemplateRef, OnInit } from '@angular/core';
import { DescriptionServiceService } from '../description-service.service';
import { NgStyle } from '@angular/common';
import { IDepeche } from '../depeche';

import { Subscription, Observable, combineLatest } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DepecheServiceService } from '../depeche-service.service'
// import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit {

  constructor(
    private modalService : BsModalService,
    private descriptionService: DescriptionServiceService,
    private changeDetection: ChangeDetectorRef,
    private service: DepecheServiceService
  ) {}

  depeche: IDepeche;
  copieDep: IDepeche;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
  /* TEST */


  showModal(template : TemplateRef<any>): void {
    const _combine = combineLatest(this.modalService.onHide).subscribe(
      () => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        console.log('onHide event');
        // this.test();
      })
    );
    this.subscriptions.push(_combine);
    this.modalRef = this.modalService.show(template);
  }
  test() : void {
    this.depeche = this.copieDep;
    console.log(this.depeche)
  }

  changeWordPolarity(index, value){
    console.log(index + ' ' + value);
    console.log(this.copieDep.polarite.detail[index].note);
    console.log(value + ' ' + typeof value);


    this.copieDep.polarite.detail[index].note = (typeof value == 'number' ? value : parseInt(value));
    this.reEval();
  }

  reEval(){
			// SCORE à trois indiquateurs, negatif, positif et neutre
      this.copieDep.polarite.complet.neg = 0;
      this.copieDep.polarite.complet.pos = 0;
      this.copieDep.polarite.complet.neut = 0;
      console.log("[REEVAL]");

			for(let p of this.copieDep.polarite.detail){
        console.log({mot: p.mot, note: p.note})
				if(typeof p.note === "number"){
					/* POSITIF */
					if(p.note  > 0){
						if(this.copieDep.polarite.complet.pos != 0)
							this.copieDep.polarite.complet.pos = (this.copieDep.polarite.complet.pos + p.note) / 2;
						else
							this.copieDep.polarite.complet.pos = p.note;
					/* NEGATIF */
					}else if(p.note < 0){
						if(this.copieDep.polarite.complet.neg != 0)
							this.copieDep.polarite.complet.neg = (this.copieDep.polarite.complet.neg + p.note) / 2;
						else
							this.copieDep.polarite.complet.neg = p.note;
					/* NEUTRE */
					}else if(p.note == 0){
							this.copieDep.polarite.complet.neut++;
					}
				}else{
					this.copieDep.polarite.complet.neut++;
        }
        console.log({mot: p.mot, note: p.note})
        console.log('------------------------')
			}
			// SCORE général simplifié
			if(this.copieDep.polarite.complet.pos > (this.copieDep.polarite.complet.neg * (-1)))
				this.copieDep.polarite.simple = this.copieDep.polarite.complet.pos
			else if(this.copieDep.polarite.complet.pos < (this.copieDep.polarite.complet.neg * (-1)))
				this.copieDep.polarite.simple = this.copieDep.polarite.complet.neg
			else
        this.copieDep.polarite.simple = 0;

        this.copieDep.couleur = this.evalColor(this.copieDep.polarite.simple);
  }

  evalColor(value){
    if(this.copieDep.polarite.simple >= 2.5 ){
      return "#8ee000";
    }else if(this.copieDep.polarite.simple > 0){
      return "#00e079";
    }else if(this.copieDep.polarite.simple == 0){
      return "#00b7ff";
    }else if(this.copieDep.polarite.simple > -1){
      return "#ff8700";
    }else{
      return "#ff0000";
    }
  }

  saveChanges(all : boolean) : void{
    //this.depeche = this.copieDep;

    this.depeche.polarite.complet.pos = this.copieDep.polarite.complet.pos;
    this.depeche.polarite.complet.neg = this.copieDep.polarite.complet.neg;
    this.depeche.polarite.complet.neut = this.copieDep.polarite.complet.neut;
    this.depeche.polarite.simple = this.copieDep.polarite.simple;

    for(let i =0; i < this.depeche.polarite.detail.length ; i++){
      this.depeche.polarite.detail[i].note = this.copieDep.polarite.detail[i].note;
    }
    this.depeche.couleur = this.copieDep.couleur;

    if(all)
      this.service
        .modifierTout(this.depeche)
        .subscribe(res => console.log('Recorded with succes'))
    else
      this.service
        .modifierDepeche(this.depeche)
        .subscribe(res => console.log('Recorded with success'))
  }
  ngOnInit() {
    this.descriptionService
    	.currentDepeche
      .subscribe(res => {
        this.depeche = res;
        this.copieDep = JSON.parse(JSON.stringify(res));
      });
  }

}
