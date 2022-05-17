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
> 	- Capacitors $C$ will act like an ideal wire:
> 		- Build-up of positive charges on on end of the capacitor repels positive charges on the other
> 	- $V_{R} = \epsilon$
>
> - After a certain amount of time $t$:
> 	- Capactior $C$ will act like an open wire
> 		- Fully-charged capactior means no move moving charges
> 			- $I = 0$


---
tags: #TODO - #Circuits - #Physics/Electromagnetism 
links: [[Resistor]] - [[Capacitor]]