import { ArithmeticExpression, ArithmeticOperator } from "../Expressions/ArithmeticExpression";
import { ListAccessExpression } from "../Expressions/ListAccessExpression";
import { NOPExpression } from "../Expressions/NOPExpression";
import { RelationalExpression, RelationalOperator } from "../Expressions/RelationalExpression";
import { ValueExpression } from "../Expressions/ValueExpression";
import { VariableExpression } from "../Expressions/VariableExpression";
import { ProgramState } from "../ProgramState";
import { IntegerType } from "../Types/IntegerType";
import { ListType } from "../Types/ListType";
import { Type } from "../Types/Type";
import { IntegerValue } from "../Values/IntegerValue";
import { ListValue } from "../Values/ListValue";
import { AssignStatement } from "./AssignStatement";
import { CompoundStatement } from "./CompoundStatement";
import { DeclarationStatement } from "./DeclarationStatement";
import { FreeStatement } from "./FreeStatement";
import { NOPStatement } from "./NOPStatement";
import { Statement } from "./Statement";
import { WhileStatement } from "./WhileStatement";

export class ForInStatement implements Statement {
	// static readonly ITERATOR = "iteratorHopefullyNotUsedHSG_H_SDRSD__87687_6a8GD_ASD_876__8768";
	static iteratorIndex: number = 0;
	private iteratorName: string;

	constructor (
		public iterator: string,
		public iterable: string,
		public body: Statement,
	) { 
		this.iteratorName = `iteratorHopefullyNotUsedHSG_H_SDRSD__87687_6a8GD_ASD_876__8768_${ForInStatement.iteratorIndex++}`;
	}

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;
		if (symbolTable.has(this.iterator)) {
			throw new Error(`Variable ${this.iterator} already declared`);
		}

		// if (!symbolTable.has(this.iterable)) {
		// 	throw new Error(`Iterable ${this.iterable} not declared`);
		// }

		const iterableValue = symbolTable.get(this.iterable);
		if (iterableValue === undefined) {
			throw new Error(`Iterable ${this.iterable} not declared`);
		}

		if (
			!iterableValue.getType().equals(new IntegerType()) &&
			!iterableValue.getType().equals(new ListType(new IntegerType()))
		) {
			throw new Error(`Variable ${this.iterable} is not iterable`);
		}

		let iterableList: ListValue;
		if (iterableValue.getType().equals(new IntegerType())) {
			iterableList = new ListValue(
				new IntegerType(),
				[...Array(iterableValue.body).keys()].map((value) => new IntegerValue(value))
			)
			this.iterable = this.iteratorName + '_list'
		} else {
			iterableList = iterableValue as ListValue;
		}

		// console.log(iterableList.toString());

		var whileStatement = new CompoundStatement([
			this.iterable.startsWith('iteratorHopefullyNotUsedHSG_H_SDRSD__87687_6a8GD_ASD_876__8768_') ?
			new DeclarationStatement(
				this.iterable,
				new ListType(iterableList.elementType),
				false,
				new ValueExpression(
					iterableList
				)
			) : new NOPStatement(),
			new DeclarationStatement(this.iteratorName, new IntegerType(), false, new ValueExpression(new IntegerValue(0))),
			new DeclarationStatement(
				this.iterator, 
				iterableList.elementType
			), 
			// new DeclarationStatement(this.iteratorName + String(ForInStatement.iteratorIndex), iterableList.elementType),
			// new AssignStatement(this.iteratorName, new ValueExpression(new IntegerValue(0))),
			// new AssignStatement(this.iterator, new ListAccessExpression(new VariableExpression(this.iterable), new VariableExpression(this.iteratorName))),
			new WhileStatement(
				new RelationalExpression(
					new VariableExpression(this.iteratorName), 
					new ValueExpression(
						new IntegerValue(iterableList.body.length)
					),
					RelationalOperator.LESS_THAN
				),
				new CompoundStatement([
					new AssignStatement(
						this.iterator,
						new ListAccessExpression(new VariableExpression(this.iterable), new VariableExpression(this.iteratorName))
					),
					this.body,
					new AssignStatement(
						this.iteratorName,
						new ArithmeticExpression(
							new VariableExpression(this.iteratorName),
							new ValueExpression(new IntegerValue(1)),
							ArithmeticOperator.ADD
						)
					),
				])
			),
			new FreeStatement(this.iteratorName),
			new FreeStatement(this.iterator),
			this.iterable.startsWith('iteratorHopefullyNotUsedHSG_H_SDRSD__87687_6a8GD_ASD_876__8768_') ?
			new FreeStatement(this.iterable) : new NOPStatement(),
		]);

		programState.executionStack.push(whileStatement);

		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		const iterableType = typeEnvironment.get(this.iterable);
		if (iterableType === undefined) {
			throw new Error(`Iterable ${this.iterable} not declared`);
		}

		if (
			!iterableType.equals(new IntegerType()) ||
			!iterableType.equals(new ListType(new IntegerType()))
		) {
			throw new Error(`Variable ${this.iterable} is not iterable`);
		}

		typeEnvironment.set(this.iterator, iterableType);

		this.body.typeCheck(typeEnvironment);

		typeEnvironment.delete(this.iterator);

		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new ForInStatement(this.iterator, this.iterable, this.body.deepCopy());
	
	}

	toString(): string {
		return `for ${this.iterator} in ${this.iterable} {\n${this.body.toString()}\n}\n`;
	}
}