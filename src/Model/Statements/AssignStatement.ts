import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class AssignStatement implements Statement {
	constructor (
		public identifier: string,
		public expression: Expression,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;

		if (!symbolTable.has(this.identifier)) {
			throw new Error(`Variable ${this.identifier} not declared`);
		}

		const value = this.expression.evaluate(symbolTable);
		const variableType = symbolTable.get(this.identifier)?.getType();
		if (variableType && !variableType.equals(value.getType())) {
			throw new Error(`Cannot assign value of type ${value.getType()} to variable of type ${variableType}`);
		}
		// console.log(`Assigning ${this.identifier} = ${this.expression.toString()} (${value.toString()})`);
		symbolTable.set(this.identifier, value);
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		const variableType = typeEnvironment.get(this.identifier);
		if (variableType === undefined) {
			throw new Error(`Variable ${this.identifier} not declared`);
		}

		const expressionType = this.expression.typeCheck(typeEnvironment);
		if (!expressionType.equals(variableType)) {
			throw new Error(`Cannot assign value of type ${expressionType} to variable of type ${variableType.toString()}`);
		}

		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new AssignStatement(this.identifier, this.expression.deepCopy());
	}

	toString(): string {
		return `${this.identifier} = ${this.expression.toString()}\n`;
	}
}