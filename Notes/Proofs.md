# Proofs

## Proof by Exhaustion
>[!example] Exhaustion
> $\text{Prove that for every integer } x \in \{1, 2, 3\},\quad x < 2x$
> - Since $x$ can only be 3 integers, it would be easy to just test all values for $x$ to prove this theorem
> $$\begin{align*}
> x = 1: &\quad 1 < 2 \\\\
> x = 2: &\quad 2 < 4 \\\\
> x = 3: &\quad 3 < 6 \qquad \blacksquare
> \end{align*}$$
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