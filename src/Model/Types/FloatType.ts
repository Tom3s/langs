import { FloatValue } from "../Values/FloatValue";
import { Value } from "../Values/Value";
import { Type } from "./Type";

export class FloatType implements Type {
	equals(other: Type): boolean {
		return other instanceof FloatType;
	}
	deepCopy(): Type {
		return new FloatType();
	}
	toString(): string {
		return "float";
	}
	defaultValue(): Value {
		return new FloatValue();
	}
}