// @ts-check
/** @type {import("eslint").ESLint.Plugin}*/
const plugin = {
    configs: {
        recommended: {
            plugins: ["stronk-ts"],
            rules: {
                "stronk-ts/no-typeof-comparison": "warn",
                "stronk-ts/no-typeof": "warn",
            },
        },
    },
    rules: {
        "no-typeof-comparison": {
            meta: {
                hasSuggestions: true,
                type: "suggestion",
                docs: {
                    description: "Disallow use of `typeof` operator in equality comparisons.",
                },
                fixable: "code",
                messages: {
                    useTypeIs: "Use `type.is` instead.",
                },
                schema: [], // no options
            },
            create(context) {
                const code = context.sourceCode;
                return {
                    BinaryExpression(node) {
                        const left = node.left;
                        const right = node.right;
                        if (
                            node.operator === "===" ||
                            node.operator === "==" ||
                            node.operator === "!==" ||
                            node.operator === "!="
                        ) {
                            const negate =
                                node.operator === "!==" || node.operator === "!=" ? "!" : "";
                            if (left.type === "UnaryExpression" && left.operator === "typeof") {
                                const leftText = code.getText(left.argument);
                                const rightText = getConstructorName(code.getText(right));
                                return context.report({
                                    node,
                                    message: "Unexpected typeof, use `type.is` instead.",
                                    suggest: [
                                        {
                                            messageId: "useTypeIs",
                                            fix: (fixer) =>
                                                fixer.replaceText(
                                                    node,
                                                    `${negate}type.is(${leftText}, ${rightText})`,
                                                ),
                                        },
                                    ],
                                });
                            }
                            if (right.type === "UnaryExpression" && right.operator === "typeof") {
                                const leftText = getConstructorName(code.getText(left));
                                const rightText = code.getText(right.argument);
                                return context.report({
                                    node,
                                    message: "Unexpected typeof, use `type.is` instead.",
                                    suggest: [
                                        {
                                            messageId: "useTypeIs",
                                            fix: (fixer) =>
                                                fixer.replaceText(
                                                    node,
                                                    `${negate}type.is(${rightText}, ${leftText})`,
                                                ),
                                        },
                                    ],
                                });
                            }
                        }
                    },
                };
            },
        },
        "no-typeof": {
            meta: {
                hasSuggestions: true,
                type: "suggestion",
                docs: {
                    description: "Disallow use of `typeof` operator.",
                },
                fixable: "code",
                messages: {
                    useTypeOf: "Use `type.of` instead.",
                },
                schema: [], // no options
            },
            create(context) {
                const code = context.sourceCode;
                return {
                    UnaryExpression(node) {
                        if (node.operator === "typeof") {
                            context.report({
                                node,
                                message: "Unexpected typeof, use `type.of` instead.",
                                suggest: [
                                    {
                                        messageId: "useTypeOf",
                                        fix: (fixer) =>
                                            fixer.replaceText(
                                                node,
                                                `type.of(${code.getText(node.argument)})`,
                                            ),
                                    },
                                ],
                            });
                        }
                    },
                };
            },
        },
    },
};

/**
 * @param {string} text
 * @returns {string}
 */
function getConstructorName(text) {
    switch (text) {
        case '"string"':
            return "String";
        case '"number"':
            return "Number";
        case '"boolean"':
            return "Boolean";
        case '"symbol"':
            return "Symbol";
        case '"bigint"':
            return "BigInt";
        case '"function"':
            return "Function";
        case '"object"':
            return "Object";
        case '"undefined"':
            return "undefined";
        case '"null"':
            return "null";
        default:
            return text;
    }
}

module.exports = plugin;
