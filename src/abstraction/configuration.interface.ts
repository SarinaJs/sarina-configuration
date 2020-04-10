import { ConfigurationElement } from './configuration-element';

export interface IConfiguration {
	has(path: string): boolean;
	get(path: string): ConfigurationElement;
	getScoped(scope: string): IConfiguration;

	getAs<T>(path: string, convertor: (value: string) => T, defaultValue?: T): T;
	getAsString(path: string, defaultValue?: string): string;
}
