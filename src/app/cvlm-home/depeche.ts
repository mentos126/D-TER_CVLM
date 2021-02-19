export interface IDepeche {
		id: number,
		source: string,
		couleur: string,
    	published: Date,
    	image: string,
    	link: string,
    	title: string,
		content: string,
		polarite: {
			simple: number,
			complet: {
				pos: number,
				neg: number,
				neut: number,
			},
			detail: Array<{mot: string, note: number}>,
		}
		geo: {
			lat: number,
			lng: number,
			fomatedAdress: string
		}
}
export interface IData {
    label: string,
    value: number
}