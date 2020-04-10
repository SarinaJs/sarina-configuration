import { IConfigurationSource, ConfigurationElement } from '@sarina/configuration';
export class MemoryConfigurationSource implements IConfigurationSource {
	public elements: ConfigurationElement[] = [];

	public constructor(elements: ConfigurationElement[] | { [key: string]: string }) {
		// if value is an array, we can pass it as value
		if (Array.isArray(elements)) {
			this.elements = elements;
			return;
		}

		for (const key in elements) {
			const item = elements[key];

			this.elements.push({
				path: key,
				value: item,
			});
		}
	}

	public async load(): Promise<ConfigurationElement[]> {
		return this.elements;
	}
}
