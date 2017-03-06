import {Component, Input, ViewChildren, ViewChild, OnInit, QueryList} from '@angular/core';
import {VScrollComponent} from './component';

@Component({
	template: `
		<v-scroll [items]="items" 
			(bufferChange)="buffer = $event" 
			(vScroll)="onScroll($event)" 
			(fetch)="fetch($event)">
			<div class="item" #item *ngFor="let i of buffer">{{i}}</div>
		</v-scroll>
	`,
	styles: [`
		.item {
			height: 50px;
		}
		v-scroll {
			display: block;
			height: 100px;
		}
	`]
})
export class VScrollDummyComponent implements OnInit {
	@Input() items = [];
	@ViewChildren('item') els:QueryList<any>;
	@ViewChild(VScrollComponent) vscroll:VScrollComponent<any>;

	buffer = [];

	ngOnInit() {
		this.fetch();
	}

	fetch() {
		let items = [];
		for(let i = 0; i<10; i++)
			items.push(i);
		this.items = items;
	}

	onScroll(event) {}
}
