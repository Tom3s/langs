import SymbolTable from "../ADT/SymbolTable";
import { BooleanType } from "../Types/BooleanType";
import { FloatType } from "../Types/FloatType";
import { IntegerType } from "../Types/IntegerType";
import { StringType } from "../Types/StringType";
import { Type } from "../Types/Type";
import { BooleanValue } from "../Values/BooleanValue";
import { FloatValue } from "../Values/FloatValue";
import { IntegerValue } from "../Values/IntegerValue";
import { StringValue } from "../Values/StringValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export class ConversionExpression implements Expression {
	constructor(
		public expression: Expression,
		public toType: Type,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const stringValue = this.expression.evaluate(symbolTable).body.toString();
		if (this.toType.equals(new BooleanType())) {
			return new BooleanValue(!!stringValue);
		} else if (this.toType.equals(new StringType())) {
			return new StringValue(stringValue);
		} else if (this.toType.equals(new FloatType())) {
			return new FloatValue(parseFloat(stringValue));
		} else if (this.toType.equals(new IntegerType())) {
			return new IntegerValue(parseInt(stringValue));
		} else {
			throw new Error(`Cannot convert ${this.expression} to ${this.toType}.`);
		}
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		this.expression.typeCheck(typeEnvironment);
		return this.toType;
	}

	deepCopy(): Expression {
		return new ConversionExpression(
			this.expression.deepCopy(),
			this.toType,
		);
	}

	toString(): string {
		throw new Error("Method not implemented.");
		return `(${this.toType}) ${this.expression.toString()}`;
	}
}