import { StringValue } from "../Values/StringValue";
import { Value } from "../Values/Value";
import { Type } from "./Type";

export class StringType implements Type {
	equals(other: Type): boolean {
		return other instanceof StringType;
	}

	deepCopy(): Type {
		return new StringType();
	}

	toString(): string {
		return "str";
	}

	defaultValue(): Value {
		return new StringValue();
	}
}