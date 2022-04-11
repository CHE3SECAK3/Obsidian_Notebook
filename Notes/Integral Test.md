# Integral  Test
If $a_n = f(n),\quad n \in [1, \infty)$ and:
- $a_n$ is eventually non-negative
- $a_n$  is eventually decreasing

then $\large\sum_{n=1}^{\infty} a_n$ converges if $\large\int_{1}^{\infty}f(n)dn$ also converges.

> [!example]  P-Series Test Proof
> 
> ![[Harmonic Series Integral Test]]
> 
> $$ \begin{align}
> \sum_{n=1}^{\infty} \frac{1}{n} &\approx \int_{1}^{\infty} \frac{1}{n} dn \\
> &\approx \ln{|n|}_{1}^{\infty} = \infty
> \end{align}$$
> 
> Therefore, the Harmonic Series does **not** converge.
> 
> $$ \begin{align}
> \sum_{n=1}^{\infty} \frac{1}{n^2} &\approx \int_{1}^{\infty} \frac{1}{n^2} dn \\
> &\approx [-n^{-1}]_{1}^{\infty} = -[\frac{1}{n}]_{1}^{\infty} = 1
> \end{align}$$
> 
> Therefore, the P-Series where $P = 2$ converges.
> 

---
tags: #Calculus/Sequences_and_Series 
links: [[Integral]] - [[Divergence and Convergence Tests]]