import { RootConfiguration } from './configuration';
import { IConfiguration } from '../abstraction/configuration.interface';
import { IConfigurationSource } from '../abstraction/configuration-source.interface';
import { IConfigurationBuilder } from '../abstraction/configuration-builder.interface';
import { ConfigurationElement } from '../abstraction/configuration-element';

export class ConfigurationBuilder implements IConfigurationBuilder {
	public sources: IConfigurationSource[] = [];

	public constructor() {}

	public add(source: IConfigurationSource): IConfigurationBuilder {
		this.sources.push(source);
		return this;
	}
	public async build(): Promise<IConfiguration> {
		const elements = await this.populateConfigItems();
		return new RootConfiguration(elements);
	}

	public async populateConfigItems(): Promise<ConfigurationElement[]> {
		const items: ConfigurationElement[] = [];
		const hashMap = new Map<string, ConfigurationElement>();

		// populate items,
		//		- first we put into a map
		//		- if the value already exists in the map, we should replace, latest always wins
		for (let index = 0; index < this.sources.length; index++) {
			const source = this.sources[index];
			const sourceConfigs = await source.load();
			sourceConfigs.forEach((ci) => {
				hashMap.set(ci.path, ci);
			});
		}

		// convert maps to the array
		hashMap.forEach((value) => items.push(value));

		return items;
	}
}
