import { ConfigurationBuilder, ConfigurationElement, RootConfiguration } from '@sarina/configuration';

describe('sarina/configuration', () => {
	describe('configuration-builder', () => {
		describe('ConfigurationBuilder', () => {
			describe('add', () => {
				it('should_add_source_into_sources', () => {
					// Arrange
					const builder = new ConfigurationBuilder();

					// Act
					const source = {
						load: async () => {
							return [];
						},
					};
					builder.add(source);

					// Assert
					expect(builder.sources).toHaveLength(1);
					expect(builder.sources[0]).toBe(source);
				});
			});
			describe('populateConfigItems', () => {
				it('should_fetch_all_configElements_of_sources', async () => {
					// Arrange
					const builder = new ConfigurationBuilder();
					const items: ConfigurationElement[] = [
						{
							path: 'host:url',
							value: '127.0.0.1',
						},
						{
							path: 'host:port',
							value: '3000',
						},
					];
					const source1 = {
						load: async () => {
							return [items[0]];
						},
					};
					const source2 = {
						load: async () => {
							return [items[1]];
						},
					};
					builder.add(source1);
					builder.add(source2);

					// Act
					const configs = await builder.populateConfigItems();

					// Assert
					expect(configs).toHaveLength(2);
					expect(configs[0]).toBe(items[0]);
					expect(configs[1]).toBe(items[1]);
				});
				it('should_fetch_all_configElements_of_sources_in_order_of_registration', async () => {
					// Arrange
					const builder = new ConfigurationBuilder();
					const items: ConfigurationElement[] = [
						{
							path: 'host:url',
							value: '127.0.0.1',
						},
						{
							path: 'host:port',
							value: '3000',
						},
					];
					const source1 = {
						load: () => {
							return new Promise<ConfigurationElement[]>((resolve, reject) => {
								setTimeout(() => {
									resolve([items[0]]);
								}, 5);
							});
						},
					};
					const source2 = {
						load: async () => {
							return [items[1]];
						},
					};
					builder.add(source1);
					builder.add(source2);

					// Act
					const configs = await builder.populateConfigItems();

					// Assert
					expect(configs).toHaveLength(2);
					expect(configs[0]).toBe(items[0]);
					expect(configs[1]).toBe(items[1]);
				});
				it('shoudl_replace_with_latest_element', async () => {
					// Arrange
					const builder = new ConfigurationBuilder();
					const items: ConfigurationElement[] = [
						{
							path: 'host:url',
							value: '127.0.0.1',
						},
						{
							path: 'host:url',
							value: '127.0.0.2',
						},
					];
					const source = {
						load: async () => {
							return items;
						},
					};
					builder.add(source);

					// Act
					const configs = await builder.populateConfigItems();

					// Assert
					expect(configs).toHaveLength(1);
					expect(configs[0]).toBe(items[1]);
				});
			});
			describe('build', () => {
				it('should_return_a_configurationRoot', async () => {
					// Arrange
					const builder = new ConfigurationBuilder();

					// Act
					const configuration = await builder.build();

					// Assert
					expect(configuration).toBeInstanceOf(RootConfiguration);
				});
				it('should_pass_configProvider_with_elements_to_configuration', async () => {
					// Arrange
					const builder = new ConfigurationBuilder();
					builder.add({
						load: async () => {
							return [
								{
									path: 'host',
									value: 'http://127.0.0.1',
								},
							];
						},
					});

					// Act
					const configuration = (await builder.build()) as RootConfiguration;

					// Assert
					expect(configuration.elements).toHaveLength(1);
					expect(configuration.elements).toMatchObject([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);
				});
			});
		});
	});
});
