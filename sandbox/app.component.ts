import {Component, OnInit} from '@angular/core';
import {FetchEvent} from '../src/interfaces/fetchEvent';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	public items:number[] = [];
	public buffer:number[] = [];

	public ngOnInit() {
		let items = [];
		for(let i = 0; i<50; i++) items.push(i);
		this.items = items;
	}

	public fetch(event:FetchEvent) {
		console.log(event);
	}

}
