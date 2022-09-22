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
> - If Sally is drunk ($p = \text{True}$), Sally **must not** drive in order for the implication $p \implies q$ to be true
> 
> - However, let's say Sally isn't drunk ($p = \text{False}$)
> - In this case, she *might* or *might not* drive
> - Regardless, Sally being sober does not contradict the implication that she will not drive if she is drunk. Therefore, $p \implies q$ still holds true

> [!note] Special Conditionals
> Given that $p \implies q$ :
> 
> - The **contrapositive** states that $\neg q \implies \neg p$
> - The **converse** states that $q \implies p$
> - The **inverse** states that $\neg p \implies \neg q$ 
>
> | $p$ | $q$ | $p \implies q$ | $\neg q \implies \neg p$ | $q \implies p$ | $\neg p \implies \neg q$ |
> |:---:|:---:|:--------------:|:--------------:|:------------------------:|:------------------------:|
> |  T  |  T  |       T        |       T        |            T             |            T             |
> |  T  |  F  |       F        |       F        |            T             |            T             |
> |  F  |  T  |       T        |       T        |            F             |            F             |
> |  F  |  F  |       T        |       T        |            T             |            T             |
> 
> Based on the truth table:
> - Conditional and contrapositive propositions are equivalent
> - Inverse and converse propositions are equivalent
 

## Tautology and Contradiction




---
tags: #TODO - #Discrete_Math
links: [[Truth Tables]]