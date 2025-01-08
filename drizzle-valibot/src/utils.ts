import type { Column, SelectedFieldsFlat, Table, View } from 'drizzle-orm';
import type { PgEnum } from 'drizzle-orm/pg-core';
import type * as v from 'valibot';
import type { literalSchema } from './column.ts';

export function isColumnType<T extends Column>(column: Column, columnTypes: string[]): column is T {
	return columnTypes.includes(column.columnType);
}

export function isWithEnum(column: Column): column is typeof column & { enumValues: [string, ...string[]] } {
	return 'enumValues' in column && Array.isArray(column.enumValues) && column.enumValues.length > 0;
}

export const isPgEnum: (entity: any) => entity is PgEnum<[string, ...string[]]> = isWithEnum as any;

type Literal = v.InferOutput<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];

export type IsNever<T> = [T] extends [never] ? true : false;

export type ArrayHasAtLeastOneValue<TEnum extends [any, ...any[]] | undefined> = TEnum extends [infer TString, ...any[]]
	? TString extends `${infer TLiteral}` ? TLiteral extends any ? true
		: false
	: false
	: false;

export type ColumnIsGeneratedAlwaysAs<TColumn extends Column> = TColumn['_']['identity'] extends 'always' ? true
	: TColumn['_']['generated'] extends undefined ? false
	: TColumn['_']['generated'] extends infer TGenerated extends { type: string }
		? TGenerated['type'] extends 'byDefault' ? false
		: true
	: true;

export type RemoveNever<T> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type RemoveNeverElements<T extends any[]> = T extends [infer First, ...infer Rest]
	? IsNever<First> extends true ? RemoveNeverElements<Rest>
	: [First, ...RemoveNeverElements<Rest>]
	: [];

export type GetSelection<T extends SelectedFieldsFlat<Column> | Table | View> = T extends Table ? T['_']['columns']
	: T extends View ? T['_']['selectedFields']
	: T;