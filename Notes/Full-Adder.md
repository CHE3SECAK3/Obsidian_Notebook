# Full-Adder
- *1-bit carry-in adder*

| Carry_In |  A  |  B  | SUM | Carry_out |
|:--------:|:---:|:---:|:---:|:---------:|
|    0     |  0  |  0  |  0  |     0     |
|    0     |  0  |  1  |  1  |     0     |
|    0     |  1  |  0  |  1  |     0     |
|    0     |  1  |  1  |  0  |     1     |
|    1     |  0  |  0  |  1  |     0     |
|    1     |  0  |  1  |  0  |     1     |
|    1     |  1  |  0  |  0  |     1     |
|    1     |  1  |  1  |  1  |     1     |

- The full-adder also handles one-bit, but can take in another input bit that comes from a carry_out of another adder
	- The carry-out signal is still used to indicate an overflow, and so 

## Logic and Gate Diagram
- $SUM = \overline{CI} \cdot \overline{A} \cdot B + \overline{CI} \cdot A \cdot \overline{B} + CI \cdot \overline{A} \cdot \overline{B} + CI \cdot A \cdot B$
- $CO = \overline{CI} \cdot A \cdot B + CI \cdot \overline{A} \cdot B + CI \cdot A \cdot \overline{B} + CI \cdot A \cdot B$

![[Full-Adder Diagram]]

---
tags: #TODO - #Digital_Design 
links: [[Half-Adder]]
