import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DescriptionServiceService } from '../description-service.service';
import { DepecheServiceService } from '../depeche-service.service'
import { CarteServiceService } from '../carte-service.service';
import { IDepeche } from '../depeche';

@Component({
	selector: 'app-carte2',
	templateUrl: './carte.component.html',
	styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit, AfterViewInit {

	constructor(
    private depecheService: DepecheServiceService,
		private descriptionService: DescriptionServiceService,
		private carteSrevice: CarteServiceService
    ) {
  }

  map: any;
  L: any;

	lesMarqueurs: any = [];
	lat: Number = 43;
	lng: Number = 3;
	zoom: Number = 5;
	isPlayed : Boolean = false;
	playPosition : number = 0;
	playedColor : String;
	intervalID : any;
	isSelectedMarker : Boolean = false;
	selectedMarker : IDepeche;
	obj : any;
	radius : Number;

  private initMap(): void {
    this.L = window['L'];
    this.map = this.L.map('map').setView([ Number(this.lat), Number(this.lng) ], Number(this.zoom));

    var gl = this.L.mapboxGL({
      style: 'https://api.maptiler.com/maps/a5cdc8fc-e41d-4708-84ee-4ecebf3d6f4f/style.json?key=QOoIcT5IkHrO1kMC4yh9'
    }).addTo(this.map);

    this.map.on('zoomend', () => {
      this.zoom = this.map.getZoom()
      this.zoomChange(this.zoom)

    })

    this.map.on('moveend', (e) => {
      this.onChangeCenterMap(this.map.getBounds())
    })
  }

  ngAfterViewInit() {
    this.initMap()
  }

	onChoseLocation(event,id){
		for (let i = 0; i < this.lesMarqueurs.length; ++i) {
			if (Object.values(this.lesMarqueurs[i])[0] == id){
				this.lat = this.lesMarqueurs[i].geo.lat;
				this.lng = this.lesMarqueurs[i].geo.lng  ;
        this.map.setView([ Number(this.lat), Number(this.lng) ])
				this.selectedMarker = this.lesMarqueurs[i];
				this.isSelectedMarker = true;
				this.descriptionService.changeDepeche(this.selectedMarker);
				break;
			}
		}
	}

	play(){
		if(this.isPlayed){
			this.isPlayed = false;
			window.clearInterval(this.intervalID);
			this.lesMarqueurs[this.playPosition].couleur = this.playedColor;
			if(this.playPosition > 0){
				this.lesMarqueurs[this.playPosition-1].stroke = 0;
				this.lesMarqueurs[this.playPosition-1].zIndex = 0;
			}
		}else{
			this.isPlayed = true;
			this.intervalID = window.setInterval(()=>{
				console.log(this.lesMarqueurs[this.playPosition]);
				if(this.playPosition < this.lesMarqueurs.length){

					if(this.playPosition > 0){
						this.lesMarqueurs[this.playPosition-1].stroke = 0;
						this.lesMarqueurs[this.playPosition-1].zIndex = 0;
					}
					// Change l'index, met en avant et change la couleur
					this.lesMarqueurs[this.playPosition].zIndex = 100;
					this.lesMarqueurs[this.playPosition].stroke = 5;
					//
					this.lat = this.lesMarqueurs[this.playPosition].geo.lat;
					this.lng = this.lesMarqueurs[this.playPosition].geo.lng;
          this.map.setView([ Number(this.lat), Number(this.lng) ])

					this.selectedMarker = this.lesMarqueurs[this.playPosition];
					this.isSelectedMarker = true;
					this.descriptionService.changeDepeche(this.selectedMarker);
					this.playPosition++;

				}else{
					this.playPosition = 0;
				}
			},7000);
		}
	}

	onCloseLocation(event){
		this.isSelectedMarker = false;
	}

	zoomChange(z){
		if(z == 4)
			this.radius = 100000;
		if(z == 4)
			this.radius = 75000;
		if(z == 5)
			this.radius = 50000;
		if(z == 6)
			this.radius = 25000;
		else if(z == 7)
			this.radius = 15000;
		else if(z == 8)
			this.radius = 10000;
		else if(z == 9)
			this.radius = 8000;
		else if(z == 10)
			this.radius = 7500;
		else if(z == 11)
			this.radius = 6000;
		else if(z == 12)
			this.radius = 5500;
		else if(z == 13)
			this.radius = 3000;
		else if(z == 14)
			this.radius = 2500;
		else if(z == 15)
			this.radius = 2000;
		else if(z == 16)
			this.radius = 1500;
		else if(z == 17)
			this.radius = 1000;
		else if(z == 18)
			this.radius = 500;

		console.log(this.zoom);
	}

	onChangeCenterMap(bounds){
		this.obj = {
			carteNorthEastLat : bounds._northEast.lat,
			carteNorthEastLng : bounds._northEast.lng,
			carteSouthWestLat : bounds._southWest.lat,
			carteSouthWestLng : bounds._southWest.lng
		}
		this.carteSrevice.changeSizeCarte(this.obj);
	}

	private getUserLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(position => {
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;
        this.map.setView([ Number(this.lat), Number(this.lng) ])
			});
		}
	}

	ngOnInit() {
    this.radius = 50000;
		this.getUserLocation();

		this.depecheService
		.getMarqueurs()
		.subscribe(res => {
			this.lesMarqueurs = res;
			this.lesMarqueurs.map(obj => {
				let rObj: any = {};
				rObj = obj;
				if(obj.polarite.simple >= 2.5 ){
					rObj.couleur = "#8ee000";
				}else if(obj.polarite.simple > 0){
					rObj.couleur = "#00e079";
				}else if(obj.polarite.simple == 0){
					rObj.couleur = "#00b7ff";
				}else if(obj.polarite.simple > -1){
					rObj.couleur = "#ff8700";
				}else{
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

      for (let m of this.lesMarqueurs) {
        const circle = this.L.circleMarker(
          [Number(m.geo.lat), Number(m.geo.lng)], {
            fillOpacity: 1,
            color: m.couleur,
            fillColor: m.couleur + 'ab',
          }).addTo(this.map);

          circle.addEventListener('click', e => this.onChoseLocation(e, m.id))
      }

		});

		this.carteSrevice
		.currentDepechesFiltres
		.subscribe(res => this.lesMarqueurs = res);

		this.carteSrevice
		.currentCarteCoord
		.subscribe(res => this.obj = res);

		this.descriptionService
		.currentDepeche
		.subscribe(res => this.selectedMarker = res);
	}

}
