# Divergence Test
For a series $\sum_{n=0}^{\infty}a_n$, if $\lim_{n \to \infty} a_n \neq 0$, then the series diverges.

> [!example]  Divergence Test Example
> 
> $$
> \sum_{n=1}^{\infty} \frac{2n^3 - n + 1}{n^3 +3n^2 - 2}
> $$
> 
> Does this series diverge?
> 
> $$
> \begin{align}
> &\lim_{n \to \infty} \frac{2n^3 - n + 1}{n^3 +3n^2 - 2} \\ \\
> 
> = &\lim_{n \to \infty} \frac{\cancel{n^3} (2 - \frac{1}{n^2} + \frac{1}{n^3})}{\cancel{n^3} (1 + \frac{3}{n} - \frac{2}{n^3})}
> 
> = \frac{2}{1} = 2
> \end{align}
> $$
> 
> This limit implies that as $n \to \infty$, the terms approach the value $2$, meaning that for really large values of $n$, the series would be the sum of an infinite amount of $2$s.
> 
> Therefore, the series diverges!
> 


---
tags: #Calculus/Sequences_and_Series 
links: [[Divergence]] - [[Divergence and Convergence Tests]]