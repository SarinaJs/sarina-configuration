import { ConfigurationElement } from './configuration-element';

export interface IConfiguration {
	has(path: string): boolean;
	get(path: string): ConfigurationElement;
	getScoped(scope: string): IConfiguration;
}
