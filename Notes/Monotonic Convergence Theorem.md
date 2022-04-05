# Monotonic Convergence Theorem
If a sequence is *monotonic* (only increasing or only decreasing), and the terms are bounded by a value, then the sequence must converge.

> [!example]  Monotonic Series Example
> 
> Find the limit of the sequence $a_n = \sqrt{2 \sqrt{2 \sqrt{2 ...}}}$
> 
> $$
> \begin{align}
> &\lim_{n \to \infty} a_n = L \\ \\
> &\lim_{n \to \infty} a_n = \lim_{n \to \infty} a_{n-1} \\ \\
> &a_n = \sqrt{2 a_{n-1}},\quad a_1 = \sqrt{2},\quad n \geq 2 \\
> \end{align}
> $$
> 
> $$ \begin{align} \\
> \lim_{n \to \infty} a_n &= \lim_{n \to \infty} \sqrt{2 a_{n-1}} \\
> &= \sqrt{2 \lim_{n \to \infty} a_{n-1}} \\
> &= \sqrt{2 \lim_{n \to \infty} a_{n-1}} \\
> L &= \sqrt{2L} \\
> L^2 &= 2L \\
> L^2 - 2L &= 0 \\
> L (L - 2) &= 0 \\
> L &= \cancelto{\text{doesn't make sense}}{0},\quad 2 \\ \\
> L &= 2
> \end{align} $$
> 

---
tags: #Calculus/Sequences_and_Series 
links: [[Limit]] - [[Divergence and Convergence Tests]]