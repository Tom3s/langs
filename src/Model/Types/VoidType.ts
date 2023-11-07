import { Type } from "./Type";

export class VoidType implements Type {
	equals(other: Type): boolean {
		return other instanceof VoidType;
	}
	deepCopy(): Type {
		return new VoidType();
	}
	toString(): string {
		return "void";
	}
	defaultValue(): any {
		return null;
	}
}