# RC Circuit
- *Circuits with resistors and capacitors*

- Unlike resistor-only or capactior-only circuits, RC circuits are *time-dependent*

- Ohm's Law and capacitance equations are still still applicable but values change based on time
  
	- Solving RC circuits require setting up a *differential equation*


> [!example] Series RC Circuit Example
> ![[Sketches/RC Circuit|1000]]
> 
> *Intuitions*:
> - Time $t = 0$ is defined when the switch is closed
>
> - Before $t = 0$ (switch is open):
> 	- No current flow since circuit is broken $\rightarrow I = 0$
> 	- Capacitor has no initial charge $\rightarrow Q = 0$
>
> - At $t = 0$ (immediately when switch closes):
> 	- Since capacitor has no charge, $V_{C}= 0$
> 	- According to Kirchoff's Voltage Law:
> 	$$\begin{align*} V_\text{battery} &= V_{R} + \cancelto{0}{V_{C}}\\ \epsilon &= I_{0}R\\ I_{0} &= \frac{\epsilon}{R} \end{align*} $$
> 
>
> - After a certain amount of time $t = \infty$:
> 	- Capactior $C$ is fully charged, which means charges cannot move around the circuit anymore
> 	$$\begin{align*} V_\text{battery} &= V_{R} + V_C\\ \epsilon &= \cancelto{0}{I}R + \frac{Q_\text{max}}{C}\\ Q_\text{max} &= C \epsilon \end{align*} $$
> 
> - *What happens in between the time extremes?*
> 	- As charge builds up in $C$, $V_C$ increases and $V_R$ decreases, which means $I$ also decreases. This happens at every instantaneous moment, which requires calculus to solve!


---
tags: #Circuits - #Physics/Electromagnetism 
links: [[Resistor]] - [[Capacitor]] - [[Kirchoff's Laws]] - [[First-Order Linear Differential Equation]]