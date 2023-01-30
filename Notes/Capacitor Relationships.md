- $Q = CV$
- If voltage changes with respect with time, $q(t) = Cv(t)$
> [!success] i-V Relationship
> $$\begin{align*}
q(t) &= Cv(t) \\\\
\frac{d}{dt} \left[ q(t) \right] &= \frac{d}{dt}\left[ Cv(t) \right] \\\\
\frac{dq}{dt} &= C \frac{dv}{dt} \\\\
i(t) &= C \frac{dv}{dt} \\\\
\end{align*}
$$

- The current running through a capacitor is proportional to the time derivative of the capacitor's voltage.
	- A constant capacitor voltage (if the capacitor is detached, has no charge, or is fully charged) has no current running through it
	- $\large \frac{dv_{c}}{dt} = 0 \implies i_{c} = 0$

> [!note] Voltage Continuity
> - Since current depends on the derivative of voltage, voltage *must* be continuous in a capacitor
> - A jump discontinuity in voltage implies $\frac{\Delta V}{\Delta t}$ where $\Delta t = 0$, implying $\frac{\Delta V}{\Delta t} = \infty \implies i = \infty$
>   - In terms of circuit analysis, the voltage in a capacitor at time $t_{0}$ is equivalent to the voltage at time right *before* $(t^{-})$ and right *after* $(t^{+})$ $t_{0}$ or in other words:
> $$\lim_{h \rightarrow 0} \quad v(t - h) = v(t) = v(t + h)$$

> [!note] Integral Notation
> $$\begin{align*}
i &= C \frac{dv}{dt} \\\\
i \cdot dt &= C \cdot dv \\\\
v_{f} - v_{i} &= \frac{1}{C} \int_{i}^{f} i(t) dt
\end{align*}$$
> - Change in voltage in the capacitor can be found using the integral of current
> - If the inital voltage $(v_{i})$ is known, the final voltage can be calculated with $\large v_{f} = \frac{1}{C} \int_{i}^{f} i(t) dt  + v_{i}$

## DC Steady-State Condition