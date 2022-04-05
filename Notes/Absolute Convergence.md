# Absolute Convergence
Given a series $\sum_{n=0}^{\infty} a_n$, the series **absolutely** converges if $\sum_{n=0}^{\infty} |a_n|$ also converges.

A series **conditionally** converges if the $\sum_{n=0}^{\infty} a_n$ converges, but $\sum_{n=0}^{\infty} |a_n|$ diverges.


> [!example] Conditional Convergence
> Determine the convergence of an alternating harmonic series:
> $$ \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} $$
> 1. Check for conditional convergence:
> $\text{Alternating Series Test:} \lim_{n \to \infty} |a_n| = \lim_{n \to \infty} \frac{1}{n} = 0$
> $\quad \therefore$ The alternating harmonic series converges.
> 
> 2. Check for absolute convergence:
> $$\sum_{n=1}^{\infty} \left|\frac{(-1)^{n+1}}{n}\right| = \sum_{n=1}^{\infty} \frac{1}{n}$$
> $\quad$ The harmonic series is divergent.
> 
> $\therefore$ The alternating series is only conditionally convergent.


---
tags: #Calculus/Sequences_and_Series 
links: [[Series Convergence]] - [[Alternating Series]] - [[Alternating Series Test]]