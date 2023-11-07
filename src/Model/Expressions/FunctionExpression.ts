import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export class FunctionExpression implements Expression {
	constructor (
		public functionName: string,
		public parameters: Expression[],
		public returnType: Type,
	) { }
	
	evaluate(symbolTable: SymbolTable): Value {
		const functionValue = symbolTable.get(this.functionName);
		if (functionValue === undefined) {
			throw new Error(`Function ${this.functionName} not found`);
		}
		return functionValue;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const functionType = typeEnvironment.get(this.functionName);
		if (functionType === undefined) {
			throw new Error(`Function ${this.functionName} not found`);
		}
		return functionType;
	}

	toString(): string {
		return this.functionName;
	}

	deepCopy(): Expression {
		return new FunctionExpression(this.functionName, this.parameters.map(p => p.deepCopy()), this.returnType.deepCopy());
	}
}