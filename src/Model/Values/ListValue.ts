import { ListType } from "../Types/ListType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class ListValue implements Value {
	constructor (
		public elementType: Type,
		public body: Value[] = [],
		public constant: boolean = false,
	) { }
	
	getType(): Type {
		return new ListType(this.elementType);
	}

	equals(other: Value): boolean {
		return other instanceof ListValue && this.body === other.body;
	}

	toString(): string {
		return this.body.toString();
	}
}