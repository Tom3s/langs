import unittest
from Grammar import Grammar
from Item import Item
from LR import LR
from CanonicalCollection import CanonicalCollection
from State import State

class TestGrammar(unittest.TestCase):
	def setUp(self):
		self.g1 = Grammar(inFile = r".\g1_2.txt")
		self.g2 = Grammar(inFile = r".\g2.txt")
		self.lr1 = LR(self.g1)
		self.lr2 = LR(self.g2)

	def test_closure(self):
		# Assuming you have a method to get the first item for closure
		item1 = Item(self.g1.getStartingSymbol(), self.g1.getProductionsForNonTerminal(self.g1.getStartingSymbol())[0], 0)
		item2 = Item(self.g2.getStartingSymbol(), self.g2.getProductionsForNonTerminal(self.g2.getStartingSymbol())[0], 0)

		closure1 = self.lr1.closure(item1)
		closure2 = self.lr2.closure(item2)

		# "S -> .a A"
		expected_closure1 = State(set([Item('S', ['a', 'A'], 0)]))
		# "program -> .start compound_statement"
		expected_closure2 = State(set([Item('program', ['start', 'compound_statement'], 0)]))


		# Validate the closures here. You need to know the expected results to assert them.
		self.assertEqual(closure1, expected_closure1)
		self.assertEqual(closure2, expected_closure2)

	def test_canonicalCollection(self):
		# cc1 = self.lr1.canonicalCollection()
		cc1 = LR(Grammar(inFile = r".\g1_2.txt")).canonicalCollection()

		expected_cc1 = CanonicalCollection()
		expected_cc1.addState(
      		State(
				set([
					Item('S0', ['S'], 0),
					Item('S', ['a', 'A'], 0)
				])
			)
		)
		expected_cc1.addState(
	  		State(
				set([
					Item('S', ['a', 'A'], 1),
					Item('A', ['b', 'A'], 0),
					Item('A', ['c'], 0)
				])
			)
		)
		expected_cc1.addState(
	  		State(
				set([
					Item('S0', ['S'], 1)
				])
			)
		)
		expected_cc1.addState(
	  		State(
				set([
					Item('A', ['c'], 0),
					Item('A', ['b', 'A'], 1),
					Item('A', ['b', 'A'], 0)
				])
			)
		)
		expected_cc1.addState(
	  		State(
				set([
					Item('A', ['c'], 1)
				])
			)
		)

		# Validate the canonical collections here. You need to know the expected results to assert them.
		self.assertEqual(cc1, expected_cc1)

	def test_goto(self):
		# Assuming you have a method to get the first state for goto
		state1 = LR(Grammar(inFile = r".\g1_2.txt")).canonicalCollection().getStates()[0]
		state2 = LR(Grammar(inFile = r".\g2.txt")).canonicalCollection().getStates()[0]

		# Assuming 'program' is a valid symbol for goto
		goto1 = self.lr1.goto(state1, 'S')
		goto2 = self.lr2.goto(state2, 'program')

		# "S0 -> S."
		expected_goto1 = State(set([Item('S0', ['S'], 1)]))
		# "S0 -> program."
		expected_goto2 = State(set([Item('S0', ['program'], 1)]))

		# Validate the goto results here. You need to know the expected results to assert them.
		self.assertEqual(goto1, expected_goto1)
		self.assertEqual(goto2, expected_goto2)

if __name__ == '__main__':
	unittest.main()