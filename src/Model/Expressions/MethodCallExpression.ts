import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";
import { FunctionCallExpression } from "./FunctionCallExpression";

export class MethodCallExpression implements Expression {

	constructor(
		public object: Expression,
		public methodName: string,
		public parameters: Expression[],
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const functionCall = new FunctionCallExpression(
			this.methodName,
			[this.object, ...this.parameters]
		)
		return functionCall.evaluate(symbolTable)
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const functionCall = new FunctionCallExpression(
			this.methodName,
			[this.object, ...this.parameters]
		)
		return functionCall.typeCheck(typeEnvironment);
	}

	deepCopy(): Expression {
		return new MethodCallExpression(
			this.object.deepCopy(),
			this.methodName,
			this.parameters.map(parameter => parameter.deepCopy()),
		);
	}

	toString(): string {
		return `${this.object.toString()}.${this.methodName}(${this.parameters.map(parameter => parameter.toString()).join(", ")})`;
	}
}