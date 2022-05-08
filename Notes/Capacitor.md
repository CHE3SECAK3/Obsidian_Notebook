# Capacitor
- *Circuit element that holds charge*

![[Capacitor Circuit Diagram]]

> [!info] Capacitors in Parallel
> - Parallel capacitors have the same drop in voltage across them
>
> - Capacitors in parallel have an equivalent capacitance of the sum of all capacitors
>
> $$C_{T} = C_{1}+ C_{2} + ... + C_{n} = \sum\limits_{n}C_n$$
> 
> > [!done]- Proof
> > $$\begin{align*}
C_{T} &= \frac{Q_{T}}{V_{T}} \\\\
C_{T} &= \frac{Q_{1} + Q_{2} + ... + Q_{n}}{V_{T}}\\ \\
C_{T} &= \frac{C_{1}V_{1} + C_{2}V_{2} + ... + C_{n}V_{n}}{V_{T}} \\\\
& \qquad V_{1} = V_{2} = V_{n} = V_{T} \\\\
C_{T} &= \frac{C_{1}V_{T}}{V_{T}} + \frac{C_{2}V_{T}}{V_{T}} + ... + \frac{C_{n}V_{T}}{V_{T}} = C_{1}+ C_{2} + ... + C_{n} \\\\
\end{align*}$$
> 
> 
>   ![[Capacitors in Parallel]]

> [!info] Capactiors in Series
> - Series capacitors have the same amount of charge in each
>
> - Capacitors in series have an equivalence capacitance of the inverse of the sum of the inverses of the capacitors
> $$C_{T}= \left( \frac{1}{C_{1}} + \frac{1}{C_{2}} + ... + \frac{1}{C_{n}}  \right)^{-1}$$
> 
> > [!success]- Proof
> > $$\begin{align*}
V_{T} &= V_{1} + V_{2} + ... + V_{n} \\\\
\frac{Q_{T}}{C_{T}} &= \frac{Q_{1}}{C_{1}} + \frac{Q_{2}}{C_{2}} + ... + \frac{Q_{n}}{C_{n}} \\\\
&& Q_{1} = Q_{2} = Q_{n} = Q_{T}\\\\
\frac{Q_{T}}{C_{T}} &= \frac{Q_{T}}{C_{1}} + \frac{Q_{T}}{C_{2}} + ... + \frac{Q_{T}}{C_{n}} \\\\\\
\frac{1}{C_{T}} &= \frac{1}{C_{1}} + \frac{1}{C_{2}} + ... + \frac{1}{C_{n}} \\\\
C_T &= \left(\frac{1}{C_{1}} + \frac{1}{C_{2}} + ... + \frac{1}{C_{n}}\right)^{-1} \\\\
\end{align*}$$
> 
> - Equivalent capacitance in series is *less than* the smallest element



---
tags: #Circuits 
links: [[Series and Parallel]] - [[Capacitance]]