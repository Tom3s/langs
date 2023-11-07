import { BooleanType } from "../Types/BooleanType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class BooleanValue implements Value {
	constructor (
		public body: boolean = false,
		public constant: boolean = false,
	) {}

	getType(): Type {
		return new BooleanType();
	}

	equals(other: Value): boolean {
		return other instanceof BooleanValue && this.body === other.body;
	}

	toString(): string {
		return this.body.toString();
	}
}