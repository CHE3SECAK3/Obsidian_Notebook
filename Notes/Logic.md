# Logic
- *The language of reasoning*

## Logical Operators
| Operator      |   Symbol   |
|:------------- |:----------:|
| Negation      |   $\neg$   |
| Exclusive OR  |  $\oplus$  |
| Conjunction   |  $\land$   |
| Disjunction   |   $\lor$   |
| Conditional   | $\implies$ |
| Biconditional |   $\iff$   |


# Proposition
- *A statement that is either true or false*
- Propositions have a **truth value** that could evaluate to *True* or *False*

>[!example] Proposition Example
> ## Valid
> - "It is sunny outside."
> - "$1 + 1 = 2$"
> - "Pigs can fly."
> 
> - All of the statements above are propositions that could be given a truth value.
> 
> ## Invalid
> - "How are you feeling?"
> - "Do your work."
> - "Banana"
>
> - These statements are not propositions since they cannot be given truth values

>[!note] Propositional Variables
> - Propositional variables can be used to denote different propositions
> - Applying logical operators on variables create *compound propositions*
>
> ## Example
> $$p: \text{It is sunny outside.}$$
> $$q: \text{It is 60 degrees outside.}$$
> 
> ## Compound Propositions
> - $p \land q : \text{It is sunny outside and it is 60 degrees outside.}$
> - $p \lor q : \text{It is sunny outside and/or it is 60 degrees outside.}$
> - $\neg p \land q : \text{It is not sunny outside and it is 60 degrees outside.}$

## Conditional Proposition
$$ \text{if } p \text{, then } q$$
$$p \implies q$$ where:
- $p$ : Hypothesis
- $q$ : Conclusion
- If the hypothesis $p$ is false, $p \implies q$ is always true, because the conclusion doesn't imply the hypothesis

>[!example] Conditional Example
> - $p : \text{Sally is drunk.}$
> - $q: \text{Sally will not drive.}$
> - $p \implies q: \text{If Sally is drunk, Sally will not drive.}$
> ---
> - If Sally is drunk ($p = \text{True}$), $p \implies q$ can only be true if Sally also will not drive ($q = \text{True}$)
> 
> - However, if Sally isn't drunk ($p = \text{False}$), she *might* or *might not* drive. Therefore, $q$ only needs to be true if $p$ is also true in order for $p \implies q$ to be false.

> [!note] Special Conditionals
> - Given that $p \implies q$ :
> - The **converse** states that $q \implies p$
> - The **contrapositive** states that $\neg q \implies \neg p$
> - The **inverse** states tjat $\neg p \implies \neg q$

## Tautology and Contradiction




---
tags: #TODO - #Discrete_Math
links: