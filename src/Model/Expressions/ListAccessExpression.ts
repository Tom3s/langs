import SymbolTable from "../ADT/SymbolTable";
import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { ListValue } from "../Values/ListValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";
import { VariableExpression } from "./VariableExpression";

export class ListAccessExpression implements Expression {
	constructor (
		public list: VariableExpression,
		public index: Expression,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const indexValue = this.index.evaluate(symbolTable);
		if (!indexValue.getType().equals(new IntegerType())) {
			throw new Error("Index must be an integer.");
		}

		const indexNumber = indexValue.body;
		const listValue = this.list.evaluate(symbolTable).body;
		if (indexNumber < 0 || indexNumber >= listValue.length) {
			throw new Error(`Index ${indexNumber} out of bounds (list length: ${listValue.length})`);
		}

		return listValue[indexNumber];
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const listType = this.list.typeCheck(typeEnvironment);
		if (!(listType instanceof ListValue)) {
			throw new Error(`Variable ${this.list.identifier} is not a list`);
		}

		const indexType = this.index.typeCheck(typeEnvironment);
		if (!indexType.equals(new IntegerType())) {
			throw new Error("Index must be an integer.");
		}

		return listType.elementType;
	
	}

	toString(): string {
		return `${this.list.toString()}[${this.index.toString()}]`;
	}

	deepCopy(): Expression {
		return new ListAccessExpression(this.list, this.index);
	}
}