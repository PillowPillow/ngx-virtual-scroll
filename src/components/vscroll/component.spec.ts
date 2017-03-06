import {ComponentFixture, TestBed, tick, fakeAsync, async, inject} from '@angular/core/testing';
import {DebugElement, Type} from '@angular/core';
import {VScrollComponent} from './component';
import {Configuration, ConfigurationFactory} from '../../config';
import {VScrollDummyComponent} from './component.spec.fixture';
import {FetchEvent} from '../../interfaces/fetchEvent';
import {ScrollEvent} from '../../interfaces/scrollEvent';
import {ScrollDirection} from '../../enums/scrollDirection';

const itemStyleHeight = 50;
const viewStyleHeight = 100;

describe('VScrollComponent', () => {

	describe('integration', () => {
		let comp:VScrollDummyComponent;
		let debugEl:DebugElement;
		let el:DebugElement;
		let fixture:ComponentFixture<VScrollDummyComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [VScrollComponent, VScrollDummyComponent],
				providers: [
					{
						provide: Configuration,
						useFactory: ConfigurationFactory,
						deps: []
					}
				]
			});

			window.requestAnimationFrame = ((cb) => cb()) as any;

			fixture = TestBed.createComponent(VScrollDummyComponent as Type<VScrollDummyComponent>);
			fixture.detectChanges();
			comp = fixture.componentInstance;
			debugEl = fixture.debugElement;
			el = debugEl.nativeElement;
		});

		it('should scroll to the 3nd item', async(inject([], () => {
			let item = comp.items[2];
			comp.vscroll.scrollInto(item);
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer).toContain(item);
			});
		})));

		it('shouldn\'t scroll to the given item', async(inject([], () => {
			let item = 'undefined item';
			let result = comp.vscroll.scrollInto(item);
			expect(result).toBeFalsy();
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer).not.toContain(item);
			});
		})));

		it('shouldn\'t scroll with an undefined index', async(inject([], () => {
			let result = comp.vscroll.scrollTo(comp.vscroll.items.length+1);
			expect(result).toBeFalsy();
		})));

		it('should scroll to the 5th item', async(inject([], () => {
			comp.vscroll.scrollTo(5);
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer[0]).toBe(5);
			});
		})));

		it('should emit a bufferChange event', async(inject([], () => {
			let listener = comp.vscroll.bufferChange.subscribe((items:any[]) => {
				expect(items.length).toBe(3);
				listener.unsubscribe();
			});
			comp.vscroll.scrollTo(5);
			fixture.detectChanges();
		})));

		it('should emit a fetch event', async(inject([], () => {

			let listener = comp.vscroll.fetch.subscribe((event:FetchEvent) => {
				expect(event).toBeDefined();
				expect(event.start).toBe(5);
				expect(event.end).toBe(8);
				listener.unsubscribe();
			});
			comp.vscroll.scrollTo(5);
			fixture.detectChanges();

		})));

		it('should fill the viewport', async(inject([], () => {
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer.length).toBe(3);
				expect(comp.els.length).toBe(3);
			});
		})));

	});
});
