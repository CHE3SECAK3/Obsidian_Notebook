# Logic
- *The language of reasoning*

## Logical Operators in Precedence Order
| Operator               |   Symbol   |
|:---------------------- |:----------:|
| Universal Quantifier   | $\forall$  |
| Existential Quantifier | $\exists$  |
| Uniqueness Quantifier  | $\exists!$ |
| Negation               |   $\neg$   |
| Exclusive OR           |  $\oplus$  |
| Conjunction            |  $\land$   |
| Disjunction            |   $\lor$   |
| Conditional            | $\implies$ |
| Biconditional          |   $\iff$   |


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

- If the hypothesis $p$ is false, $p \implies q$ is always true

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

- $p \implies q$ could be rewritten as $\neg p \lor q$ since both have the same truth value

- Therefore $p \implies q$ and $\neg p \lor q$ are logically equivalent
	- $p \implies q \equiv \neg p \lor q$

## Tautology and Contradiction
- Tautologies are propositions that always evaluate to *True*
- Contradictions always evaluate to *False*

>[!example] Tautology and Contradiction
> - Tautology example: $p \lor \neg p$
> 	- Either side is going to be true or false, which makes the disjunction always true
>
> - Contradiction example: $p \land \neg p$
> 	- Both sides cannot be true at the same time, so the conjuction will always evaluate to false


## Biconditional Proposition
$$p \text{ if and only if } q \text{\quad \bf OR \quad} \text{ if } p \text{ then } q \text{, and vice versa}$$
$$p \iff q$$

- $p \iff q$ asserts that $p$ can only be true if $q$ is true
- If $q$ is false, $p$ has to be false for $p \iff q$ to be true

- Biconditional propositions therefore are truth value equivalence checkers


# Predicate
- *A statement whose truth value is dependent on one or more variables*

- Predicates turn into propositions if the variables are given values, since a truth value can then be evaluated

- Variables have a domain, which is a set of all possible inputs. Unless implied, the domain needs to be defined

>[!example] Predicate Example
> - $P(x) : x + 1 = 5$
>
> - $Q(x, y) : x^{2}+ y^{2}= 1$
> 
> - The store has no milk, where the "store" is a variable with the domain being all grocery stores in the Pacific Northwest
> 
> - If all variables in a predicate are assigned a value 
>   ($x = 3, y = 4, \text{store } = \text{ Safeway}$), then the predicate becomes a proposition
>
> ---
>
> - $x + 1 > x \text{, for all positive values of } x$ 
> 
> - The statement will always be true for any given $x$
> 	  - However, the statement remains a predicate until a value is assigned to $x$

# Quantifier
- Quantifiers also turn predicates into propositions

## Universal Quantifier

- $\forall x P(x)$ asserts that $P(x)$ is true for *every* $x$ in its domain

- In other words, for the set of all possible inputs $\{x_{1}, x_{2}, ... , x_{n}\}$, $\forall x P(x) \equiv P(x_{1}) \land P(x_{2}) \land \ldots \land P(x_{n})$

## Existential Quanitifer

- $\exists x P(x)$ asserts that $P(x)$ is true for *at least* one $x$ in its domain

- In other words, for the set of all possible inputs $\{x_{1}, x_{2}, ... , x_{n}\}$, $\exists x P(x) \equiv P(x_{1}) \lor P(x_{2}) \lor \ldots \lor P(x_{n})$

## Uniqueness Quantifier
- $\exists! x P(x)$ asserts that $P(x)$ is true for *only* one $x$ in its domain

- In other words, for the set of all possible inputs $\{x_{1}, x_{2}, ... , x_{n}\}$, $\exists! x P(x) \equiv P(x_{1}) \oplus P(x_{2}) \oplus \ldots \oplus P(x_{n})$


>[!note] Proving Quanitifers
> 
> - $\forall x P(x)$ requires all values of $x$ to be true, so finding one $x$ that makes $P(x)$ false means $\forall x P(x)$ is also false
> 	- This is a **counterexample**
>
> - $\exists x P(x)$ requires just one value of $x$ to be true, so finding one $x$ that makes $P(x)$ true means $\exists x P(x)$ is also true
> 	- This is an **example**
>
> - $\exists! x P(x)$ requires that only one value of $x$ can be true, so finding two values of $x$ that makes $P(x)$ true means $\exists! x P(x)$ is false

>[!note] DeMorgan's Law for Quantifiers
> ![[DeMorgan's Law for Quantifiers]]


## Nested Quantifiers

- A predicate $P(x)$ is said to have a *free variable* $x$

- A quantified statement $\forall x P(x)$ is said to have a *bound variable* $x$

- If a statement contains at least free variable, then it is considered a predicate.

- If a statement contains all bound variables, then it is considered a proposition

- Nested quantifiers are statement that contain multiple quantifiers that bound different variables

> [!example] Free and Bound Variables
> - $\exists x P(x)\quad$ has one bound variable
> 	- There exists an $x$ such that $P(x)$ is true
> - $\forall x \exists y (x = y)\quad$ has 2 bound variables
> 	- For every $x$, there exists a $y$ such that $x = y$
> - $\exists x \forall y (xy = z)\quad$ has 2 bound variables and one free variable
> 	- There exists an $x$ for all $y$ such that $xy = z$

---
tags: #TODO - #Discrete_Math
links: [[Truth Tables]]