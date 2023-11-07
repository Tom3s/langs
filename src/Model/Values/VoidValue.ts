import { Type } from "../Types/Type";
import { VoidType } from "../Types/VoidType";
import { Value } from "./Value";

export class VoidValue implements Value {

	constant: boolean = false;
	body: any = null;

	getType(): Type {
		return new VoidType();
	}

	equals(other: Value): boolean {
		return false;
	}

	toString(): string {
		return "null";
	}
}