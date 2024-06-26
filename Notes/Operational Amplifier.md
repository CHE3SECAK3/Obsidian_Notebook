- *Circuit element that amplifies [[voltage]]*

![[Operational Amplifier Circuit Diagram]]

- Op-amps have:
	- 2 input voltages ($v^+$ and $v^-$)
	- 1 output voltage ($V_\text{out}$)
	- 2 voltage rails ($+V_{CC}$ & $-V_{CC}$)
		- Voltages cannot be amplified for free, and must get power from another source -> $V_{CC}- \leq V_\text{out} \leq V_{CC}+$

- Gain: The ratio between $V_\text{out}$ and $V_s$
	- $G = \large\frac{V_\text{out}}{V_s}$

 
## 2 Golden Rules of Op-Amps
1. Current does not go through / come out either inputs of the op-amp
   $$i_{\text{in}} = i_{\text{out}} = 0$$
	- Ideally, op-amps have infinite input impedence

2. Op-amps output a voltage so that the 2 input voltages equalize $$v^{-} = v^{+}$$


---
tags: #Circuits 
links: