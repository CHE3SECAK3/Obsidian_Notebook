- $\Phi(t) = Li_{L}(t)$
> [!success] i-V Relationship
> $$\begin{align*}
\frac{d}{dt} \left[ \Phi(t) \right] &= \frac{d}{dt}\left[ Li_{L}(t) \right] \\\\
\frac{d\Phi}{dt} &= L \frac{di_{L}}{dt} \\\\
v_{L}(t) &= L \frac{di_{L}}{dt} \\\\
\end{align*}
$$

- The voltage across an inductor is proportional to the time derivative of the inductor's current.
	- A constant inductor current has no voltage across it
	- $\large \frac{di_{L}}{dt} = 0 \implies v_{L} = 0$

> [!note] Current Continuity
> - Since voltage depends on the derivative of current, current *must* be continuous through an inductor
> - A jump discontinuity in current implies $\frac{\Delta I}{\Delta t}$ where $\Delta t = 0$, implying $\frac{\Delta I}{\Delta t} = \infty \implies V = \infty$
>   - In terms of circuit analysis, the through an inductor at time $t_{0}$ is equivalent to the current at time right *before* $(t_{0}^{-})$ and right *after* $(t_{0}^{+})$ or in other words:
> $$\lim_{h \rightarrow 0} \quad i(t - h) = i(t) = i(t + h)$$

> [!note] Integral Notation
> $$\begin{align*}
v_{L}(t) &= L \frac{di_{L}}{dt} \\\\
\int_{i}^{f} v(t) \cdot dt &= \int_{i}^{f} L \cdot di \\\\
i_{f} - i_{i} &= \frac{1}{L} \int_{i}^{f} v(t) dt
\end{align*}$$
> - Change in current in the inductor can be found using the integral of voltage
> - If the inital current $(i_{i})$ is known, the final current can be calculated with:
>   $$i_{f} = \frac{1}{L} \int_{i}^{f} v(t) dt  + i_{i}$$

## DC Steady-State Condition
- An inductor in a circuit is known to be in a *steady-state* if the current through the capcatior reaches a constant value after "a long period of time"

	- Achieved when the inductor has no change in stored energy

- Under steady-state, since the current is constant (and the change in current is 0), there is no voltage across the inductor $$\left( \large \frac{di_{L}}{dt} = 0 \implies {v_{L}=L \frac{di_{L}}{dt} = 0} \right)$$
- Inductors can be treated as a *short* in the circuit for initial analysis! 

> [!note] Inverse Relationship Between Inductors and Capactiors
> - Note the symmetries between the way an inductor and capacitor behaves
> 	- Inductor voltage depends on the change in current, while capacitor current depends on the change in voltage
> 	- Both have opposing DC Steady-State assumptions