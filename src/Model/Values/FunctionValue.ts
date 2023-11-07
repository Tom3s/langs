import { Expression } from "../Expressions/Expression";
import { VariableExpression } from "../Expressions/VariableExpression";
import { CompoundStatement } from "../Statements/CompoundStatement";
import { DeclarationStatement } from "../Statements/DeclarationStatement";
import { FunctionType } from "../Types/FunctionType";
import { Type } from "../Types/Type";
import { Value } from "./Value";

export class FunctionValue implements Value {

	constructor (
		public returnType: Type,
		public parameters: DeclarationStatement[],
		public body: CompoundStatement,
		public constant: boolean = false,
	) { }

	getType(): Type {
		return new FunctionType([], this.returnType);
	}

	equals(other: Value): boolean {
		return false;
	}

	toString(): string {
		return "func";
	}
}