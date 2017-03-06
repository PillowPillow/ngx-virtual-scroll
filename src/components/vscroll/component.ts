import {
	Component, Input, Output, EventEmitter, Inject, ElementRef, Renderer, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewChild, ContentChild,
	HostListener
} from '@angular/core';
import {CONFIG_TOKEN, Configuration} from '../../config';
import {FetchEvent} from '../../interfaces/fetchEvent';
import {ScrollEvent} from '../../interfaces/scrollEvent';
import {Viewport} from '../../interfaces/viewport';
import {ScrollDirection} from '../../enums/scrollDirection';

@Component({
	selector: 'v-scroll, [v-scroll]',
	templateUrl: './template.html',
	styleUrls: ['./style.scss'],
})
export class VScrollComponent<T> implements OnInit, OnChanges, OnDestroy {

	@Input() public items:T[] = [];
	@Input() public itemHeight:number;
	@Input() public retryOnInvalidViewport:boolean = false;
	@Input() public nbRetry:number = 1;

	@Output() public bufferChange:EventEmitter<T[]> = new EventEmitter();
	@Output() public fetch:EventEmitter<FetchEvent> = new EventEmitter();
	@Output() public vScroll:EventEmitter<ScrollEvent> = new EventEmitter();
	@Output() public loop:EventEmitter<any> = new EventEmitter();

	public topPadding:number;
	public scrollHeight:number;

	@ViewChild('container', {read: ElementRef}) protected containerElRef:ElementRef;

	private lastStart:number;
	private lastEnd:number;
	private lastHScroll:number = 0;
	private lastVScroll:number = 0;

	private scrollListener:Function;

	get el():HTMLElement { return this.hostElRef.nativeElement; }

	get containerEl():HTMLElement { return this.containerElRef.nativeElement; }

	constructor(config:Configuration, private hostElRef:ElementRef, private renderer:Renderer) {
		this.itemHeight = this.itemHeight || config.itemHeight;
	}

	public scrollInto(item:T) {
		let index:number = this.items.indexOf(item);
		if(!~index) return false;

		let viewport = this.calculateViewport();
		this.el.scrollTop = ~~(index / viewport.nbDisplayedItems) * viewport.itemHeight;
		this.renderLoop();
	}

	public scrollTo(index:number) {
		if(index >= this.items.length) return false;
		let viewport = this.calculateViewport();
		this.el.scrollTop = index * viewport.itemHeight;
		this.renderLoop();
	}

	/** Lifecycle **/

	ngOnInit() {
		this.scrollListener = this.renderer.listen(this.el, 'scroll', () => this.onScroll());
	}

	ngOnChanges(changes:SimpleChanges) {
		this.lastStart = undefined;
		this.lastEnd = undefined;
		this.renderLoop();
	}

	ngOnDestroy() {this.scrollListener();}

	private onScroll() {
		// horizontal scrolling
		//if(this.lastHScroll !== this.el.scrollLeft) {
		//	let direction:ScrollDirection = this.lastHScroll < this.el.scrollLeft ? ScrollDirection.Right : ScrollDirection.Left;
		//	this.lastHScroll = this.el.scrollLeft;
		//	this.vScroll.emit({value: this.lastHScroll, direction});
		//}

		if(this.lastVScroll !== this.el.scrollTop) {
			let direction:ScrollDirection = this.lastVScroll < this.el.scrollTop ? ScrollDirection.Down : ScrollDirection.Up;
			this.lastVScroll = this.el.scrollTop;
			this.vScroll.emit({value: this.lastVScroll, direction});
		}

		this.lastVScroll = this.el.scrollTop;

		this.renderLoop();
	}

	private renderLoop(nbRetry = 0) {
		if(nbRetry > this.nbRetry) return false;

		requestAnimationFrame(() => {
			this.calculateItems(nbRetry);
			this.loop.emit();
		});
	}

	private calculateViewport():Viewport {
		let el = this.el;
		let content = this.containerEl;

		let items = this.items || [];
		let nbItems = items.length;
		let viewHeight = el.clientHeight;

		let contentDimensions;
		if(this.itemHeight === undefined)
			contentDimensions = content.children[0] ? content.children[0].getBoundingClientRect() : {height: 1};

		let itemHeight = this.itemHeight || contentDimensions.height;
		let nbDisplayedItems = Math.max(1, Math.ceil(viewHeight / itemHeight)) + 1;

		return {
			nbItems: nbItems,
			viewHeight: viewHeight,
			itemHeight: itemHeight,
			nbDisplayedItems: nbDisplayedItems,
		};
	}

	private calculateItems(nbRetry = 0) {
		let el = this.el;
		let viewport = this.calculateViewport();

		if(!viewport.viewHeight) {
			if(this.retryOnInvalidViewport)
				this.renderLoop(++nbRetry);
		}

		let items = this.items || [];
		this.scrollHeight = viewport.itemHeight * viewport.nbItems;

		if(this.el.scrollTop > this.scrollHeight) this.el.scrollTop = this.scrollHeight;
		let start = ~~(el.scrollTop / this.scrollHeight * viewport.nbItems);

		let end = Math.min(viewport.nbItems, start + viewport.nbDisplayedItems);
		if(start < 0) return false;
		if(end === viewport.nbItems) {
			start = end - viewport.nbDisplayedItems;
			start = start < 0 ? 0 : start;
		}

		this.topPadding = viewport.itemHeight * start;
		if(start !== this.lastStart || end !== this.lastEnd) {
			this.bufferChange.emit(items.slice(start, end));
			this.lastStart = start;
			this.lastEnd = end;
			this.fetch.emit({start, end});
		}
	}
}
