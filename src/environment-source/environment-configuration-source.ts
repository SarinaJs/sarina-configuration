import { IConfigurationSource, ConfigurationElement } from '@sarina/configuration';

export class EnvironmentConfigurationSource implements IConfigurationSource {
	public async load(): Promise<ConfigurationElement[]> {
		// check if process.env exists
		if (process.env) {
			const items: ConfigurationElement[] = [];
			for (const key in process.env) {
				const item = process.env[key];
				items.push({
					path: key,
					value: item,
				});
			}
			return items;
		}

		return [];
	}
}
