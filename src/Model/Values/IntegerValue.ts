import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class IntegerValue implements Value {
	constructor (
		public body: number = 0,
		public constant: boolean = false,
	) {
		body = Math.floor(body);
	}

	getType(): Type {
		return new IntegerType();
	}

	equals(other: Value): boolean {
		return other instanceof IntegerValue && this.body === other.body;
	}

	toString(): string {
		return this.body.toString();
	}
}