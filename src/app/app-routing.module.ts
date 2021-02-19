import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarteComponent} from './cvlm-home/carte/carte.component';
import { DescriptionComponent } from './cvlm-home/description/description.component';
import { FiltreComponent } from './cvlm-home/filtre/filtre.component';

const routes: Routes =[
	{
		path: '',
		component : FiltreComponent,
		children :[{
			path : '',
			component : CarteComponent,
			children : [{
				path : '',
				component : DescriptionComponent
				}]
			}
			]
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
