import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {AppComponent} from './app.component';
import {VirtualScrollModule} from '../src';

@NgModule({
	imports: [VirtualScrollModule, BrowserModule],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
}
