import { Type } from "./Type";

export class FunctionType implements Type {
	constructor (
		public parameters: Type[],
		public returnType: Type
	) { }
	
	equals(other: Type): boolean {
		return other instanceof FunctionType;
	}

	deepCopy(): Type {
		return new FunctionType(this.parameters, this.returnType);
	}

	toString(): string {
		return "func";
	}

	defaultValue(): any {
		return () => {};
	}
}