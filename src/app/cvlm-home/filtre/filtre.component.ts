import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DepecheServiceService } from '../depeche-service.service'
import { CarteServiceService } from '../carte-service.service'
import { IDepeche, IData } from '../depeche';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import {CalendarModule} from 'primeng/calendar';

@Component({
	selector: 'app-filtre',
	templateUrl: './filtre.component.html',
	styleUrls: ['./filtre.component.css']
})
export class FiltreComponent implements  OnInit {

	constructor(
		private depecheService: DepecheServiceService,
		private carteService: CarteServiceService
		) {

    }

  selectIsOpen = false
	lesMarqueurs = [];
	lesFiltres = ["aucun","zone","date","afficher seulement"]
	filterSelected: string = "aucun";
	unqiueSelected: string = "positif";
	isSelectedStats: Boolean;
	lesMarqueursFiltrees = [];
	carteNorthEastLat: number;
	carteNorthEastLng: number;
	carteSouthWestLat: number;
	carteSouthWestLng: number;
	nbData: number;

	date: Date;
	fr: any;
	minDate: Date;
	maxDate: Date;

	data: any = [];
	dataChart: Array<IData> = [];
	colors: Array<string>  = ['negatif', 'neutre', 'positif'];
	colorsBackGround: Array<string>  = ["#ff0000", "#00b7ff", "#8ee000"];
	canvas: any;
	ctx: any;
	PieChart: any;

	loadPieChart(){
		this.canvas = document.getElementById('pieChart');
		if (this.canvas != null){
			this.ctx = this.canvas.getContext('2d');

			let dataTest =  {
				datasets: [{
					data: this.data,
					backgroundColor	: this.colorsBackGround,
					borderColor: this.colorsBackGround,
	                borderWidth: [0,0,0]
				}],
				labels: this.colors
			};

			this.PieChart = new Chart(this.ctx,{
				type: 'pie',
				data : dataTest,
				options: {
					responsive: false,
					segmentShowStroke: false,
					display: true
				}
			});
		}else{

		}
	}

	onSelect(s : string){
    console.log(s)
		this.filterSelected = s;
		switch (s) {
			case "aucun":
			this.lesMarqueursFiltrees = this.lesMarqueurs;
			this.carteService.changeDepecheFiltrees(this.lesMarqueurs);
			break;

			/*************************************************/
			case "zone":
			this.lesMarqueursFiltrees = [];
			for (let x of this.lesMarqueurs){
				if(x.geo.lat < this.carteNorthEastLat){
					if(x.geo.lat > this.carteSouthWestLat){
						if(x.geo.lng < this.carteNorthEastLng){
							if(x.geo.lng > this.carteSouthWestLng){
								this.lesMarqueursFiltrees.push(x);
							}
						}
					}
				}
			}
			this.carteService.changeDepecheFiltrees(this.lesMarqueursFiltrees);
			break;

			/*************************************************/
			case "date":
			this.lesMarqueursFiltrees = this.lesMarqueurs;
			if(this.date != undefined){
				this.lesMarqueursFiltrees =[];
				for (let x of this.lesMarqueurs){
					console.log("==========");
					console.log(this.date);
					console.log(moment(x.published, "YYYY-MM-DD"));
					if(moment(this.date, "DD-MM-YYYY") <= moment(x.published, "YYYY-MM-DD")){
						this.lesMarqueursFiltrees.push(x);
					}
				}

			}
			this.carteService.changeDepecheFiltrees(this.lesMarqueursFiltrees);
			break;

			/*************************************************/
			case "afficher seulement":
			this.onRadio(null,this.unqiueSelected);
			break;

			/*************************************************/
			default:
			console.error("PROBLEME DE SELECTION");;
			break;
		}
		this.formateData();
	}

	formateData(){
		let colorRed: IData = {label: 'red', value : 0};
		let colorOrange: IData = {label: 'orange', value : 0};
		let colorGreen: IData = {label: 'green', value : 0};
		this.nbData = 0;
		for (let x of this.lesMarqueursFiltrees){
			this.nbData += 1;
			switch (x.couleur) {
				case "#ff0000":
				colorRed.value = colorRed.value + 1;
				break;
				case "#ff8700":
				colorRed.value = colorRed.value + 1;
				break;
				case "#00b7ff":
				colorOrange.value = colorOrange.value + 1
				break;
				case "#00e079":
				colorGreen.value = colorGreen.value + 1
				break;
				case "#8ee000":
				colorGreen.value = colorGreen.value + 1
				break;
				default:
				break;
			}
		}

		if(this.nbData ==0){
			this.nbData += 1;
		}
		this.dataChart = [colorRed, colorOrange, colorGreen];
		this.data = [colorRed.value, colorOrange.value, colorGreen.value];
		this.loadPieChart();
	}

	onRadio(event, radio){
		this.unqiueSelected = radio;
		this.lesMarqueursFiltrees = [];
		for (let x of this.lesMarqueurs){
			if (radio == x.polariteValue){
				this.lesMarqueursFiltrees.push(x);
			}
		}
		this.carteService.changeDepecheFiltrees(this.lesMarqueursFiltrees);
		this.formateData();
	}

	onOpenStats(event){
		this.isSelectedStats = true;
		this.onSelect(this.filterSelected);
	}

	onCloseStats(event){
		this.isSelectedStats = false;
	}

	onSelectDate(event){
		console.log(event);
		this.date =  moment(event, "DD-MM-YYYY").toDate();
		this.onSelect("date");
	}

	ngOnInit() {
		this.depecheService
		.getMarqueurs()
		.subscribe(res => {
			this.lesMarqueurs = res;
			this.lesMarqueurs.map(obj => {
				let rObj: any = {};
				rObj = obj;
				if(obj.polarite.simple >= 2 ){
					rObj.polariteValue = "positif";
					rObj.couleur = "#8ee000";
				}else if(obj.polarite.simple >= 1){
					rObj.polariteValue = "positif";
					rObj.couleur = "#00e079";
				}else if(obj.polarite.simple == 0){
					rObj.polariteValue = "neutre";
					rObj.couleur = "#00b7ff";
				}else if(obj.polarite.simple > -1){
					rObj.polariteValue = "negatif";
					rObj.couleur = "#ff8700";
				}else{
					rObj.polariteValue = "negatif";
					rObj.couleur = "#ff0000";
				}

				let duo = this.lesMarqueurs.find( element => {
					return element.geo.formatedAdress == obj.geo.formatedAdress && element.title != obj.title;
				});

        if(duo){
					let marge_lat = (Math.random() * (0.000022222 - 0.000011111) + 0.000011111).toFixed(10);
					let marge_lng = (Math.random() * (0.000022222 - 0.000011111) + 0.000011111).toFixed(10);
					obj.geo.lat = parseFloat(obj.geo.lat) + (Math.random() );
					obj.geo.lng = parseFloat(obj.geo.lng) + (Math.random() );
				}


				return rObj;
			});


		});

		this.carteService
		.currentDepechesFiltres
		.subscribe(res => this.data = res);

		this.carteService
		.currentCarteCoord
		.subscribe(res => {
			if (res != null){
				this.carteSouthWestLat = res.carteSouthWestLat;
				this.carteSouthWestLng = res.carteSouthWestLng;
				this.carteNorthEastLat = res.carteNorthEastLat;
				this.carteNorthEastLng = res.carteNorthEastLng;
				if(this.filterSelected == "zone"){
					this.onSelect(this.filterSelected);
				}
			}
		});

		this.isSelectedStats = false;

		this.fr = {
			firstDayOfWeek: 0,
			dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
			dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
			dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
			monthNames: [ "Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre" ],
			monthNamesShort: [ "Jan", "Fév", "Mar", "Avr", "Mai", "Jun","Jul", "Aout", "Sep", "Oct", "Nov", "Dec" ],
			today: "Aujourd'hui",
			clear: 'éffacer'
		};

		this.date = undefined;

		let today = new Date();
		let month = today.getMonth();
		let year = today.getFullYear();
		let prevMonth = (month === 0) ? 11 : month -1;
		let prevYear = (prevMonth === 11) ? year - 1 : year;
		let nextMonth = (month === 11) ? 0 : month + 1;
		let nextYear = (nextMonth === 0) ? year + 1 : year;
		/*this.maxDate = new Date();
		this.maxDate.setMonth(nextMonth);
		this.maxDate.setFullYear(nextYear);
		this.minDate = new Date();
		this.minDate.setMonth(prevMonth);
		this.minDate.setFullYear(prevYear);
*/
	}

}

