import type {
	ColumnBuilderBaseConfig,
	ColumnDataType,
	GeneratedIdentityConfig,
	IsIdentityByDefault,
} from '~/column-builder.ts';
import { entityKind, is } from '~/entity.ts';
import { PgSequence, type PgSequenceOptions } from '../sequence.ts';
import { PgColumnBuilder } from './common.ts';

export abstract class PgIntColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
> extends PgColumnBuilder<
	T,
	{ generatedIdentity: GeneratedIdentityConfig }
> {
	static readonly [entityKind]: string = 'PgIntColumnBaseBuilder';

	generatedAlwaysAsIdentity(
		sequence?: PgSequenceOptions & { name?: string } | PgSequence,
	): IsIdentityByDefault<this, 'always'> {
		if (sequence) {
			if (is(sequence, PgSequence)) {
				this.config.generatedIdentity = {
					type: 'always',
					sequenceName: sequence.seqName,
					sequenceOptions: sequence.seqOptions,
				};
			} else {
				const { name, ...options } = sequence;
				this.config.generatedIdentity = {
					type: 'always',
					sequenceName: name,
					sequenceOptions: options,
				};
			}
		}

		return this as any;
	}

	generatedByDefaultAsIdentity(
		sequence?: PgSequenceOptions & { name?: string } | PgSequence,
	): IsIdentityByDefault<this, 'byDefault'> {
		if (sequence) {
			if (is(sequence, PgSequence)) {
				this.config.generatedIdentity = {
					type: 'byDefault',
					sequenceName: sequence.seqName,
					sequenceOptions: sequence.seqOptions,
				};
			} else {
				const { name, ...options } = sequence;
				this.config.generatedIdentity = {
					type: 'byDefault',
					sequenceName: name,
					sequenceOptions: options,
				};
			}
		}

		return this as any;
	}
}
