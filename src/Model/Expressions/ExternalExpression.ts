import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";
import { ValueExpression } from "./ValueExpression";
import { VariableExpression } from "./VariableExpression";

export class ExternalExpression implements Expression {
	constructor(
		public returnType: Type,
		public parameters: VariableExpression[],
		public externalFunction: Function
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const args = this.parameters.map((param) => param.evaluate(symbolTable));
		const returnValue = this.returnType.defaultValue();
		returnValue.body = this.externalFunction(...args.map((arg) => arg.body));
		returnValue.constant = true;
		return returnValue;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		return this.returnType;
	}

	deepCopy(): Expression {
		return new ExternalExpression(
			this.returnType,
			this.parameters.map((param) => param.deepCopy() as VariableExpression),
			this.externalFunction
		);
	}

	toString(): string {
		return "external";
	}
}