import { VariableExpression } from "../Expressions/VariableExpression";
import { ProgramState } from "../ProgramState";
import { FunctionType } from "../Types/FunctionType";
import { Type } from "../Types/Type";
import { FunctionValue } from "../Values/FunctionValue";
import { CompoundStatement } from "./CompoundStatement";
import { DeclarationStatement } from "./DeclarationStatement";
import { Statement } from "./Statement";

export class FunctionDeclarationStatement implements Statement {
	constructor(
		public name: string,
		public parameters: DeclarationStatement[],
		public returnType: Type,
		public body: CompoundStatement,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;

		if (symbolTable.has(this.name)) {
			throw new Error(`Function ${this.name} already declared`);
		}

		symbolTable.set(
			this.name,
			new FunctionValue(
				this.returnType,
				this.parameters.map(parameter => new DeclarationStatement(parameter.name, parameter.type)),
				this.body
			)
		);


		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		typeEnvironment.set(this.name, new FunctionType([], this.returnType));
		return typeEnvironment;
	}

	toString(): string {
		return `func ${this.name}(${this.parameters.map(parameter => parameter.toString()).join(", ")}) -> ${this.returnType.toString()} ${this.body.toString()}`;
	}

	deepCopy(): Statement {
		return new FunctionDeclarationStatement(
			this.name,
			this.parameters.map(parameter => parameter.deepCopy() as DeclarationStatement),
			this.returnType.deepCopy(),
			this.body.deepCopy() as CompoundStatement
		);
	}
}