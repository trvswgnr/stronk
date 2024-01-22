const TYPE = Symbol.for("stronk.type");
const BASE = Symbol.for("stronk.base");

type Constructor<T, A extends unknown[]> = new (...args: A) => T;

type FunctionOrConstructor<F extends (...args: unknown[]) => unknown> =
    | Constructor<ReturnType<F>, Parameters<F>>
    | F;

/**
 * returns the type of a value
 * @param value the value to get the type of
 * @returns the type of the value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#custom_method_that_gets_a_more_specific_type
 */
function of(value: unknown): string {
    // null is a special case because `typeof null` returns "object"
    if (value === null) {
        return "null";
    }

    const baseType = typeof value;

    // Primitive types like "string", "number", "boolean", "undefined"
    if (!["object", "function"].includes(baseType)) {
        return baseType;
    }

    // Symbol.toStringTag often specifies the "display name" of the
    // object's class. It's used in Object.prototype.toString().
    if (typeof value === "object" && value !== null) {
        if (TYPE in value && typeof value[TYPE] === "string") {
            return value[TYPE];
        }
        if (Symbol.toStringTag in value) {
            const tag = value[Symbol.toStringTag];
            if (typeof tag === "string") {
                return tag;
            }
        }
    }

    // If it's a function whose source code starts with the "class" keyword
    if (baseType === "function") {
        const str = Function.prototype.toString.call(value);
        if (str.startsWith("class")) {
            // get the name of the class
            const match = str.match(/^class\s+([^\s(]+)/);
            if (match) {
                return match[1];
            }
            return "class";
        }
    }

    // The name of the constructor; for example `Array`, `GeneratorFunction`,
    // `Number`, `String`, `Boolean` or `MyCustomClass`
    const className = value?.constructor?.name;
    if (typeof className === "string" && className !== "" && className !== "Object") {
        return className;
    }

    // At this point there's no robust way to get the type of value,
    // so we use the base implementation.
    return baseType;
}

type AnyFn = (...args: any[]) => any;
type Type<T, Z> = Z & { [TYPE]: T };

type CustomType<T extends string, C extends AnyFn | never> = ((
    ...args: Parameters<C>
) => Type<T, ReturnType<C>>) & {
    from: (x: ReturnType<C>) => Type<T, ReturnType<C>>;
    [BASE]: T;
};

function create<const T extends string, const C extends AnyFn>(
    name: T,
    constructorMethod: C,
): CustomType<T, C> {
    return Object.assign(
        (...args: any[]) => {
            const base = constructorMethod(...args);
            return Object.assign(base, { [TYPE]: name });
        },
        {
            from: (x: any) => Object.assign(x, { [TYPE]: name }),
            [BASE]: name,
        },
    );
}

type BasicTypes = {
    string: String;
    number: number;
    boolean: boolean;
    null: null;
    undefined: undefined;
    object: object;
    function: Function;
    symbol: symbol;
    bigint: bigint;
};

type WrapperToPrimitive<X> = X extends String
    ? string
    : X extends Number
    ? number
    : X extends Boolean
    ? boolean
    : X extends Symbol
    ? symbol
    : X extends BigInt
    ? bigint
    : X;

type TypeOf<X> = X extends Type<infer T, infer S>
    ? Type<T, S>
    : X extends keyof BasicTypes
    ? BasicTypes[X]
    : X extends `${infer S}`
    ? Type<S, unknown>
    : X extends new (...args: any) => any
    ? InstanceType<X> extends PrimitiveWrapper
        ? WrapperToPrimitive<InstanceType<X>>
        : InstanceType<X>
    : never;

const PRIMITIVE_TYPES = {
    string: String,
    number: Number,
    boolean: Boolean,
    null: null,
    undefined: undefined,
    symbol: Symbol,
    bigint: BigInt,
} as const;

type PrimitiveType = keyof typeof PRIMITIVE_TYPES;
type PrimitiveWrapper = {
    [K in PrimitiveType]: (typeof PRIMITIVE_TYPES)[K];
}[PrimitiveType];

type InferredType<X> = X extends Constructor<any, any>
    ? WrapperToPrimitive<InstanceType<X>>
    : X extends AnyFn
    ? ReturnType<X>
    : never;

/**
 * checks if a value is of a certain type
 * @param value the value to check
 * @param name the name of the type to check against (case insensitive)
 * @returns true if the value is of the given type
 */
function is(value: unknown, name: undefined): value is undefined;
function is(value: unknown, name: null): value is null;
function is<const X extends FunctionOrConstructor<AnyFn>>(
    value: unknown,
    name: X,
): value is InferredType<X>;
function is(value: unknown, name: unknown) {
    if (name === undefined) return value === undefined;
    if (name === null) return value === null;
    if (value === null || value === undefined) return false;
    if (typeof name === "function") {
        if (BASE in name) return name[BASE] === of(value);
        return value instanceof name || value?.constructor === name;
    }
    return of(value) === name;
}

export namespace type {
    export type infer<T extends AnyFn> = ReturnType<T>;
}

export type type = {
    of: typeof of;
    is: typeof is;
    create: typeof create;
};

export const type = {
    of,
    is,
    create,
};
