# Quantifier
- Quantifiers turn predicates into propositions

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

- If a statement contains at least one free variable, then it is considered a predicate.

- If a statement contains all bound variables, then it is considered a proposition

- Nested quantifiers are statement that contain multiple quantifiers that bound different variables
	- They are evaluated left to right, so order matters

> [!example] Nested Qualifiers
> - $(x,y) \in \mathbb{R}^{2}$
> - $\forall x \forall y (x \cdot y \in \mathbb{R})$
> 	- For all $x$ and $y$, $x \cdot y$ is a real number
>
> - $\exists x \exists y (x + y = 0)$
> 	- There exists an $x$ and $y$ such that $x + y = 0$
>
> - $\exists x \forall y (x + y = 0)$
> 	- There exists an $x$ for all $y$ such that $x + y = 0$
> 	- This statement is false because $x$ is chosen first which will make the statement false for every $y$ except one $y$
>
> - $\forall x \exists y (x + y = 0)$
> 	- For every $x$ there exists a $y$ such that $x + y = 0$
> 	- This statement is true because any $y$ can be chosen for every $x$ 

---
tags: #TODO - #Discrete_Math
links: [[Predicate]] - [[Logic]]