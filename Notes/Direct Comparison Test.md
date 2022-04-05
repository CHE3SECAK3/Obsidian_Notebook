# Direct Comparison Test
If two series $\large \sum_{n=1}^{\infty}a_n$ and $\large \sum_{n=1}^{\infty}b_n$ exist such that:
- $a_n < b_n$
- $\sum_{n=1}^{\infty}b_n$ converges

then $\large \sum_{n=1}^{\infty}a_n$ also *converges.*

If two series $\large \sum_{n=1}^{\infty}a_n$ and $\large \sum_{n=1}^{\infty}b_n$ exist such that:
- $a_n > b_n$
- $\sum_{n=1}^{\infty}b_n$ diverges

then $\large \sum_{n=1}^{\infty}a_n$ also *diverges.*

> [!example]  Direct Comparison Test Example
> 
> 
> $$
> \sum_{n=1}^{\infty} \frac{1}{2^n + 1}
> $$
> 
> Does this series converge?
> 
> $$ \begin{align}
> 
> \sum_{n=1}^{\infty} \frac{1}{2^n + 1} < \left[ \sum_{n=1}^{\infty} \frac{1}{2^n} = \frac{\frac{1}{2}}{1 - \frac{1}{2}} = 1 \right]
> 
> \end{align} $$
> 
> Because $\large\sum_{n=1}^{\infty} \frac{1}{2^n}$ converges and is greater than $\large\sum_{n=1}^{\infty} \frac{1}{2^n + 1}$, $\large\sum_{n=1}^{\infty} \frac{1}{2^n + 1}$ converges.
> 
> If the original series was $\large\sum_{n=1}^{\infty} \frac{1}{2^n - 1}$:
> 
> although the comparison series converges, $\large\sum_{n=1}^{\infty} \frac{1}{2^n - 1}$ > $\large\sum_{n=1}^{\infty} \frac{1}{2^n}$, so we do not know whether the original series will converge or not.
> - i.e. This test is not applicable.
> 

---
tags: #Calculus/Sequences_and_Series 
links: [[Divergence and Convergence Tests]]