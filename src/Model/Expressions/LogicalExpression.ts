import SymbolTable from "../ADT/SymbolTable";
import { BooleanType } from "../Types/BooleanType";
import { Type } from "../Types/Type";
import { BooleanValue } from "../Values/BooleanValue";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export enum LogicalOperator {
	AND = "&&",
	OR = "||",
	NOT = "!",
}

export class LogicalExpression implements Expression {
	constructor(
		public left: Expression | null,
		public right: Expression,
		public operator: LogicalOperator,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const leftValue: Value | null = this.left ? this.left.evaluate(symbolTable) : null;
		if (leftValue && !leftValue.getType().equals(new BooleanType())) {
			throw new Error("Left operand must be a boolean if it exists.");
		}

		const rightValue: Value = this.right.evaluate(symbolTable);
		if (!rightValue.getType().equals(new BooleanType())) {
			throw new Error("Right operand must be a boolean.");
		}

		const leftBoolean: boolean = leftValue ? leftValue.body : false;
		const rightBoolean: boolean = rightValue.body;

		switch (this.operator) {
			case LogicalOperator.AND:
				return new BooleanValue(leftBoolean && rightBoolean);
			case LogicalOperator.OR:
				return new BooleanValue(leftBoolean || rightBoolean);
			case LogicalOperator.NOT:
				if (leftValue)
					throw new Error("The not (!) operator must be used with only one operand.");
				return new BooleanValue(!rightBoolean);
			default:
				throw new Error("Invalid logical operator.");
		}
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const leftType: Type | null = this.left ? this.left.typeCheck(typeEnvironment) : null;
		if (leftType && !leftType.equals(new BooleanType())) {
			throw new Error("Left operand must be a boolean if it exists.");
		}
		
		const rightType: Type = this.right.typeCheck(typeEnvironment);
		if (!rightType.equals(new BooleanType())) {
			throw new Error("Right operand must be a boolean.");
		}

		return new BooleanType();
	}

	toString(): string {
		const ret: string = this.left ? this.left.toString() + " " : "";
		return ret + this.operator + (this.operator === LogicalOperator.NOT ? "" : " ") + this.right.toString();
	}

	deepCopy(): Expression {
		return new LogicalExpression(
			this.left ? this.left.deepCopy() : null,
			this.right.deepCopy(),
			this.operator,
		);
	}
}