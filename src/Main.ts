import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import SymbolTable from "./Model/ADT/SymbolTable";

const lexer = new Lexer('../lab1/p2.whatever');
const tokens = lexer.tokenize();
const parser = new Parser(tokens);

try {
    parser.parse();
    console.log('Syntax is correct!');
} catch (error: any) {
    console.error('Syntax error:', error?.message);
}