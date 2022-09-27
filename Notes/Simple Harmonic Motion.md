# Oscillation
- *Repeating motion around a point of equilibrium*

- Oscillations are periodic, meaning they repeat at constant intervals of time

## Elements of an Oscillation

### Amplitude
- *Maximum displacement from equilibrium*

- Symbol: $A$ in $m$

### Period
- *Duration of one cycle in an oscillation*

- Symbol: $T$ in $s$

### Frequency
- *Number of cycles per second in an oscillation*
- Symbol: $f$ in $s^{-1}$ or $Hz$

- The period and frequency are inverses of each other
$$T = \frac{1}{f} \text{ and } f = \frac{1}{T}$$

---
tags: #TODO - #Physics/Oscillation 
links: [[Period]]


# Simple Harmonic Motion (SHM)
- *Most important oscillation*
- Sinusoidal oscillation
- SHM follows [[Hooke's Law]]

> [!note] General Equation
> $$\begin{aligned}
\text{Displacement} &: x(t) & &= A\cos(\omega t + \phi_{0}) \\ \\
\text{Velocity} &: v(t) = \frac{dx}{dt} & &= -A\omega\sin(\omega t + \phi_{0}) \\ \\
\text{Acceleration} &: a(t) = \frac{d^{2}x}{dt^{2}} & &= -A\omega^{2}\cos(\omega t + \phi_{0})
\end{aligned}$$
> - where:
>	- $A$ : Amplitude ($m$)
>	- $\omega$ : Angular frequency or angular velocity ($\frac{\text{rad}}{s}$)
>	- $t$ : Time variable
>	- $\phi_{0}$ : Phase constant

> [!note] Angular Frequency
> - Angular frequency is the speed of cyclical motion
> - If frequency $f$ is the amount of cycles per second, 

![[SHM Graphs]]


# Hooke's Law
- The amount of force needed to compress or stretch a spring is linearly proportional to its displacement

$$F_{\text{sp}} = -k\vec{x}$$
- where:
	- $F_{\text{sp}}$ : Restoring force $N$
	- $k$ : Spring constant $\frac{N}{m}$
	- $\vec{x}$ : Displacement $m$

> [!note] Spring constant $k$
> - Intrinsic property of the spring itself
> 	- Determines how much force is required to stretch or compress a spring a unit distance (Newtons of force per meter, or $\frac{N}{m}$)
> 	
> 	- A tougher spring has a higher $k$, since it requires more force to manipulate it, while a looser spring has a smaller $k$ value

- The spring applies no force on the object at equilibrium ($x = 0, F_{\text{sp}} = \vec{0}$)

> [!question] Why is there a negative sign?
> - The resoting force is always in the opposite direction of displacement
> 
> - When stretching a spring, the spring wants to shrink back to its equilibrium position
> - When compressing the spring, it wants to spread out to its equilibrium position
> ![[Hooke's Law]]

---
tags: #TODO - #Physics/Oscillation 
links:
