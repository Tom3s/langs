import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";

export interface Expression {
	evaluate(symbolTable: SymbolTable, /* heap: Heap */): Value;
	typeCheck(typeEnvironment: Map<string, Type>): Type;
	toString(): string;
	deepCopy(): Expression;
}