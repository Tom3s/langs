import { Type } from "./Type";

export class ListType implements Type {

	constructor (
		public elementType: Type
	) { }

	equals(other: Type): boolean {
		return other instanceof ListType;
	}
	deepCopy(): Type {
		return new ListType(this.elementType);
	}
	toString(): string {
		return "list";
	}
	defaultValue(): any {
		return [];
	}
}