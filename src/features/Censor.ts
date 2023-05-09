import {PackFeature} from "./PackFeature";
import {makeParameter, PackDefinitionBuilder, ParameterType, ValueType} from "@codahq/packs-sdk";
import {FormulaName} from "../FormulaName";
import {WARNING} from "../CommonTexts";

export class Censor extends PackFeature {
    static DEFAULT_CHAR: string = "█";

    register(pack: PackDefinitionBuilder) {
        pack.addFormula({
            name: FormulaName.CENSOR,
            description: `Censor all matches in the value. \n\n${WARNING}`,
            resultType: ValueType.String,
            parameters: [
                makeParameter({
                    name: "value",
                    description: "The value to censor.",
                    type: ParameterType.String,
                    optional: false,
                }),
                makeParameter({
                    name: "replacement",
                    description: `The value used to replace each character of censored parts. Default is ${Censor.DEFAULT_CHAR}.`,
                    type: ParameterType.String,
                    optional: true,
                }),
                makeParameter({
                    name: "replacementCount",
                    description: `The number of times the replacement is repeated for each censored part. By default, and if this value is negative, the length of the censored part is used.`,
                    type: ParameterType.Number,
                    optional: true,
                }),
                makeParameter({
                    name: "pattern",
                    description: "The RegEx pattern used to filter the censored parts.",
                    type: ParameterType.String,
                    optional: true,
                }),
                makeParameter({
                    name: "keepSpaces",
                    description: `Keep the spaces or replace them with the replacement.`,
                    type: ParameterType.Boolean,
                    optional: true,
                }),
            ],

            execute: async ([value, replacement = Censor.DEFAULT_CHAR, replacementCount = -1, pattern, keepSpaces = true]) => {
                if (!pattern) return this.censor(value, replacement, replacementCount, keepSpaces);

                const regexp = new RegExp(pattern, 'g');

                let match;
                while ((match = regexp.exec(value)) !== null) {
                    const censoredMatch = this.censor(match[0], replacement, replacementCount, keepSpaces);
                    value = value.substring(0, match.index) + censoredMatch + value.substring(match.index + match[0].length);
                }

                return value;
            },
        });

        pack.addColumnFormat({
            name: "Censor",
            instructions: `Censor the values of the column. ${WARNING}`,
            formulaName: FormulaName.CENSOR
        });
    }

    private censor(value: string, replacement: string, replacementCount: number, keepSpaces: boolean) {
        if(replacementCount >= 0) return replacement.repeat(replacementCount);
        return value.split(' ').map(p => replacement.repeat(p.length)).join(keepSpaces ? ' ' : replacement);
    }
}