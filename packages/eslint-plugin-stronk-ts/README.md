# eslint-plugin-stronk-ts

Provides a set of rules for making your types stronger in TypeScript. Meant to be used in
conjunction with [stronk-ts](https://github.com/trvswgnr/stronk-ts).

## Installation

```sh
npm install --save-dev eslint eslint-plugin-stronk-ts
```

## Usage

Extend the recommended ruleset in your `.eslintrc` file:

```json
{
    "extends": ["plugin:stronk-ts/recommended"]
}
```

Or add `stronk-ts` to the plugins section of your `.eslintrc` configuration file. You can omit the
`eslint-plugin-` prefix:

```json
{
    "plugins": ["stronk-ts"]
}
```

Configure the rules you want to use or change under the rules section:

```json
{
    "rules": {
        "stronk-ts/no-typeof": "off",
        "stronk-ts/no-typeof-comparison": "error"
    }
}
```
