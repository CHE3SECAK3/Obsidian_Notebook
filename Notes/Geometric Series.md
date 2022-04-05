# Geometric Series
A series with a constant ratio between terms, where the ratio ${\Large r = \frac{a_{n+1}}{a_n}}$.

> [!example]  Geometric Series Example
> 
> $$
> \sum_{n=0}^{\infty} (\frac{1}{2})^n
> $$
> 
> $$
> \text{The ratio is } \frac{\frac{1}{4}}{\frac{1}{2}} = \frac{1}{2}
> $$
> 
## General Geometric Series Equation
$a + ar^2 +ar^3+...$, where $a$ is the first term and $r$ is the constant ratio.

> [!success]  Solving for Partial Geometric Sums
> 
> $$
> \begin{aligned}[t]
> 
> S_n &= a + ar + ar^2 + ... + ar^{n-1}\\
> 
> -\quad r * S_n &= ar + ar^2 + ar^3 + ... ar^n\\
> 
> \hline \\
> 
> S_n - rS_n &= a - ar^n \\
> S_n (1 - r) &= a(1 - r^n) \\ \\
> S_n &= \frac{a(1 - r^n)}{1-r} \\ \\
> 
> \end{aligned}
> $$
> 
> $$
> \sum_{n=0}^{\infty} a_n=
> \lim_{n \to \infty} S_n =
> 
> \begin{aligned}
> \begin{cases}
> 
> \Large{\frac{a}{1-r}},& |r| < 1 \\
> 0,& r = 0 \\
> \text{diverges},& |r| > 1
> 
> \end{cases}
> \end{aligned}
> $$


---
tags: #Calculus/Sequences_and_Series
links: [[Series]]