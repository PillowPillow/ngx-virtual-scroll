import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Configuration, CONFIG_TOKEN, ConfigurationFactory} from './config';
import {COMPONENTS, COMPONENTS_TO_EXPORT} from './components/index';

@NgModule({
	declarations: [...COMPONENTS],
	imports: [CommonModule],
	providers: [
		{
			provide: Configuration,
			useFactory: ConfigurationFactory,
			deps: [CONFIG_TOKEN]
		},
		{provide: CONFIG_TOKEN, useValue: null}
	],
	exports: [...COMPONENTS_TO_EXPORT]
})
export class VirtualScrollModule {

	static forRoot(configuration?:Configuration):ModuleWithProviders {
		return {
			ngModule: VirtualScrollModule,
			providers: [{provide: CONFIG_TOKEN, useValue: configuration}]
		};
	}

}
