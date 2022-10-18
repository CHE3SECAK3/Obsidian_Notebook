# Proofs

## Proof by Exhaustion
>[!example] Exhaustion
> $\text{For every integer } x \in \{1, 2, 3\},\quad x < 2x.$
> - Since $x$ can only be 3 integers, it would be easy to just test all values for $x$ to prove this theorem
> $$\begin{align*}
> x = 1: &\quad 1 < 2 \\\\
> x = 2: &\quad 2 < 4 \\\\
> x = 3: &\quad 3 < 6 \qquad \blacksquare
> \end{align*}$$
## Existence Proof
>[!example] Existence
> $\text{There exists an integer } x \text{ such that } x^{2} - 2x \text{ is odd.}$
> - This is equivalent to the logical statement $\exists x(x^{2} - 6x + 9 = 0)$
> - This could be proven with just one example, since that would satisfy an existential quantifier
> $$\begin{align*}
> &\text{Let x = 3.} \\
> &(3)^{2} - 2(3) = 9 - 6 = 3 \\
> &\text{Since 3 is odd, x satisfies the theorem.} \qquad \blacksquare
> \end{align*}$$
## Constructive Proof of Existence
## Nonconstructive Proof of Existence
## Existential Instantiation
## Direct Proof
## Proof by Contrapositive
- Recall that the [[Contrapositive]] is logically equivalent to a conditional
- Sometimes it is easier to prove the contrapositive over the actual conditional 


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