import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export class ValueExpression implements Expression {
	constructor(
		public value: Value,
	) { 
		value.constant = true;
	}

	evaluate(symbolTable: SymbolTable): Value {
		return this.value;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		return this.value.getType();
	}

	toString(): string {
		return this.value.toString();
	}

	deepCopy(): Expression {
		return new ValueExpression(this.value);
	}
}