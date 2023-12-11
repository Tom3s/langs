from Grammar import Grammar
from LR import LR


# g = Grammar(inFile = r".\g1_2.txt")
# # g = Grammar(inFile = r".\g2.txt")

# lrAlg = LR(g)
# print(lrAlg.canonicalCollection().to_string())

print(LR(Grammar(inFile = r".\g1_2.txt")).canonicalCollection().to_string())

