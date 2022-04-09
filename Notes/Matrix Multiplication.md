# Matrix Multiplication
- Given two matrices $A$ and $B$ where the $j_A = i_B$:
	- The number of columns in $A$ is equal to the number of rows in $B$

- $AB$ is a new matrix $C$ where:
	- $C$ has $i_{A}$ rows and $j_{B}$ columns
	- Element $C_{ij} = A_{i1} \cdot B_{1j} + A_{i2} \cdot B_{2j} + \ldots + A_{ij} \cdot B_{ij}$

> [!note] Matrix Multiplication
> - If $A = \begin{bmatrix} m & n & p \\ x & y & z \end{bmatrix}$ and $B = \begin{bmatrix} a & d \\ b & e \\ c & f \end{bmatrix}$ :
>
> $$C = AB = \begin{bmatrix} ma + nb + pc & md + ne + pf \\ xa + yb + zc & xd + ye + zf \end{bmatrix}$$
> - In order to get the first entry in $C$, the elements in the first row of $A$ are "mapped" with the elements in the first column of $B$:
> 	- $C_{11} = \begin{bmatrix} m & n & p \end{bmatrix} \cdot \begin{bmatrix} a \\ b \\ c \end{bmatrix} = ma + nb + pc$
>
> 	- $C_{12}$ maps the first row of $A$ to the *second* column of $B$
> 
> > [!summary] Dot Product
> > - Each entry in $C$ is the dot product of a row of $A$ to a column of $B$

> [!note] Matrix Multiplication as a Linear Combination
> - Matrix multiplication can also be thought of as a *linear combination*
> - If $A = \begin{bmatrix} m & n & p \\ x & y & z \end{bmatrix}$ and $B = \begin{bmatrix} a & d \\ b & e \\ c & f \end{bmatrix}$ :
> 
> - The first column of $C$:
> $$(a)\begin{bmatrix} m \\ x \end{bmatrix} + (b)\begin{bmatrix} n \\ y \end{bmatrix} + (c)\begin{bmatrix} p \\ z \end{bmatrix} = \begin{bmatrix} am + bn + cp \\ ax + by + cz \end{bmatrix}$$ 
> 
> - The second column of $C$:
> $$(d)\begin{bmatrix} m \\ x \end{bmatrix} + (e)\begin{bmatrix} n \\ y \end{bmatrix} + (f)\begin{bmatrix} p \\ z \end{bmatrix} = \begin{bmatrix} dm + en + fp \\ dx + ey + fz \end{bmatrix}$$
> - Therefore:
> $$C = \begin{bmatrix} am + bn + cp & dm + en + fp \\ ax + by + cz & dx + ey + fz \end{bmatrix}$$

> [!warning] Commutative Property
> - Multiplication with numbers follow the commutative property:
> 	- $2 \times 3 = 3 \times 2$
> 
> - However, matrix multiplication *does not* have this property
> 	- i.e. $AB \neq BA$
>
> > [!example] Example
> > $$\begin{bmatrix}1 & 2 \\ 2 & 4\end{bmatrix} \begin{bmatrix}3 & 0 \\ 5 & 1\end{bmatrix} = \begin{bmatrix}10 & 2 \\ 26 & 4 \end{bmatrix}$$
> > $$\neq$$
> > $$\begin{bmatrix}3 & 0 \\ 5 & 1\end{bmatrix} \begin{bmatrix}1 & 2 \\ 2 & 4\end{bmatrix} = \begin{bmatrix}3 & 6 \\ 7 & 14 \end{bmatrix}$$
---
tags: #Linear_Algebra 
links: [[Matrix]] - [[Linear Combination]] - [[Dot Product]]