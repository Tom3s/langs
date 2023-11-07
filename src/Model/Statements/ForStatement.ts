import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { BooleanType } from "../Types/BooleanType";
import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { AssignStatement } from "./AssignStatement";
import { CompoundStatement } from "./CompoundStatement";
import { DeclarationStatement } from "./DeclarationStatement";
import { FreeStatement } from "./FreeStatement";
import { Statement } from "./Statement";
import { WhileStatement } from "./WhileStatement";

export class ForStatement implements Statement {
	constructor(
		public iterator: string,
		public initialValue: Expression,
		public continueCondition: Expression,
		public postLoopStatement: Statement,
		public body: Statement,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;
		if (symbolTable.has(this.iterator)) {
			throw new Error(`Variable ${this.iterator} already declared`);
		}

		// const iteratorValue = this.initialValue.evaluate(symbolTable);

		var whileStatement = new CompoundStatement([
			new DeclarationStatement(this.iterator, new IntegerType(), false, this.initialValue),
			// new AssignStatement(this.iterator, this.initialValue),
			new WhileStatement(this.continueCondition, new CompoundStatement([
				this.body,
				this.postLoopStatement,
			])),
			new FreeStatement(this.iterator)
		]);

		programState.executionStack.push(whileStatement);

		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		const initialValueType = this.initialValue.typeCheck(typeEnvironment);
		if (!initialValueType.equals(new IntegerType())) {
			throw new Error(`Iterator value ${this.initialValue.toString()} is not an integer`);
		}

		typeEnvironment.set(this.iterator, new IntegerType());

		const continueConditionType = this.continueCondition.typeCheck(typeEnvironment);
		if (!continueConditionType.equals(new BooleanType())) {
			throw new Error(`Continue condition ${this.continueCondition.toString()} is not a boolean`);
		}

		this.postLoopStatement.typeCheck(typeEnvironment);
		this.body.typeCheck(typeEnvironment);

		typeEnvironment.delete(this.iterator);

		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new ForStatement(this.iterator, this.initialValue.deepCopy(), this.continueCondition.deepCopy(), this.postLoopStatement.deepCopy(), this.body.deepCopy());
	}

	toString(): string {
		return `for (var ${this.iterator}: int = ${this.initialValue.toString()}) (${this.continueCondition.toString()}) (${this.postLoopStatement.toString()}) {\n${this.body.toString()}\n}\n`;
	}

}