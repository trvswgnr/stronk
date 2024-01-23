# stronk

`stronk` drastically improves the way you create and work with types. It introduces a way to create stronger, nominally typed systems, effectively enhancing JavaScript's typing capabilities. This library allows for runtime type checks, making it a powerful tool for developers who need precise, runtime-validatable branded types.

## Motivation

TypeScript's structural type system is fine, but it falls short in scenarios where nominal typing is needed. Types in TypeScript are not checkable at runtime. `stronk` fills this gap by enabling developers to define types that are both nominally distinct and runtime-checkable, improving code safety and robustness.

## Installation

```sh
npm install stronk-ts
```

## Usage

### Creating Branded Types

```ts
import { type } from "stronk-ts";

const BrandedString = type.create("BrandedString", String);
const myString = BrandedString("hello world");
```

### Runtime Type Checking

```ts
type.is(myString, BrandedString); // true
type.is("hello world", BrandedString); // false
type.is(myString, String); // narrows `myString` to type `string`
```

### Specific Type Retrieval

```ts
type.of(myString); // "BrandedString"
type.of("hello world"); // "string"
```

## Key Features

- **Nominal Typing**: Introduces nominal typing to TypeScript, making your types distinct beyond structural similarities.
- **Runtime Type Checks**: `type.is` allows you to check and narrow types at runtime, ensuring type safety beyond compile time.
- **Enhanced Type Identification**: `type.of` returns specific types, providing more detailed type information than the standard `typeof`.

## ESLint Plugin Rules

### `no-typeof`

Disallows the use of `typeof` for type checking. Use `type.is` instead.

```ts
// bad
const stringType = typeof "hello world";

// good
const stringType = type.of("hello world");
```

### `no-typeof-comparison`

Prevents `typeof` comparisons. Use `type.is` for comparisons.

```ts
// bad
if (typeof "hello world" === "string") {
    // ...
}

// good
if (type.is("hello world", String)) {
    // ...
}
```

## Contributing

Contributions are welcome! Create an issue or open a pull request if there's something you'd like to be different.

## Roadmap

The goal is to continuously evolve `stronk`, adding more features and capabilities to enhance the type system.

## License

`stronk` is available under [the MIT license](LICENSE).
