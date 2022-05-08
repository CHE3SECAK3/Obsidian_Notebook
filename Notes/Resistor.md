# Resistor
- *Circuit elements that creates a difference in potential*

![[Resistor Circuit Diagram]]
> [!info] Resistors in Series
> - Series resistors have the same amount of current going through each
>
> - Resistors in series have an equivalent resistance of the sum of all resistors
> $$R_{T} = R_{1}+ R_{2} + ... + R_{n} = \sum\limits_{n}R_n$$
> > [!done]- Proof
> > $$\begin{align*}
R_{T} &= \frac{V_{T}}{I_{T}} \\\\
R_{T} &= \frac{V_{1} + V_{2} + ... + V_{n}}{I_{T}}\\ \\
R_{T} &= \frac{I_{1}R_{1} + I_{2}R_{2} + ... + I_{n}R_{n}}{I_{T}} \\\\
&& I_{1} = I_{2} = I_{n} = I_{T} \\\\
R_{T} &= \frac{I_{T}R_{1}}{I_{T}} + \frac{I_{T}R_{2}}{I_{T}} + ... + \frac{I_{T}R_{n}}{I_{T}} = R_{1}+ R_{2} + ... + R_{n}\\\\
\end{align*}$$
> 

> [!info] Resistance in Parallel
> - Parallel resistors have the same drop in voltage across them
>
> - Resistors in parallel have an equivalence resistance of the inverse of the sum of the inverses of the capacitors
> $$R_{T}= \left( \frac{1}{R_{1}} + \frac{1}{R_{2}} + ... + \frac{1}{R_{n}}  \right)^{-1}$$
> 
> > [!success]- Proof
> > $$\begin{align*}
I_{T} &= I_{1} + I_{2} + ... + I_{n} \\\\
\frac{V_{T}}{R_{T}} &= \frac{V_{1}}{R_{1}} + \frac{V_{2}}{R_{2}} + ... + \frac{V_{n}}{R_{n}} \\\\
&& V_{1} = V_{2} = V_{n} = V_{T}\\\\
\frac{V_{T}}{R_{T}} &= \frac{V_{T}}{R_{1}} + \frac{V_{T}}{R_{2}} + ... + \frac{V_{T}}{R_{n}} \\\\\\
\frac{1}{R_{T}} &= \frac{1}{R_{1}} + \frac{1}{R_{2}} + ... + \frac{1}{R_{n}} \\\\
R_T &= \left(\frac{1}{R_{1}} + \frac{1}{R_{2}} + ... + \frac{1}{R_{n}}\right)^{-1} \\\\
\end{align*}$$
> - Equivalent resistance in parallel is *less than* the smallest element



---
tags: #Circuits
links: [[Series and Parallel]] - [[Resistance]]