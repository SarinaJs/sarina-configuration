import { Configuration, ScopedConfiguration, RootConfiguration } from '@sarina/configuration';

describe('sarina/configuration', () => {
	describe('configuration-builder', () => {
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
				it('should_return_null_if_element_not_found', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.get('host');

					// Assert
					expect(result).toBeNull();
				});
				it('should_return_null_if_element_found_with_null_value', () => {
					// Arrange
					const config = new Configuration([
						{
							path: 'host',
							value: null,
						},
					]);

					// Act
					const result = config.get('host');

					// Assert
					expect(result).toBeNull();
				});
				it('should_return_defaultValue_if_config_not_found', () => {
					// Arrange
					const config = new Configuration([]);

					// Act
					const result = config.get('host', 'http://127.0.0.1');

					// Assert
					expect(result).toBe('http://127.0.0.1');
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
});
