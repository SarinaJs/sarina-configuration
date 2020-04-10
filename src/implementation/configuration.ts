import { IConfiguration } from '../abstraction/configuration.interface';
import { ConfigurationElement } from '../abstraction/configuration-element';

export class Configuration implements IConfiguration {
	public readonly elements: ConfigurationElement[];

	public constructor(elements: ConfigurationElement[]) {
		this.elements = elements;
	}

	public has(path: string): boolean {
		const fullPath = this.getFullPath(path);
		return this.elements.findIndex((s) => s.path == fullPath) >= 0;
	}

	public get(path: string): ConfigurationElement {
		const fullPath = this.getFullPath(path);
		return this.elements.find((s) => s.path == fullPath);
	}
	public getScoped(scope: string): IConfiguration {
		const fullPath = this.getFullPath(scope);
		const elements = this.elements.filter((s) => s.path.startsWith(fullPath));

		return new ScopedConfiguration(elements, fullPath);
	}
	public getFullPath(path: string) {
		return path;
	}

	public getAs<T>(path: string, convertor: (value: string) => T, defaultValue?: T): T {
		// first of all, fetch the elements
		const element = this.get(path);

		// if element found we will use convertor in order to convert the value to the target type
		if (element) return convertor(element.value);

		// if element not found and default-value exists, we should return default value
		if (defaultValue) return defaultValue;

		// else, we should return undefined
		return undefined;
	}
	public getAsString(path: string, defaultValue?: string): string {
		return this.getAs<string>(path, (v) => v, defaultValue);
	}
}
export class ScopedConfiguration extends Configuration implements IConfiguration {
	public readonly valueElement: ConfigurationElement;

	public constructor(elements: ConfigurationElement[], public readonly scope: string) {
		super(elements.filter((s) => s.path != scope) /* WE REMOVE THE CURRENT VALUE */);
		this.valueElement = elements.find((s) => s.path == scope) || null; // CURRENT VALUE CAN BE NULL
	}
	public getFullPath(path: string) {
		return `${this.scope}:${path}`;
	}
}
export class RootConfiguration extends Configuration {
	public constructor(elements: ConfigurationElement[]) {
		super(elements);
	}
}
