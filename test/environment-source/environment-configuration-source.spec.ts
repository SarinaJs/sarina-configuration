import { EnvironmentConfigurationSource, ConfigurationBuilder } from '@sarina/configuration';

describe('sarina/configuration', () => {
	describe('environment-source', () => {
		describe('MemoryConfigurationSource', () => {
			describe('load', () => {
				it('should_return_elements_as_load', async () => {
					// Arrange
					const temp = process.env;
					process.env = {
						HOST: 'http://127.0.0.1',
					};
					const source = new EnvironmentConfigurationSource();

					// Act
					const data = await source.load();

					// Assert
					expect(data).toMatchObject([
						{
							path: 'HOST',
							value: 'http://127.0.0.1',
						},
					]);

					// Clean-up
					process.env = temp;
				});
				it('should_return_empty_array_if_process.env_is_null', async () => {
					// Arrange
					const temp = process.env;
					process.env = null;
					const source = new EnvironmentConfigurationSource();

					// Act
					const data = await source.load();

					// Assert
					expect(data).toMatchObject([]);

					// Clean-up
					process.env = temp;
				});
			});
			it('should_be_able_to_register_as_config_source', async () => {
				// Arrange
				const temp = process.env;
				process.env = {
					HOST: 'http://127.0.0.1',
				};
				const builder = new ConfigurationBuilder();
				const source = new EnvironmentConfigurationSource();

				// Act
				builder.add(source);
				const provider = await builder.build();

				// Assert
				const value = provider.get('HOST');
				expect(value).toMatchObject({
					path: 'HOST',
					value: 'http://127.0.0.1',
				});

				// Clean-up
				process.env = temp;
			});
		});
	});
});
