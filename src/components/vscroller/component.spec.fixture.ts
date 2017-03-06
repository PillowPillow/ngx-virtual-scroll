import {Component, Input, ViewChildren, ViewChild, OnInit, QueryList} from '@angular/core';
import {VScrollerComponent} from './component';

@Component({
	template: `
		<vscroller [items]="items" 
			(bufferChange)="buffer = $event" 
			(vScroll)="onScroll($event)" 
			(fetch)="fetch($event)">
			<div class="item" #item *ngFor="let i of buffer">{{i}}</div>
		</vscroller>
	`,
	styles: [`
		.item {
			height: 50px;
		}
		vscroller {
			display: block;
			height: 100px;
		}
	`]
})
export class VScrollerDummyComponent implements OnInit {
	@Input() items = [];
	@ViewChildren('item') els:QueryList<any>;
	@ViewChild(VScrollerComponent) vscroller:VScrollerComponent<any>;

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
