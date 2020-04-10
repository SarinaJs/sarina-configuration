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
