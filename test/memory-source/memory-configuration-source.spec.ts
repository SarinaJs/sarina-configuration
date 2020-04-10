import { MemoryConfigurationSource, ConfigurationBuilder } from '@sarina/configuration';

describe('sarina/configuration', () => {
	describe('memory-source', () => {
		describe('MemoryConfigurationSource', () => {
			describe('constructor()', () => {
				it('should_set_elements_if_is_array', () => {
					// Arrange
					const items = [
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					];

					// Act
					const source = new MemoryConfigurationSource(items);

					// Assert
					expect(source.elements).toHaveLength(1);
					expect(source.elements).toMatchObject(items);
				});
				it('should_set_elements_if_is_object', () => {
					// Arrange
					const items = {
						host: 'http://127.0.0.1',
					};

					// Act
					const source = new MemoryConfigurationSource(items);

					// Assert
					expect(source.elements).toHaveLength(1);
					expect(source.elements).toMatchObject([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);
				});
			});
			describe('load', () => {
				it('should_return_elements_as_load', async () => {
					// Arrange
					const items = {
						host: 'http://127.0.0.1',
					};
					const source = new MemoryConfigurationSource(items);

					// Act
					const data = await source.load();

					// Assert
					expect(data).toMatchObject([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);
				});
			});
			it('should_be_able_to_register_as_config_source', async () => {
				// Arrange
				const builder = new ConfigurationBuilder();
				const memorySource = new MemoryConfigurationSource([
					{
						path: 'host',
						value: 'http://127.0.0.1',
					},
				]);

				// Act
				builder.add(memorySource);
				const provider = await builder.build();

				// Assert
				const value = provider.get('host');
				expect(value).toMatchObject({
					path: 'host',
					value: 'http://127.0.0.1',
				});
			});
		});
	});
});
