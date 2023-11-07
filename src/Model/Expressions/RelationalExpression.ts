import SymbolTable from "../ADT/SymbolTable";
import { BooleanType } from "../Types/BooleanType";
import { FloatType } from "../Types/FloatType";
import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { BooleanValue } from "../Values/BooleanValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export enum RelationalOperator {
	EQUAL = "==",
	NOT_EQUAL = "!=",
	LESS_THAN = "<",
	LESS_THAN_OR_EQUAL = "<=",
	GREATER_THAN = ">",
	GREATER_THAN_OR_EQUAL = ">=",
}

export class RelationalExpression implements Expression {
	constructor(
		public left: Expression,
		public right: Expression,
		public operator: RelationalOperator,
	) { }
	
	evaluate(symbolTable: SymbolTable): Value {
		const leftValue: Value = this.left.evaluate(symbolTable);
		const rightValue: Value = this.right.evaluate(symbolTable);
		
		if (this.operator === RelationalOperator.EQUAL || this.operator === RelationalOperator.NOT_EQUAL) {
			const twoOperandsAreEqual: boolean = leftValue.equals(rightValue);
			if (this.operator === RelationalOperator.EQUAL) {
				return new BooleanValue(twoOperandsAreEqual);
			} else {
				return new BooleanValue(!twoOperandsAreEqual);
			}
		}

		if (
			!leftValue.getType().equals(new IntegerType()) &&
			!leftValue.getType().equals(new FloatType())
		) {
			throw new Error(`Left operand of type ${leftValue.getType()} cannot be used in a relational expression of type ${this.operator}.`);
		}

		if (
			!rightValue.getType().equals(new IntegerType()) &&
			!rightValue.getType().equals(new FloatType())
		) {
			throw new Error(`Right operand of type ${rightValue.getType()} cannot be used in a relational expression of type ${this.operator}.`);
		}

		const leftNumber: number = leftValue.body;
		const rightNumber: number = rightValue.body;

		switch (this.operator) {
			case RelationalOperator.LESS_THAN:
				return new BooleanValue(leftNumber < rightNumber);
			case RelationalOperator.LESS_THAN_OR_EQUAL:
				return new BooleanValue(leftNumber <= rightNumber);
			case RelationalOperator.GREATER_THAN:
				return new BooleanValue(leftNumber > rightNumber);
			case RelationalOperator.GREATER_THAN_OR_EQUAL:
				return new BooleanValue(leftNumber >= rightNumber);
			default:
				throw new Error("Invalid relational operator.");
		}
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const leftType: Type = this.left.typeCheck(typeEnvironment);
		
		if (
			!leftType.equals(new IntegerType()) &&
			!leftType.equals(new FloatType())
			) {
			throw new Error(`Left operand of type ${leftType} cannot be used in a relational expression of type ${this.operator}.`);
		}
		
		const rightType: Type = this.right.typeCheck(typeEnvironment);
		if (
			!rightType.equals(new IntegerType()) &&
			!rightType.equals(new FloatType())
		) {
			throw new Error(`Right operand of type ${rightType} cannot be used in a relational expression of type ${this.operator}.`);
		}

		return new BooleanType();
	}

	toString(): string {
		return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
	}

	deepCopy(): Expression {
		return new RelationalExpression(
			this.left.deepCopy(),
			this.right.deepCopy(),
			this.operator,
		);
	}
}