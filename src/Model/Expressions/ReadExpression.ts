import SymbolTable from "../ADT/SymbolTable";
import { StringType } from "../Types/StringType";
import { Type } from "../Types/Type";
import { StringValue } from "../Values/StringValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";


export class ReadExpression implements Expression {
	evaluate(symbolTable: SymbolTable): Value {
		console.log("===============READING INPUT===============")

		const prompt = require('prompt-sync')();

		const ret = prompt('');
		// console.log(`Hey there ${name}`);
		return new StringValue(ret);
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		return new StringType();
	}

	deepCopy(): Expression {
		return new ReadExpression();
	}

	toString(): string {
		return "read()";
	}
} 