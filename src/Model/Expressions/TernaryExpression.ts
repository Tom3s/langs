import SymbolTable from "../ADT/SymbolTable";
import { BooleanType } from "../Types/BooleanType";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export class TernaryExpression implements Expression {
	constructor(
		public condition: Expression,
		public ifTrue: Expression,
		public ifFalse: Expression,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const conditionValue = this.condition.evaluate(symbolTable);
		if (conditionValue.body === true) {
			return this.ifTrue.evaluate(symbolTable);
		} else {
			return this.ifFalse.evaluate(symbolTable);
		}
	}
	
	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const conditionType = this.condition.typeCheck(typeEnvironment);
		if (!conditionType.equals(new BooleanType())) {
			throw new Error(`Condition ${this.condition.toString()} is not a boolean`);
		}

		const ifTrueType = this.ifTrue.typeCheck(typeEnvironment);
		const ifFalseType = this.ifFalse.typeCheck(typeEnvironment);
		if (!ifTrueType.equals(ifFalseType)) {
			throw new Error(`If true type ${ifTrueType.toString()} does not match if false type ${ifFalseType.toString()}`);
		}

		return ifTrueType;
	}

	deepCopy(): Expression {
		return new TernaryExpression(
			this.condition.deepCopy(),
			this.ifTrue.deepCopy(),
			this.ifFalse.deepCopy(),
		);
	}

	toString(): string {
		return `${this.condition.toString()} ? ${this.ifTrue.toString()} : ${this.ifFalse.toString()}`;
	}

}