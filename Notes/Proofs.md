# Proofs

## Proof by Exhaustion
## Existence Proof
## Constructive Proof of Existence
## Nonconstructive Proof of Existence
## Existential Instantiation
## Direct Proof
## Proof by Contrapositive



# Theorem

# Axiom


>[!success] Proof for Multihypothesis Condition
> $$ \begin{aligned}
H_{1} \land H_{2} &\implies C \\ \\
\neg C &\implies \neg(H_{1}\land H_{2}) \quad &\text{Superposition} \\ \\
\neg C &\implies \neg H_{1}\lor \neg H_{2} \quad &\text{DeMorgan's Law} \\ \\
\cancel{\neg \neg} C &\lor (\neg H_{1}\lor \neg H_{2}) \quad &\text{Logical equivalence of conditional} \\ \\
(C \lor \neg H_{1}) &\lor \neg H_{2} &\text{Associative} \\ \\
\neg(C \lor \neg H_{1}) &\implies \neg H_{2} &\text{Logical equivalence of conditional} \\ \\
\neg C \land H_{1} &\implies \neg H_{2} &\text{DeMorgan's Law}
\end{aligned}$$

---
tags: #TODO - #Discrete_Math 
links: