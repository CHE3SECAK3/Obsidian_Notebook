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
> ---
> - Oftentimes, $wt + \phi_{0}$ is written as $\phi$, or the phase of the oscillation
> 	- $\phi$ is the oscillation's current angle, whereas $\phi_{0}$ is the initial condition


> [!note] Angular Frequency $\omega$
> - Angular frequency $\omega$ is the speed of cyclical motion in $\frac{\text{radians}}{\text{second}}$
>
> - If frequency $f$ is the amount of cycles per second, and a full cycle is $2\pi$ radians, then $\frac{\cancel{\text{cycles}}}{s} \cdot \frac{2\pi \text{ rad}}{\cancel{\text{cycle}}} = \omega$
> $$\therefore \quad \omega = 2\pi f = \frac{2\pi}{T}$$

![[SHM Graphs|center]]


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
> - The resoting force is always in the opposite direction of displacement and towards equilibrium
> 
> - When stretching a spring, the spring wants to shrink back to its equilibrium position
> - When compressing the spring, it wants to spread out to its equilibrium position
> ![[Hooke's Law|]]

>[!note] Acceleration and Hooke's Law
>$$ \begin{align*}
F_{\text{sp}} &= -kx \\\\
\sum F_{x} &= ma_{x} \\ \\
\sum F_{x} &= F_{\text{sp}}\\ \\
ma_{x} &= -kx\\ \\
a_{x} &= -\frac{k}{m} x
\end{align*} $$

# Simple Harmonic Motion Energy
- The [[Law of Conservation of Energy]] states:
$$E = U + K = \frac{1}{2}kx^{2} + \frac{1}{2}mv^{2}$$
- where:
	- $E$ : Total mechanical energy
	- $U$ : Elastic potential energy
	- $K$ : Kinetic energy
	- $k$ : Spring constant
	- $x$ : Spring displacement
	- $m$ Mass of object
	- $v$ : Speed of object

- At max spring displacement $A$ , all the energy is elastic potential
	- $E = \frac{1}{2}kA^{2} + \cancelto{0}{K}$
- When there is no displacement, all the energy is kinetic
	- $E = \cancelto{0}{U} + \frac{1}{2}mv_\text{max} = \frac{1}{2}m(\omega A)^{2}$

- Setting the two extremes equal to each other:
$$\begin{align}
\frac{1}{2}kA^{2} &= \frac{1}{2}m(\omega A)^{2} \\ \\
k &= m \omega^{2} \\ \\
\omega &= \sqrt{\frac{k}{m}}
\end{align}$$

- Other equations could be derived from equation:
$$\begin{align*}
\omega &= \sqrt{\frac{k}{m}} \\\\
\omega &= 2\pi f \\\\
f &= \frac{1}{2\pi}\sqrt{\frac{k}{m}}
\end{align*}$$


# Vertical Oscillation
- A spring oscillating vertically has a different equilibrium position than its unstretched distance
	- Because gravity acts downward, equilibrium position $x_{0}$ is where the restoring force balances the gravitational force: 

$$
\begin{align}
\sum F_\text{y} = ky_{0} - mg &= 0 \\ \\
ky_{0} &= mg \\ \\
y_{0} &= \frac{mg}{k}
\end{align}$$

- At this point, the oscillation would have the same behavior and equation as a horizontal spring with the equilibrium being at $y_{0}$, with $\Delta L$ being the static stretch

![[Vertical SHM|center]]

# Simple Pendulum
- A pendulum is also an oscillator!

- A pendulum's forces are more useful when broken down to its radial and tangential components (rather than x- and y-components)

- Only the tangential component needs to be analyzed, since the oscillation is on the tangential curve.

![[Pendulum Forces|center]]

$$\begin{align*}
\sum F_{t} &= -mg\sin\theta\\
a_{t} &= -g\sin\theta
\end{align*}$$

>[!note] Small Angle Approximation
> - The forces dictating a pendulum are sinusoidally proportional, not linear.
> 
> - This means that a pendulum does not follow [[Notes/Hooke's Law|Hooke's Law]] and therefore does not follow [[Simple Harmonic Motion]]
> 
> - However, for small values of $\theta$, small-angle approximation applies: 
> $$\begin{align*}
\sin\theta &\approx \tan\theta \approx \theta \text{, where } \theta \text{ < 1 rad} \\\\
\sum F_{t} &= -mg\sin\theta \approx -mg\theta\\\\
a_{t} &\approx -g\theta = -g \frac{s}{L} & \theta &= \frac{s}{L}
\end{align*}$$
> - where:
> 	- $s$ : Arc length of the pendulum
> 	- $L$ : Length of the string
> 
> - With a good approximation, pendulums with a small angular amplitude can be treated as a simple oscillator!

- The equation for a simple pendulum is then: $$\begin{align*}
\theta(t) &= \theta_\text{max} \cos(\omega t + \phi_{0}) \quad\longrightarrow\quad \text{SHM spring equation:}\quad x(t) = A\cos(\omega t + \phi_{0})\\\\
s(t) &= s_\text{max} \cos(\omega t + \phi_{0}), \quad s = \theta_\text{max} L
\end{align*}$$

![[Simple Pendulum Characteristics|1000|center]]
- The pendulum's angular frequency $\omega = \sqrt{\frac{g}{L}} = 2\pi f$

- The pendulum's "spring constant" $k = \large\frac{mg}{L}$ 

>[!warning] Pendulum Mass and Frequency
> - Since $\omega = \sqrt{\frac{g}{L}}$, the frequency (and therefore period) of a pendulum is independent of mass!

---
tags: #TODO - #Physics/Oscillation 
links: [[Law of Conservation of Energy]]
