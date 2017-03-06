import {OpaqueToken} from '@angular/core';

export const CONFIG_TOKEN = new OpaqueToken('VScrollConfigurationToken');

export class Configuration {
	itemHeight?:number;
}

export function ConfigurationFactory(config?:any) {
	return Object.assign(new Configuration(), config);
}
