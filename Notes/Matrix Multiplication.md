# Matrix Multiplication
- Given two matrices $A$ and $B$ where the $j_A = i_B$:
	- The number of columns in $A$ is equal to the number of rows in $B$

- $AB$ is a new matrix $C$ where:
	- $C$ has $i_{B}$ rows and $j_{i}$ columns
	- Element $C_{ij} = A_{i1} \cdot B_{1j} + A_{i2} \cdot B_{2j} + \ldots + A_{ij} \cdot B_{ij}$

> [!note] Matrix Multiplication
> - If $A = \begin{bmatrix} m & n & p \\ x & y & z \end{bmatrix}$ and $B = \begin{bmatrix} a & d \\ b & e \\ c & f \end{bmatrix}$ :
>
> $$AB = C = \begin{bmatrix} ma + nb + pc & md + ne + pf \\ xa + yb + zc & xd + ye + zf \end{bmatrix}$$
> 
> - In other words, the rows of $A$ are dot producted to the columns of $B$

---
tags: #Linear_Algebra 
links: [[Matrix]] - [[Dot Product]]