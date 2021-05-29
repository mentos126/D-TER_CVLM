import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IDepeche } from './depeche';

@Injectable()
export class CarteServiceService {

	depechesFiltrees = new BehaviorSubject<IDepeche[]>(null);
	// currentDepechesFiltres = this.depechesFiltrees.asObservable();

	private carteCoord = new BehaviorSubject<any>(null);
	currentCarteCoord = this.carteCoord.asObservable();

	changeDepecheFiltrees(deps: IDepeche[]){
		this.depechesFiltrees.next(deps);
	}

	changeSizeCarte(obj: any){
		this.carteCoord.next(obj);
	}
}
