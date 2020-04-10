import { ConfigurationElement } from './configuration-element';

export interface IConfigurationSource {
	load(): Promise<ConfigurationElement[]>;
}
