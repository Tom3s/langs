import SymbolTable from "../ADT/SymbolTable";
import { FloatType } from "../Types/FloatType";
import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { FloatValue } from "../Values/FloatValue";
import { IntegerValue } from "../Values/IntegerValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export enum ArithmeticOperator {
	ADD = "+",
	SUBTRACT = "-",
	MULTIPLY = "*",
	DIVIDE = "/",
	MODULO = "%",
	POWER = "^",
}

export class ArithmeticExpression implements Expression {
	constructor(
		public left: Expression,
		public right: Expression,
		public operator: ArithmeticOperator,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const leftValue: Value = this.left.evaluate(symbolTable);
		if (
			!leftValue.getType().equals(new IntegerType()) &&
			!leftValue.getType().equals(new FloatType())
		) {
			throw new Error(`Left operand ${this.left.toString()} must be a number.`); // TODO: Make this error message more specific
		}

		const rightValue: Value = this.right.evaluate(symbolTable);
		if (
			!rightValue.getType().equals(new IntegerType()) &&
			!rightValue.getType().equals(new FloatType())
		) {
			throw new Error(`Right operand ${this.left.toString()} must be a number.`); // TODO: Make this error message more specific
		}

		const leftNumber: number = leftValue.body;
		const rightNumber: number = rightValue.body;

		switch (this.operator) {
			case ArithmeticOperator.ADD:
				return this.overtakenTypedEvaluate(leftNumber + rightNumber, leftValue.getType(), rightValue.getType());
			case ArithmeticOperator.SUBTRACT:
				return this.overtakenTypedEvaluate(leftNumber - rightNumber, leftValue.getType(), rightValue.getType());
			case ArithmeticOperator.MULTIPLY:
				return this.overtakenTypedEvaluate(leftNumber * rightNumber, leftValue.getType(), rightValue.getType());
			case ArithmeticOperator.DIVIDE:
				if (rightNumber === 0) {
					throw new Error("Cannot divide by zero.");
				}
				return this.overtakenTypedEvaluate(leftNumber / rightNumber, leftValue.getType(), rightValue.getType());
			case ArithmeticOperator.MODULO:
				return this.overtakenTypedEvaluate(leftNumber % rightNumber, leftValue.getType(), rightValue.getType());
			case ArithmeticOperator.POWER:
				return this.overtakenTypedEvaluate(Math.pow(leftNumber, rightNumber), leftValue.getType(), rightValue.getType());
			default:
				throw new Error("Invalid arithmetic operator.");

		}
	}

	// private typedEvaluate(finalValue: number, type: Type): Value {
	// 	if (type.equals(new IntegerType())) {
	// 		return new IntegerValue(finalValue);
	// 	} else if (type.equals(new FloatType())) {
	// 		return new FloatValue(finalValue);
	// 	} else {
	// 		throw new Error("Unknown type.");
	// 	}
	// }

	private overtakenTypedEvaluate(finalValue: number, leftType: Type, rightType: Type): Value {
		if (leftType.equals(new FloatType()) || rightType.equals(new FloatType())) {
			return new FloatValue(finalValue);
		} else {
			return new IntegerValue(finalValue);
		}
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		var leftType: Type = this.left.typeCheck(typeEnvironment);
		if (
			!leftType.equals(new IntegerType()) ||
			!leftType.equals(new FloatType())
		) {
			throw new Error("Left operand must be a number.")
		}

		var rightType: Type = this.right.typeCheck(typeEnvironment);
		if (
			!rightType.equals(new IntegerType()) ||
			!rightType.equals(new FloatType())
		) {
			throw new Error("Right operand must be a number.");
		}

		if (
			this.operator == ArithmeticOperator.MULTIPLY ||
			this.operator == ArithmeticOperator.DIVIDE ||
			this.operator == ArithmeticOperator.POWER
		) {
			return this.overtakenTypedEvaluate(0, leftType, rightType).getType();
		}
		return leftType;
	}

	toString(): string {
		return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
	}

	deepCopy(): Expression {
		return new ArithmeticExpression(
			this.left.deepCopy(),
			this.right.deepCopy(),
			this.operator,
		);
	}
}