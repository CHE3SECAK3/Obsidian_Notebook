# Half-Adder
- *1-bit adder*

| A   | B   | SUM | Carry_out |
| --- | --- | --- | --------- |
| 0   | 0   | 0   | 0         |
| 0   | 1   | 1   | 0         |
| 1   | 0   | 1   | 0         |
| 1   | 1   | 0   | 1         |

- Since a half-adder can only handle one bit, the sum **overflows** back to 0 when the sum is greater than 1
	- The carry-out signal is used to indicate an overflow, and acts the second bit

## Logic and Gate Diagram
- $SUM = \overline{A} \cdot B + A \cdot \overline{B}$
- $C\_{O}= A \cdot B$

![[Half-Adder Diagram]]

---
tags: #Digital_Design 
links:
