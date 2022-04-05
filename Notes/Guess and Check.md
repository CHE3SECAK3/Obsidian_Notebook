# Guess and Check
*A naive way to solve differential equations.*

> [!example] Guess and Check
> $$
> y' = 2y, \quad y(0) = 5
> $$
> Let $y = e^{2x} + 5$. Then:
> $$ \begin{aligned}
> y' &= 2e^{2x} \\
> y' &= 2y-10 \\
> y' &\neq 2y
> \end{aligned} $$
> 
> $\therefore y$ is not a solution.
> 
> Let $y = 5e^{2x}$. Then:
> $$ \begin{aligned}
> y' &= 10e^{2x} \\
> y' &= 2y
> \end{aligned} $$
> 
> $\therefore y$ *is* a solution.

> [!example] Another Example
> $$
> y' = y^2, \quad y(0) = 5
> $$
> Let $y = \frac{5}{1-x}$. Then:
> $$ \begin{aligned}
> y' &= \frac{5}{(1-x)^2} \\
> y^2 &= \frac{25}{(1-x)^2} = 5y' \\
> y' &\neq y^2
> \end{aligned} $$
> 
> $\therefore y$ is not a solution.
> 
> Let $y = \frac{5}{1-5x}$. Then:
> $$ \begin{aligned}
> y' &= \frac{25}{(1-5x)^2} \\
> y^2 &= \frac{25}{(1-5x)^2} \\
> y' &= 2y
> \end{aligned} $$
> 
> $\therefore y$ *is* a solution.

### Guess and Check is dangerous...
- A guess might be hard to come up with.
- A guess might be incorrect
- A guess might not cover *all* solutions

---
tags: #DifferentialEquations
links: 