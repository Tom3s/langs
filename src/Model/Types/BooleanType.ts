import { BooleanValue } from "../Values/BooleanValue";
import { Value } from "../Values/Value";
import { Type } from "./Type";

export class BooleanType implements Type {
	equals(other: Type): boolean {
		return other instanceof BooleanType;
	}
	deepCopy(): Type {
		return new BooleanType();
	}
	toString(): string {
		return "bool";
	}
	defaultValue(): Value {
		return new BooleanValue(false);
	}
}