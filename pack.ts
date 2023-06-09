import * as coda from '@codahq/packs-sdk';
import {PackFeature} from './src/features/PackFeature';
import {Censor} from './src/features/Censor';
import texts from './src/assets/texts.json';
import {LoremIpsum} from './src/features/LoremIpsum';
import {RandomizeNumbers} from './src/features/RandomizeNumbers';

export const TEXTS = texts;
export const pack = coda.newPack();

registerFeatures(
	new Censor(),
	new LoremIpsum(),
	new RandomizeNumbers()
);

function registerFeatures(...features: PackFeature[]) {
	features.forEach(feature => feature.register(pack));
}
