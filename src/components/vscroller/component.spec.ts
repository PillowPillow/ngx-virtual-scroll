import {ComponentFixture, TestBed, tick, fakeAsync, async, inject} from '@angular/core/testing';
import {DebugElement, Type} from '@angular/core';
import {VScrollerComponent} from './component';
import {Configuration, ConfigurationFactory} from '../../config';
import {VScrollerDummyComponent} from './component.spec.fixture';
import {FetchEvent} from '../../interfaces/fetchEvent';
import {ScrollEvent} from '../../interfaces/scrollEvent';
import {ScrollDirection} from '../../enums/scrollDirection';

const itemStyleHeight = 50;
const viewStyleHeight = 100;

describe('VScrollerComponent', () => {

	describe('integration', () => {
		let comp:VScrollerDummyComponent;
		let debugEl:DebugElement;
		let el:DebugElement;
		let fixture:ComponentFixture<VScrollerDummyComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [VScrollerComponent, VScrollerDummyComponent],
				providers: [
					{
						provide: Configuration,
						useFactory: ConfigurationFactory,
						deps: []
					}
				]
			});

			window.requestAnimationFrame = ((cb) => cb()) as any;

			fixture = TestBed.createComponent(VScrollerDummyComponent as Type<VScrollerDummyComponent>);
			fixture.detectChanges();
			comp = fixture.componentInstance;
			debugEl = fixture.debugElement;
			el = debugEl.nativeElement;
		});

		it('should scroll to the 3nd item', async(inject([], () => {
			let item = comp.items[2];
			comp.vscroller.scrollInto(item);
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer).toContain(item);
			});
		})));

		it('shouldn\'t scroll to the given item', async(inject([], () => {
			let item = 'undefined item';
			let result = comp.vscroller.scrollInto(item);
			expect(result).toBeFalsy();
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer).not.toContain(item);
			});
		})));

		it('shouldn\'t scroll with an undefined index', async(inject([], () => {
			let result = comp.vscroller.scrollTo(comp.vscroller.items.length+1);
			expect(result).toBeFalsy();
		})));

		it('should scroll to the 5th item', async(inject([], () => {
			comp.vscroller.scrollTo(5);
			fixture.detectChanges();
			fixture.whenStable().then(() => {
				expect(comp.buffer[0]).toBe(5);
			});
		})));

		it('should emit a bufferChange event', async(inject([], () => {
			let listener = comp.vscroller.bufferChange.subscribe((items:any[]) => {
				expect(items.length).toBe(3);
				listener.unsubscribe();
			});
			comp.vscroller.scrollTo(5);
			fixture.detectChanges();
		})));

		it('should emit a fetch event', async(inject([], () => {

			let listener = comp.vscroller.fetch.subscribe((event:FetchEvent) => {
				expect(event).toBeDefined();
				expect(event.start).toBe(5);
				expect(event.end).toBe(8);
				listener.unsubscribe();
			});
			comp.vscroller.scrollTo(5);
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
