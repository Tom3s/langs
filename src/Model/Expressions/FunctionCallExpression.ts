import { finished } from "stream";
import SymbolTable from "../ADT/SymbolTable";
import { ProgramState } from "../ProgramState";
import { DeclarationStatement } from "../Statements/DeclarationStatement";
import { ReturnStatement } from "../Statements/ReturnStatement";
import { Statement } from "../Statements/Statement";
import { FunctionType } from "../Types/FunctionType";
import { IntegerType } from "../Types/IntegerType";
import { Type } from "../Types/Type";
import { VoidType } from "../Types/VoidType";
import { FunctionValue } from "../Values/FunctionValue";
import { Value } from "../Values/Value";
import { VoidValue } from "../Values/VoidValue";
import { Expression } from "./Expression";

export class FunctionCallExpression implements Expression {
	constructor (
		public identifier: string,
		public parameters: Expression[],
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		const scopedSymbolTable = new SymbolTable(16);

		const functionValue = symbolTable.get(this.identifier);

		if (functionValue === undefined) {
			throw new Error(`Function ${this.identifier} is not defined`);
		}
		if (!functionValue.getType().equals(new FunctionType([], new VoidType()))) {
			throw new Error(`Function ${this.identifier} is not a function`);
		}

		const typedFunctionValue: FunctionValue = functionValue as FunctionValue;

		typedFunctionValue.parameters.forEach((parameter: DeclarationStatement, index: number) => {
			const functionParameterType = parameter.type;
			const functionArgumentValue = this.parameters[index].evaluate(symbolTable);
			const functionArgumentType = functionArgumentValue.getType();
			if (!functionParameterType.equals(functionArgumentType)) {
				throw new Error(`Function ${this.identifier} takes argument ${index} of type ${functionParameterType.toString()}, but got ${functionArgumentType.toString()}`);
			} 
			scopedSymbolTable.add(parameter.name, functionArgumentValue);
		})

		symbolTable.getKeys().forEach((key: string) => {
			const value = symbolTable.get(key);
			if (value !== undefined && value.getType().equals(new FunctionType([], new VoidType()))) {
				scopedSymbolTable.add(key, value);
			}
		})

		const functionProgramState = new ProgramState([], scopedSymbolTable, [], typedFunctionValue.body);

		let topInstruction: Statement = typedFunctionValue.body.statements[functionProgramState.executionStack.length - 1];
		while (!(topInstruction instanceof ReturnStatement)) {
			try {
				functionProgramState.oneStep();
				topInstruction = functionProgramState.executionStack[functionProgramState.executionStack.length - 1];
				
				// console.log(`Top instruction: ${topInstruction.toString()}`);
				// console.log(functionProgramState.symbolTable.get('a'));
				// console.log(functionProgramState.symbolTable.get('b'));
			} catch (error: any) {
				if (error.message !== "Execution stack is empty") {
					console.log(`Error: ${error.message}`);
				}
				break;
			}
		}		
		// console.log(`Finished running function ${this.identifier} with return type ${typedFunctionValue.returnType.toString()}`); // TODO: remove this line
		// console.log(`Return statement: ${topInstruction.toString()}`) // (= ${evaluated})`); // TODO: remove this line
		if (topInstruction instanceof ReturnStatement) {
			const typedInstruction: ReturnStatement = topInstruction as ReturnStatement;
			if (typedInstruction.value) {
				const evaluated = typedInstruction.value.evaluate(scopedSymbolTable);
				if (!evaluated.getType().equals(typedFunctionValue.returnType)){
					throw new Error(`Invalid return type of ${evaluated.getType().toString()} for function ${this.identifier} with return type ${typedFunctionValue.returnType.toString()}`);
				}
				return typedInstruction.value.evaluate(scopedSymbolTable);
			} else {
				return new VoidValue();
			}
		}
		return new VoidValue();
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const functionType = typeEnvironment.get(this.identifier);
		if (functionType === undefined) {
			throw new Error(`Function ${this.identifier} is not defined`);
		}
		if (!(functionType instanceof FunctionType)) {
			throw new Error(`Function ${this.identifier} is not a function`);
		}

		const typedFunctionType: FunctionType = functionType as FunctionType;

		if (typedFunctionType.parameters.length !== this.parameters.length) {
			throw new Error(`Function ${this.identifier} takes ${typedFunctionType.parameters.length} arguments, but got ${this.parameters.length}`);
		}

		typedFunctionType.parameters.forEach((parameter: Type, index: number) => {
			const argument = this.parameters[index];
			const argumentType = argument.typeCheck(typeEnvironment);
			if (!parameter.equals(argumentType)) {
				throw new Error(`Function ${this.identifier} takes argument ${index} of type ${parameter.toString()}, but got ${argumentType.toString()}`);
			}
		})

		return typedFunctionType.returnType;
	}

	toString(): string {
		return `${this.identifier}(${this.parameters.join(", ")})`;
	}

	deepCopy(): Expression {
		return new FunctionCallExpression(this.identifier, this.parameters.map(argument => argument.deepCopy()));
	}
}