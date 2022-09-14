# Matrix Addition
- Given two [[Matrix|matrices]] $A$ and $B$ both with $i$ rows and $j$ columns:

	- $A + B$ is a new matrix $C$ where:
	- $C$ has $i$ rows and $j$ columns
	- Element $C_{ij} = A_{ij} + B_{ij}$

> [!note] Matrix Addition
> $$C = 
> \begin{bmatrix}
> A_{11} & A_{12} & \ldots & A_{1j} \\
> A_{21} & A_{22} & \ldots & A_{2j} \\
> \vdots & \vdots & \vdots & \vdots \\
> A_{i1} & A_{i2} & \ldots & A_{ij} \\
> \end{bmatrix}
> + 
> \begin{bmatrix}
> B_{11} & B_{12} & \ldots & B_{1j} \\
> B_{21} & B_{22} & \ldots & B_{2j} \\
> \vdots & \vdots & \vdots & \vdots \\
> B_{i1} & B_{i2} & \ldots & B_{ij} \\
> \end{bmatrix}
> = 
> \begin{bmatrix}
> A_{11} + B_{11} & A_{12} + B_{12} & \ldots & A_{1j} + B_{1j} \\
> A_{21} + B_{21} & A_{22} + B_{22} & \ldots & A_{2j} + B_{2j} \\
> \vdots & \vdots & \vdots & \vdots \\
> A_{i1} + B_{i1} & A_{i2} + B_{i2} & \ldots & A_{ij} + B_{ij} \\
> \end{bmatrix}$$

> [!warning]
> - Matrix addition is *only* applicable with 2 matricies with equal number of rows and columns
> $$\begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + \begin{bmatrix} 1 & 2 \\ 0 & 5 \\ 2 & 8 \end{bmatrix}$$
> - This addition doesn't make sense since the first matrix is $3 \times 1$ while the second matrix is $3 \times 2$


---
tags: #Linear_Algebra
links: [[Matrix]]