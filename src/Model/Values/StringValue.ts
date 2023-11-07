import { StringType } from "../Types/StringType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class StringValue implements Value {
	constructor (
		public body: string = "",
		public constant: boolean = false,
	) {}

	getType(): Type {
		return new StringType();
	}

	equals(other: Value): boolean {
		return other instanceof StringValue && this.body === other.body;
	}

	toString(): string {
		return this.body.toString();
	}
}