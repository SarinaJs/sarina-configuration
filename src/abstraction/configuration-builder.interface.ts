import { IConfigurationSource } from './configuration-source.interface';
import { IConfiguration } from './configuration.interface';

export interface IConfigurationBuilder {
	add(source: IConfigurationSource): IConfigurationBuilder;
	build(): Promise<IConfiguration>;
}
