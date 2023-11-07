import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { BooleanType } from "../Types/BooleanType";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class WhileStatement implements Statement {
	constructor (
		public condition: Expression,
		public body: Statement,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;
		var evaluatedCondition = this.condition.evaluate(symbolTable);
		if (!evaluatedCondition.getType().equals(new BooleanType())) {
			throw new Error(`Condition ${this.condition.toString()} is not a boolean (got ${evaluatedCondition.getType()})`);
		}

		var conditionValue = evaluatedCondition.body;

		if (conditionValue === true) {
			programState.executionStack.push(this);
			programState.executionStack.push(this.body);
		}

		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		const conditionType = this.condition.typeCheck(typeEnvironment);
		if (!conditionType.equals(new BooleanType())) {
			throw new Error(`Condition ${this.condition.toString()} is not a boolean`);
		}

		return this.body.typeCheck(typeEnvironment);
	}

	deepCopy(): Statement {
		return new WhileStatement(this.condition.deepCopy(), this.body.deepCopy());
	}

	toString(): string {
		return `while ${this.condition.toString()} {\n\t${this.body.toString()}\n}\n`;
	}
}