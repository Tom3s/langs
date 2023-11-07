import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { VoidType } from "../Types/VoidType";
import { CompoundStatement } from "./CompoundStatement";
import { Statement } from "./Statement";

export class FunctionBodyStatement implements Statement {
	constructor (
		public returnType: Type,
		public statements: Statement[],
	) {
		if (this.statements.length === 0 && !(returnType instanceof VoidType)) {
			throw new Error("Function body must have at least one statement if return type is non-void.");
		}
	}

	execute(programState: ProgramState): ProgramState | null {
		programState.executionStack.push(...this.statements.reverse());
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		// return this.statements.reduce((typeEnvironment, statement) => statement.typeCheck(typeEnvironment), typeEnvironment);
		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new CompoundStatement(this.statements.map(statement => statement.deepCopy()));
	}

	toString(): string {
		return "{\n" + this.statements.map(statement => statement.toString()).join("\n") + "}\n";
	}
}