import json
import random


class Grammar:
	def __init__(self):
		self.nonterminals = set()
		self.terminals = set()
		self.productions = []
		self.start_symbol = None

	def read_grammar_from_file(self, file_path):
		with open(file_path, 'r') as file:
			for line in file:
				line = line.strip()
				if not line or line.startswith('#'):
					# Skip empty lines and comments
					continue
				self.process_grammar_line(line)

	def process_grammar_line(self, line):
		parts = line.split('::=')
		if len(parts) != 2:
			raise ValueError(f"Invalid production rule: {line}")

		partial_productions = parts[1].split(' | ')
  
		for production in partial_productions:
			left_side = parts[0].strip()
			right_side = production.strip()

			# Add nonterminal to set of nonterminals
			self.nonterminals.add(left_side)

			# Split right-hand side into individual symbols
			symbols = right_side.split()

			# Add symbols to set of terminals or nonterminals
			for symbol in symbols:
				if self.is_terminal(symbol):
					if symbol.startswith('"') and symbol.endswith('"'):
						symbol = symbol[1:-1] 
					self.terminals.add(symbol)

			# Add production to list of productions
			self.productions.append((left_side, symbols))

		# Set the start symbol if not set yet
		if self.start_symbol is None:
			self.start_symbol = left_side

	def is_terminal(self, symbol: str) -> bool:
		if symbol.isupper():
			return True
		if symbol.startswith('"') and symbol.endswith('"'):
			return True
		return False

	def print_nonterminals(self):
		print("Nonterminals:", 
			json.dumps(list(self.nonterminals), indent=4, sort_keys=True)
        )

	def print_terminals(self):
		print("Terminals:", 
			json.dumps(list(self.terminals), indent=4, sort_keys=True)
		)

	def print_productions(self):
		print("Productions:")
		for production in self.productions:
			print(f"{production[0]} -> {' '.join(production[1])}")

	def productions_for_nonterminal(self, nonterminal):
		matching_productions = [prod[1] for prod in self.productions if prod[0] == nonterminal]
		return matching_productions

	def is_cfg(self):
		for nonterminal in self.nonterminals:
			for nonterminal2 in self.nonterminals:
				if nonterminal == nonterminal2:
					continue
				if self.productions_match(nonterminal, nonterminal2):
					return False
		else:
			return True

	def productions_match(self, noterminal1: str, nonterminal2: str) -> bool:
		productions1 = self.productions_for_nonterminal(noterminal1)
		productions2 = self.productions_for_nonterminal(nonterminal2)
  
		if len(productions1) != len(productions2):
			return False
		for production in productions1:
			if production not in productions2:
				return False
		return True

# Example Usage:
grammar = Grammar()

file = input("1. g1.txt (smaller)\n2. g2.txt (custom mini-language syntax)\n>>> ")

if file == "1":
	grammar.read_grammar_from_file('lab6/g1.txt')
elif file == "2":
	grammar.read_grammar_from_file('lab6/g2.txt')
else:
    print("Invalid input")
    exit()

grammar.print_nonterminals()
grammar.print_terminals()
grammar.print_productions()

# nonterminal = random.choice(list(grammar.nonterminals))

nonterminal = input("See productions for: ")

print(f"Productions for {nonterminal}: {grammar.productions_for_nonterminal(nonterminal)}")

if grammar.is_cfg():
	print("The grammar is a context-free grammar (CFG).")
else:
	print("The grammar is not a context-free grammar (CFG).")
