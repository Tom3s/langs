import json
import pathlib


class FiniteAutomaton:
	def __init__(self):
		self.states = []
		self.alphabet = []
		self.transitions = {}
		self.initial_state = None
		self.final_states = []

	def read_from_file(self, filename):

		full_path = pathlib.Path(filename).resolve()

		json_file = open(full_path, "r")
		json_data = json.load(json_file)
		json_file.close()

		self.states = json_data["states"]
		self.alphabet = json_data["alphabet"]
		self.transitions = json_data["transitions"]
		self.initial_state = json_data["initial_state"]
		self.final_states = json_data["final_states"]

	def display_menu(self):
		print("1. Display states")
		print("2. Display alphabet")
		print("3. Display transitions")
		print("4. Display initial state")
		print("5. Display final states")
		print("6. Check sequence")
		print("7. Exit")
  
		input_str = input(">>> ")
  
		if input_str.isdigit():
			return int(input_str)
		else:
			return -1 		
   
	def display_states(self):
		print("States: ", self.states)

	def display_alphabet(self):
		print("Alphabet: ", self.alphabet)

	def display_transitions(self):
		for state in self.transitions:
			for symbol in self.transitions[state]:
				print(state, " - ", symbol, " -> ", self.transitions[state][symbol])

	def display_initial_state(self):
		print("Initial state: ", self.initial_state)

	def display_final_states(self):
		print("Final states: ", self.final_states)

	def is_sequence_accepted(self, sequence):
		current_state = self.initial_state
		for symbol in sequence:
			if self.is_symbol_in_alphabet(symbol) == False:
				print("Symbol", symbol, "is not in the alphabet")
				return False
			if symbol in self.transitions[current_state]:
				current_state = self.transitions[current_state][symbol]
			else:
				print("No transition for state", current_state, "and symbol", symbol)
				return False
		if current_state in self.final_states:
			return True
		else:
			print("Reached state with symbols ", ' '.join(sequence.split()), "is not a final state")
			return False

	def is_symbol_in_alphabet(self, symbol):
		return symbol in self.alphabet

def main():
	# Create an instance of FiniteAutomaton
	fa = FiniteAutomaton()

	# Read FA elements from a file
	fa.read_from_file("./lab5/fa.in.json")

	while True:
		# Display menu and get user choice
		choice = fa.display_menu()

		# Perform actions based on user choice
		if choice == 1:
			fa.display_states()
		elif choice == 2:
			fa.display_alphabet()
		elif choice == 3:
			fa.display_transitions()
		elif choice == 4:
			fa.display_initial_state()
		elif choice == 5:
			fa.display_final_states()
		elif choice == 6:
			if True: #isinstance(fa, DFA):  # Check if it's a DFA
				sequence = input("Enter the sequence to check: ")
				if fa.is_sequence_accepted(sequence):
					print("Sequence is accepted by the DFA") 
				else:
					print("Sequence is not accepted by the DFA")
		elif choice == 7:
			break
		else:
			print("Invalid choice.")

if __name__ == "__main__":
	main()
