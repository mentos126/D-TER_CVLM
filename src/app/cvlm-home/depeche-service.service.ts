import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDepeche } from './depeche';

@Injectable()
export class DepecheServiceService {

	private API : string = "https://peaceful-lowlands-37724.herokuapp.com/"
	private getAllDepeche : string = this.API + "getall"; 	// GET
	private postDepeche : string = this.API + "add/depeche";	// POST
	private postAll : string = this.API + "add/all";	// POST

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
