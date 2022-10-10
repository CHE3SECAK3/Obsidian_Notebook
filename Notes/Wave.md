# Wave

- *A patterned travelling disturbance through a space*

- A *transverse* wave has individual points of the wave moving perpendicular to the perception of the wave's motion

- A *longitudinal* wave has individual points of the wave moving parallel with the perception of the wave's motion

![[Types of Waves|1000|center]]

## Wave Speed

- The wave speed $v$ is the speed at which a ripple of the wave travels across a medium

>[!warning] Waves and Motion
> - An object that can wave (like a string moving up and down) does not actually have motion in the direction of the wave
>
> 	- i.e. Waves propogate through the medium, but the medium itself does not move
> 
> - Rather, the displacement of individual points on the medium creates the perception of a wave travelling.
>   
> 	- This is why the wave speed $v$ is a scalar value, without any derivatives or displacement integrals associated with it.

$$v_{s} = \sqrt{\frac{T_{s}}{\mu}}$$ where:

- $v_{s}$ : Wave speed on a string

- $T_{s}$ : Tension of the string
- $\mu$ : Linear density of the string
	- $\mu = \frac{m}{L}$ where:
		- $m$ : Mass of the string
		- $L$ : Length of the string


## Wavelength
- The wavelength $\lambda$ is the distance between repetition in the propogation of a wave



- A wave can be mathematically represented by deriving an equation that determines the displacement of any point in the medium at any given time.

- Given a sinusoidal wave:
$$D(x,t) = A\sin\left(kx - 2\pi ft + \phi_{0}\right)$$

```ad-success
title: Wave Displacement Equation

$$D(x, t = 0) = A\sin(\frac{2\pi}{\lambda}x + \phi_{0})$$
- where:
	- $x$ : Any point on the medium
	- $t = 0$ : A fixed point in time
	- $\lambda$ : Wavelength
	- $\phi_{0}$ : Phase constant

- A wave with a speed of $v$ traveling to the right for $t$ seconds would have travelled $vt$ distance.
- If a position $x$ has a displacement $D(x, t)$ after $t$ seconds of the wave travelling, then that same displacement have appeared at $D(x - vt, t=0)$
$$\begin{align} D(x, t) &= D(x - vt, t=0)\\\\ &= A\sin\left(\frac{2\pi}{\lambda}(x -vt) + \phi_{0}\right)\\\\ &= A\sin\left(\frac{2\pi}{\lambda} x - \frac{2\pi}{\lambda} vt + \phi_{0}\right)\\\\ &= A\sin\left(\frac{2\pi}{\lambda}x - 2\pi ft + \phi_{0}\right)\\\\ &= A\sin\left(kx - 2\pi ft + \phi_{0}\right)\end{align}$$ where:
- 

```

# Snapshot Graph
- *Representation of the whole wave in a fixed time*
- Snapshot graphs depict displacement vs position (points on the medium), so the distance between two crests is the wavelength $\lambda$

# History Graph
- *Representation of a specific particle's motion in a wave*
- History graphs depict displacement vs time, so the distance between two crests is known as the period $T$

>[!note] Wavelength and Period
> - The wavelength is a property of a wave 
>
> - The period is a property of a particle on the medium
> - However, for sinusoidal motion, a wave travels one $\lambda$ for every $T$
> - In other words, $v = \Large\frac{\lambda}{T}$ or $v = \lambda f$ , where:
> 	- $v$ : Wave speed
> 	- $\lambda$ : Wavelength
> 	- $T$ : Period
> 	- $f$ : Frequency

---
tags: #TODO
links: [[Density]]