import { IntegerValue } from "../Values/IntegerValue";
import { Value } from "../Values/Value";
import { Type } from "./Type";

export class IntegerType implements Type {
	equals(other: Type): boolean {
		return other instanceof IntegerType;
	}
	deepCopy(): Type {
		return new IntegerType();
	}
	toString(): string {
		return "int";
	}
	defaultValue(): Value {
		return new IntegerValue();
	}
}