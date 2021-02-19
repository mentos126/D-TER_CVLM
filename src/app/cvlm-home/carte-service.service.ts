import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IDepeche } from './depeche';

@Injectable()
export class CarteServiceService {

	private depechesFiltrees = new BehaviorSubject<IDepeche[]>(null);
	currentDepechesFiltres = this.depechesFiltrees.asObservable();

	private carteCoord = new BehaviorSubject<any>(null);
	currentCarteCoord = this.carteCoord.asObservable();

	constructor() { }

	changeDepecheFiltrees(deps: IDepeche[]){
		this.depechesFiltrees.next(deps);
	}

	changeSizeCarte(obj: any){
		this.carteCoord.next(obj);
	}

}
