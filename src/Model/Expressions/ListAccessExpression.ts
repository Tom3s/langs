import SymbolTable from "../ADT/SymbolTable";
import { IntegerType } from "../Types/IntegerType";
import { ListType } from "../Types/ListType";
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
		const listValue = this.list.evaluate(symbolTable);

		if (!(listValue.getType().equals(new ListType(new IntegerType())))) {
			throw new Error(`Variable ${this.list.identifier} is not a list`);
		}

		if (indexNumber < 0 || indexNumber >= listValue.body.length) {
			throw new Error(`Index ${indexNumber} out of bounds (list length: ${listValue.body.length})`);
		}

		const typedListValue: ListValue = listValue as ListValue;

		// console.log(`List access ${this.list.identifier}[${indexNumber}] = ${typedListValue.body[indexNumber].toString()}`);

		return typedListValue.body[indexNumber];
		// const returnValue = listValue.elementType.defaultValue();
		// returnValue.body = listValue.body[indexNumber];
		// return returnValue;
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
		return new ListAccessExpression(this.list.deepCopy() as VariableExpression, this.index.deepCopy());
	}
}