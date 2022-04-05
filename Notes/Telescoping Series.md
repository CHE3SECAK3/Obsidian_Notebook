# Telescoping Series
A series where all the terms except the first and the last cancel out.

Usually identified using **fractional decomposition**.

> [!example]  Telescoping Series Example
> 
> 
> $$ \begin{align}
> &\sum_{n=1}^{\infty} \frac{-2}{(n+1)(n+2)} \\
> 
> = &\sum_{n=1}^{\infty} \frac{-2}{n+1} + \frac{2}{n+2} \\
> 
> \lim_{n \to \infty} S_n = &\lim_{n \to \infty} \left[(\frac{-2}{2} + \cancel{\frac{2}{3}) + (\frac{-2}{3}} + \cancel{\frac{2}{4}) + (\frac{-2}{4}} + \cancel{\frac{2}{5}) + ... + (\frac{-2}{n+1}} + \frac{2}{n+2})\right] \\
> 
> \lim_{n \to \infty} S_n = &\lim_{n \to \infty} (-1 + \frac{2}{n+2}) = -1
> 
> \end{align}$$
> 
> 

---
tags: #Calculus/Sequences_and_Series 
links: [[Series]] - [[Fractional Decomposition]]