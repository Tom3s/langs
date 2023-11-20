# FA Documentation

## FiniteAutomaton Class

The FiniteAutomaton class represents a Finite Automaton and includes the following attributes:

- `states`: A list of possible states
- `alphabet`: A list of input symbols in the FA's alphabet.
- `transitions`: A dictionary representing state transitions based on input symbols.
- `initial_state`: The initial state of the FA.
- `final_states`: A list of final states indicating acceptance.

- `is_sequence_accepted(self, sequence)` method:
> ```python
> current_state = self.initial_state
> 	for symbol in sequence:
> 		if symbol in self.transitions[current_state]:
> 			current_state = self.transitions[current_state][symbol]
> 		else:
> 			return False
> 	if current_state in self.final_states:
> 		return True
> 	else:
> 		return False
> ```
> This method takes a sequence of symbols as input and returns True if the sequence is accepted by the FA, and False otherwise.

## ENBF
```
<fa-file> ::= "{" "states" ":" "[" <state> ("," <state>)* "]" ","
              "alphabet" ":" "[" <symbol> ("," <symbol>)* "]" ","
			"transitions" ":" "{" 
			<state> ":" "{" <symbol> ":" <state> ("," <symbol> ":" <state>)* "}" ("," <state> ":" "{" <symbol> ":" <state> ("," <symbol> ":" <state>)* "}")* "}" ","
              "initial_state" ":" <state> ","
              "final_states" ":" "[" <state> ("," <state>)* "]" 
			  "}"
<state> ::= '"' <character> '"' 
<symbol> ::= '"' <character> '"' 

<character> ::= <letter> | <digit> | <special-character>
<letter> ::= "a" | "b" | ... | "z" | "A" | "B" | ... | "Z"
<digit> ::= "0" | "1" | ... | "9"
<special-character> ::= "_" | "-" | ...

```
