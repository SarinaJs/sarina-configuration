Sarina-Configuration
=========

![build-and-test](https://github.com/SarinaJs/sarina-configuration/workflows/build-and-test/badge.svg)
[![npm version](https://badge.fury.io/js/%40sarina%2Fconfiguration.svg)](https://badge.fury.io/js/%40sarina%2Fconfiguration)

Key/Value pair configuration library

> The package is part of `@Sarina` framework

## Installtion

Install by `yarn`

```sh
yarn add @sarina/configuration
```

## Quick Start

```ts
import { ConfigurationBuilder, MemoryConfigurationSource, EnvironmentConfigurationSource } from '@sarina/configuration';

const bootstrap = async () => {
	const provider = await new ConfigurationBuilder()
		.add(new MemoryConfigurationSource({ HOST: 'http://127.0.0.1', PORT: '3000' }))
		.add(new EnvironmentConfigurationSource())
		.build();

	const host = provider.getAsString('HOST');
	const port = provider.getAsString('PORT');
};

bootstrap()
	.then()
	.catch();
```

# API

## has()

To check if value exists or not use `has` method:
```ts
    const provider = await new ConfigurationBuilder()
        .add(new MemoryConfigurationSource({ HOST: 'http://127.0.0.1', PORT: '3000' }))
        .build();
    const isHostExists = provider.has("HOST");
    // true
```


## has()

To check if value exists or not use `has` method:
```ts
    const provider = await new ConfigurationBuilder()
        .add(new MemoryConfigurationSource({ HOST: 'http://127.0.0.1', PORT: '3000' }))
        .build();
    const isHostExists = provider.has("HOST");
    // true
```

## get(path: string)

To get configuration element use `get` method:
```ts
    const provider = await new ConfigurationBuilder()
        .add(new MemoryConfigurationSource({ HOST: 'http://127.0.0.1', PORT: '3000' }))
        .build();

    const config = provider.get("HOST");
    const host = config.value;
```

## getScoped(path: string)

Library supports nested configuration. The `getScoped` method, will get a `path` and returns an instance of `IConfiguration` which contains all configuration methods scoped to the `path`:

```ts
    const provider = await new ConfigurationBuilder()
        .add(new MemoryConfigurationSource([
            { path:"host:url",value:"http://127.0.0.1" },
            { path:"host:port",value:"3000" }
        ]))
        .build();

    const hostConfig = provider.getScoped("host");
    const host = hostConfig.get("url").value;
    const port = hostConfig.get("port").value;
```

## getAsString(path: string, defaultValue?: string)

In order to get a value of configuration, use `getAsString`:

```ts
    const provider = await new ConfigurationBuilder()
        .add(new MemoryConfigurationSource([
            { path:"host:url",value:"http://127.0.0.1" },
            { path:"host:port",value:"3000" }
        ]))
        .build();

    const url = provider.getAsString("host:url","http://localhost");
    // url = http://127.0.0.1
```

# Custom Source
Sarina-Configuration allows developer to implement custom sources. To create your own source, you need to impement `IConfigurationSource` and implement `load` method

```ts

class MySource implements IConfigurationSource {
	public async load(): Promise<ConfigurationElement[]> {
		return [
			{
				path: 'host',
				value: 'http://127.0.0.1',
			},
		];
	}
}
const provider = await new ConfigurationBuilder()
    .add(new MySource())
    .build();
```

Sarina provides some built-in sources:

- `MemoryConfigurationSource` provides in memory configuration as `array` or `object`.
- `EnvironmentConfigurationSource` provides elememtns by using `process.env`. 



# How to contribute
Just fork the project, make your changes send us a PR.
