import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { VoidType } from "../Types/VoidType";
import { Value } from "../Values/Value";
import { VoidValue } from "../Values/VoidValue";
import { Expression } from "./Expression";

export class NOPExpression implements Expression {
	evaluate(symbolTable: SymbolTable): Value {
		return new VoidValue();
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		return new VoidType();
	}

	toString(): string {
		return '';
	}

	deepCopy(): Expression {
		return new NOPExpression();
	}
}