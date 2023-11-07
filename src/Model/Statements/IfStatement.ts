import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { BooleanType } from "../Types/BooleanType";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class IfStatement implements Statement {
	constructor (
		public condition: Expression,
		public trueBranch: Statement,
		public falseBranch: Statement | null = null,
	) { }
	
	execute(programState: ProgramState): ProgramState | null {
		const conditionValue = this.condition.evaluate(programState.symbolTable);

		if (!conditionValue.getType().equals(new BooleanType())) {
			throw new Error(`Condition ${this.condition.toString()} is not a boolean`);
		}

		if (conditionValue) {
			programState.executionStack.push(this.trueBranch);
		} else if (this.falseBranch !== null) {
			programState.executionStack.push(this.falseBranch);
		}

		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		const conditionType = this.condition.typeCheck(typeEnvironment);
		if (!conditionType.equals(new BooleanType())) {
			throw new Error(`Condition ${this.condition.toString()} is not a boolean`);
		}

		this.trueBranch.typeCheck(typeEnvironment);
		if (this.falseBranch !== null) {
			this.falseBranch.typeCheck(typeEnvironment);
		}

		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new IfStatement(this.condition.deepCopy(), this.trueBranch.deepCopy(), this.falseBranch?.deepCopy());
	}

	toString(): string {
		let ret = `if ${this.condition.toString()} {\n`;
		ret += this.trueBranch.toString();
		ret += "\n}";
		if (this.falseBranch !== null) {
			ret += " else {\n";
			ret += this.falseBranch.toString();
			ret += "\n}";
		}

		return ret + "\n";
	}

}