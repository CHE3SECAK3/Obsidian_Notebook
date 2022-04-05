# Separable Differential Equation
Separable equations follow the pattern:
$$
y' = G(y)*F(x), \quad y(a) = b
$$
where:
- $G(y)$ is a function of $y$
- $F(x)$ is a function of $x$
- $y(a) = b$ is an initial condition



> [!example] Separation of Variables Example
> Solve the differential equation:
> $$
> y' = x^2y^3, \quad y(1) = 2
> $$
> 
> $$
> \begin{align}
> \frac{dy}{dx} &= x^2y^3 \\ \\
> \frac{dy}{y^3} &= x^2dx \\ \\
> \int y^{-3}dy &= \int x^2dx \\ \\
> -\frac{1}{2} y^{-2} &= \frac{1}{3} x^3 + C \\ \\
> -\frac{1}{2} (2)^{-2} &= \frac{1}{3} (1)^3 + C \\ \\
> -\frac{1}{8} &= \frac{1}{3} + C \\ \\
> C &= -\frac{11}{24} \\ \\ \\
> \therefore
> -\frac{1}{2} y^{-2} &= \frac{1}{3} x^3 -\frac{11}{24}
> \end{align}
> $$
> This is an *implicit* solution, meaning the $y$ isn't isolated. The *explicit* solution can be derived but isn't necessary.


> [!example] Refactoring Equations
> Example 1:
> $$ \begin{align}
> y' &= 6xy + 9x + 8y + 12 \\ \\
> y' &= (2y+3)(3x+4) \\ \\
> &... \\ \\
> \frac{1}{2} \ln\left|2y+3\right| &= \frac{3}{2} x^2 + 4x + C \quad
> \end{align}$$
> Because there is no initial condition, the $+C$ remains.
> 
> Example 2:
> 
> $$ \begin{align}
> y' &= e^{x+y} \\ \\
> y' &= e^x e^y \\ \\
> e^{-y} dy &= e^x dx
> \end{align} $$


---
tags: #DifferentialEquations 
links: