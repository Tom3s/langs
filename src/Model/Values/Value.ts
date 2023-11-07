import { Type } from "../Types/Type";

export interface Value {
	getType(): Type;
	equals(other: Value): boolean;
	// hashCode(): number;
	toString(): string;
	constant: boolean;
	body: any;
}