import { FloatType } from "../Types/FloatType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class FloatValue implements Value {
	constructor (
		public body: number = 0,
		public constant: boolean = false,
	) {
		body = Math.floor(body);
	}

	getType(): Type {
		return new FloatType();
	}

	equals(other: Value): boolean {
		return other instanceof FloatValue && this.body === other.body;
	}

	toString(): string {
		return this.body.toString();
	}
}