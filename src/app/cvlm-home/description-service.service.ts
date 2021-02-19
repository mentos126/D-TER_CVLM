import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IDepeche } from './depeche';

@Injectable()
export class DescriptionServiceService {

  private depeche = new BehaviorSubject<IDepeche>(null);
  currentDepeche = this.depeche.asObservable();

  constructor() { }

  changeDepeche(dep: IDepeche){
  	this.depeche.next(dep);
  }
}
