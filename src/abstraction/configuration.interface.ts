export interface IConfiguration {
	has(path: string): boolean;
	get(path: string, defaultValue?: string): string;
	getScoped(scope: string): IConfiguration;
}
