# DeMorgan's Law
- *A useful logical refactoring* 

## Boolean Algebra
$$\overline{(x \cdot y)} = \overline{x} + \overline{y}$$
$$\overline{(x + y)} = \overline{x} \cdot \overline{y}$$

## Discrete Math
$$\neg{(p \land q)} = \neg{p} \lor \neg{q}$$
$$\neg{(p \lor q)} = \neg{p} \land \neg{q}$$

## Logic Gates
![[DeMorgan's Law Gates|200|center]]


>[!note] DeMorgan's Generalization
> - DeMorgan's Law can be generalized for multiple variables
> $$\neg (x_{1} \land x_{2} \land \cdots \land x_{n}) = \neg x_{1} \lor \neg x_{2} \lor \cdots \lor \neg x_{n}$$
> $$\neg (x_{1} \lor x_{2} \lor \cdots \lor x_{n}) = \neg x_{1} \land \neg x_{2} \land \cdots \land \neg x_{n}$$

---
tags: #Digital_Design - #Discrete_Math 
links: [[Boolean Algebra]] - [[Logic Gates]]