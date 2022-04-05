# First-Order Linear Differential Equation

Separable equations follow the pattern:
$$
y' + p(x) \cdot y = q(x), \quad y(a) = b
$$
where:
- $p(x)$ is a function of $x$
- $q(x)$ is another function of $x$
- $y(a) = b$ is an initial condition

> [!note] Solving FOL Diff Eq
> If $p(x)$ is considered to be equivalent to the rational function $\large \frac{f'(x)}{f(x)}$, then multiplying both sides of the equation with the derived $f(x)$ creates the pattern:
> $$ \begin{align}
> f(x) \cdot y' + f'(x) \cdot y &= q(x) \cdot f(x) \\ \\
> f(x) \cdot y &= \int{q(x) \cdot f(x) \quad dx} \\ \\
> y &= \frac{\int{q(x) \cdot f(x) \quad dx}}{f(x)}
> \end{align}$$

> [!example]
> Solve the differential equation:
> $$\begin{align}
> xy' + 3y &= x^5 \qquad y(1) = 0 \\ \\
> y' + \frac{3}{x}y &= x^4 \qquad \text{standard form}\\ \\ \\
> 
> \int{\frac{f'}{f}} &= \int{\frac{3}{x}} \\ \\
> \ln{f} &= 3\ln{x} \\ \\
> f(x) &= (e^{\ln{x}})^3 = x^3 \\ \\ \\
> f(x) \cdot \Big{[} y' + \frac{3}{x}y &= x^4 \Big{]} \\ \\
> \int{x^3y' + 3x^2y} &= \int{x^7} \\ \\
> x^3y &= \frac{1}{8} x^8 + C \\ \\ \\
>  
> 0 &= \frac{1}{8} + C \quad\rightarrow\quad C = -\frac{1}{8} \\ \\ \\
> 
> y &= \frac{1}{8} x^5 - \frac{1}{8} x^{-3} \\
> \end{align}$$
> 



---
tags: #DifferentialEquations 
links: