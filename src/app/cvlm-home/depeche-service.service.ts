import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDepeche } from './depeche';

@Injectable()
export class DepecheServiceService {


	// private getAllDepeche: string = "/assets/data/marqueursServeur.json";
	private API : string = "http://127.0.0.1/"
	private getAllDepeche : string = this.API + "getall"; 	// GET
	private postDepeche : string = this.API + "add/depeche";	// POST
	private postAll : string = this.API + "add/all";	// POST

	//private url: string = "/assets/data/getAll.json";

	// private url: string = "/assets/data/getAll.json";
	// private url: string = "http://127.0.0.1:1337/getall";
	// private url: string = "http://localhost/~henrique/marqueursServeur.json";

	constructor(private http: HttpClient) { }

	getMarqueurs() : Observable<any>{
		return this.http.get<any>(this.getAllDepeche);
	}
	modifierDepeche(depeche : IDepeche) : Observable<any>{
		return this.http.post<any>(this.postDepeche, depeche);
	}
	modifierTout(depeche : IDepeche) : Observable<any>{
		return this.http.post<any>(this.postAll, depeche);
	}
}
