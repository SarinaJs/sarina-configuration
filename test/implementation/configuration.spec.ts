import { Configuration, ScopedConfiguration, RootConfiguration } from '@sarina/configuration';
import theoretically from 'jest-theories';

describe('sarina/configuration', () => {
	describe('implementation', () => {
		describe('Configuration', () => {
			describe('has()', () => {
				it('should_use_getFullPath_to_get_finalPath', () => {
					// Arrange
					expect.hasAssertions();
					class MyConfiguration extends Configuration {
						getFullPath(path: string) {
							expect(path).toBe('host');
							return path;
						}
					}
					const config = new MyConfiguration([]);

					// Act
					config.has('host');
				});
				it('should_return_false_if_config_not_found', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.has('host');

					// Assert
					expect(result).toBeFalsy();
				});
				it('should_return_true_if_config_exists', () => {
					// Arrange
					const config = new Configuration([
						{
							path: 'host',
							value: 'value',
						},
					]);

					// Act
					const result = config.has('host');

					// Assert
					expect(result).toBeTruthy();
				});
			});
			describe('get()', () => {
				it('should_return_undefined_if_element_not_found', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.get('host');

					// Assert
					expect(result).toBeUndefined();
				});
				it('should_return_element_if_found', () => {
					const config = new Configuration([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);

					// Act
					const result = config.get('host');

					// Assert
					expect(result.path).toBe('host');
					expect(result.value).toBe('http://127.0.0.1');
				});
			});
			describe('getScoped()', () => {
				it('should_return_ScopedConfiguration', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.getScoped('host');

					// Assert
					expect(result).toBeInstanceOf(ScopedConfiguration);
				});
				it('should_set_scope_value', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.getScoped('host') as ScopedConfiguration;

					// Assert
					expect(result.scope).toBe('host');
				});
				it('should_pass_array_of_filtered_elements_to_scopedContainer', () => {
					// Arrange
					const config = new Configuration([
						{
							path: 'log:level',
							value: 'debug',
						},
						{
							path: 'host:url',
							value: 'http://127.0.0.1',
						},
						{
							path: 'host:port',
							value: '3000',
						},
					]);

					// Act
					const result = config.getScoped('host') as ScopedConfiguration;

					// Assert
					expect(result.elements).toHaveLength(2);
					expect(result.elements[0]).toBe(config.elements[1]);
					expect(result.elements[1]).toBe(config.elements[2]);
				});
			});
			describe('getAs<T>()', () => {
				it('should_return_undefined_if_element_not_found_and_no_default_value_provided', () => {
					// Arrange
					const configuration = new Configuration([]);

					// Act
					const value = configuration.getAs<string>('host', (v) => null);

					// Expect
					expect(value).toBeUndefined();
				});
				it('should_return_defaultValue_if_element_not_found', () => {
					// Arrange
					const configuration = new Configuration([]);

					// Act
					const value = configuration.getAs<string>('host', (v) => null, 'test');

					// Expect
					expect(value).toBe('test');
				});
				it('should_use_convertor_if_element_found', () => {
					// Arrange
					expect.assertions(2);
					const configuration = new Configuration([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);

					// Act
					const value = configuration.getAs<string>(
						'host',
						(v) => {
							expect(v).toBe('http://127.0.0.1');
							return v;
						},
						'test',
					);

					// Expect
					expect(value).toBe('http://127.0.0.1');
				});
			});
			describe('getAsString', () => {
				it('should_return_value_if_element_found', () => {
					// Arrange
					const configuration = new Configuration([
						{
							path: 'host',
							value: 'http://127.0.0.1',
						},
					]);

					// Act
					const value = configuration.getAsString('host');

					// Expect
					expect(value).toBe('http://127.0.0.1');
				});
				it('should_return_defaultValue_if_element_not_found', () => {
					// Arrange
					const configuration = new Configuration([]);

					// Act
					const value = configuration.getAsString('host', 'http://localhost');

					// Expect
					expect(value).toBe('http://localhost');
				});
				it('should_return_undefined_if_element_notFound_and_default_notProvided', () => {
					// Arrange
					const configuration = new Configuration([]);

					// Act
					const value = configuration.getAsString('host');

					// Expect
					expect(value).toBeUndefined();
				});
			});
		});
		describe('ScopedConfiguration', () => {
			it('should_not_include_current_value_element', () => {
				// Arrange
				const config = new Configuration([
					{
						path: 'host',
						value: 'true',
					},
					{
						path: 'host:url',
						value: 'http://127.0.0.1',
					},
					{
						path: 'host:port',
						value: '3000',
					},
				]);

				// Act
				const result = config.getScoped('host') as ScopedConfiguration;

				// Assert
				expect(result.elements).toHaveLength(2);
				expect(result.elements[0]).toBe(config.elements[1]);
				expect(result.elements[1]).toBe(config.elements[2]);
			});
			it('valueElement_should_has_value_of_scope_value_if_element_found', () => {
				// Arrange
				const config = new Configuration([
					{
						path: 'host',
						value: 'true',
					},
					{
						path: 'host:url',
						value: 'http://127.0.0.1',
					},
					{
						path: 'host:port',
						value: '3000',
					},
				]);

				// Act
				const result = config.getScoped('host') as ScopedConfiguration;

				// Assert
				expect(result.elements).toHaveLength(2);
				expect(result.valueElement).toBe(config.elements[0]);
			});
			it('valueElement_should_beNull_if_element_not_found', () => {
				// Arrange
				const config = new Configuration([
					{
						path: 'host:url',
						value: 'http://127.0.0.1',
					},
					{
						path: 'host:port',
						value: '3000',
					},
				]);

				// Act
				const result = config.getScoped('host') as ScopedConfiguration;

				// Assert
				expect(result.elements).toHaveLength(2);
				expect(result.valueElement).toBeNull();
			});
			describe('getFullPath', () => {
				it('should_combine_scope_with_path', () => {
					// Arrange
					const scoped = new ScopedConfiguration([], 'host');

					// Act
					const path = scoped.getFullPath('url');

					// Assert
					expect(path).toBe(`host:url`);
				});
			});
		});
		describe('RootConfiguration', () => {
			it('should_pass_elements', () => {
				// Arrange
				const elements = [
					{
						path: 'host',
						value: 'http://127.0.0.1',
					},
				];

				// Act
				const config = new RootConfiguration(elements);

				// Assert
				expect(config.elements).toMatchObject(elements);
			});
		});
	});
});
