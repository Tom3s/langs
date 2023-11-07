import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class CompoundStatement implements Statement {
	constructor (
		public statements: Statement[],
	) {
		if (this.statements.length === 0) {
			throw new Error("Cannot create empty compound statement.");
		}
	}

	execute(programState: ProgramState): ProgramState | null {
		programState.executionStack.push(...this.statements.reverse());
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		return this.statements.reduce((typeEnvironment, statement) => statement.typeCheck(typeEnvironment), typeEnvironment);
	}

	deepCopy(): Statement {
		return new CompoundStatement(this.statements.map(statement => statement.deepCopy()));
	}

	toString(): string {
		return "{\n" + this.statements.map(statement => statement.toString()).join("\n") + "}\n";
	}
}