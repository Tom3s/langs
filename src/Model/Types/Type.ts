import { Value } from "../Values/Value";

export interface Type {
	// constant: boolean;
	equals(other: Type): boolean;
	deepCopy(): Type;
	toString(): string;
	defaultValue(): Value;
}