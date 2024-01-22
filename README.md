# stronk

an easy way to make stronger types in typescript + an eslint plugin to enforce them

## Installation

```sh
npm install stronk-ts
```

## Usage

Stronk types are created using the `type` base object:

```ts
import { type } from "stronk-ts";
```

`type` exposes a the following methods:

-   `create` - creates a new type
-   `is` - checks if a value is of a type
-   `of` - gets the type of a value

### `create`

`create` takes a type definition and returns a new type:

```ts
const BrandedString = type.create("BrandedString", String);
const myString = BrandedString("hello world");
```

### `is`

`is` takes a type and a value and returns a boolean indicating whether the value is of the type:

```ts
const BrandedString = type.create("BrandedString", String);
const myString = BrandedString("hello world");

type.is(myString, BrandedString); // true
type.is("hello world", BrandedString); // false
type.is(myString, String); // true
```

### `of`

`of` takes a value and returns its type:

```ts
const BrandedString = type.create("BrandedString", String);
const myString = BrandedString("hello world");

type.of(myString); // "BrandedString"
type.of("hello world"); // string
```

## Rules

### `no-typeof`

`no-typeof` disallows the use of `typeof` to check the type of a value. Instead, use `type.is`:

```ts
// bad
const stringType = typeof "hello world";

// good
const stringType = type.of("hello world");
```

### `no-typeof-comparison`

`no-typeof-comparison` disallows the use of `typeof` to check the type of a value in a comparison.
Instead, use `type.is`:

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
