# Limit Comparison Test
If there is a series $\large \sum_{n=0}^{\infty} a_n$ and a series $\large \sum_{n=0}^{\infty} b_n$ such that:
- $a_n > 0$
- $b_n > 0$
- If $\lim_{n \to \infty} \frac{a_n}{b_n}$ is a finite, non-zero number:

then $\large \sum_{n=0}^{\infty} a_n$ and $\large \sum_{n=0}^{\infty} b_n$ are **comparable**.

> [!summary]  Comparable?
> 
> This means that:
> 
> If $\large \sum_{n=0}^{\infty} a_n$ is convergent, that means $\large \sum_{n=0}^{\infty} b_n$ is also convergent.
> 
> And if $\large \sum_{n=0}^{\infty} a_n$ is divergent, then $\large \sum_{n=0}^{\infty} b_n$ is also divergent.
> 

 > [!info] Why does this work?
> - If the $\lim\limits_{n \to \infty} \frac{a_{n}}{b_{n}}$ is a finite non-zero number, $\lim\limits_{n \to \infty} a_{n} \propto \lim\limits_{n \to \infty} b_{n}$ 
> 	- $a_n$ converges proportionally to $b_n$
>
> - So if $\sum\limits b_{n}$ converges, then $\sum\limits a_{n}$ also converges, but the actual value might be bigger or smaller depending how much faster or slower $a_{n}$ converges compared to $b_{n}$



---
tags: #Calculus/Sequences_and_Series
links:  [[Limit]] - [[Divergence and Convergence Tests]]