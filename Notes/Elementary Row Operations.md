# Elementary Row Operations
- Matrices can represent a linear system of equations
- $\therefore$ Matrices can be manipulated just like a system of equations

> [!example]- System of Equations $\leftrightarrow$ Matrix
> $$\begin{bmatrix}-2 & 0 & 5 & -1 \\ 4 & -1 & 2 & 2 \\ -7 & -6 & 0 & 4\end{bmatrix} \bar{x} = \begin{bmatrix}6 \\ -2 \\ -8\end{bmatrix}$$
>
> - where:
> 	- $\bar{x}$ : $\begin{bmatrix}a \\ b \\ c \\ d\end{bmatrix}$ is a column matrix of constants
> 
> - This matrix multiplication can be rewritten as a linear system of equations:
> 
> $$\begin{cases}
-2a & &+ 5c &- d &= 6 \\
4a &- b &+ 2c &+ 2d &= -2 \\
-7a &- 6b & &+ 4d &= -8
\end{cases}$$
> 
> > [!note] Linear Combination
> > - Note how this system (and therefore the matrix  multiplication) can be written as a *linear combination*

## 3 Elementary Operations
- *How can either form be manipulated without changing their relationships?* Elementary Row Operations!
- Permutation
	- Moving the order of equations
	- Moving the order of rows

- Scale
	- Multiplying an equation by a nonzero
	- Multiplying a row by a nonzero

- Addition
	- Multiplying one equation and adding it to another
	- Multiplying one row and adding it to another


> [!example] Elementary Row Operation Example
> Example matrix and equivalent system of equations:
> 
> $$\begin{bmatrix}-2 & 0 & 5 & -1 \\ 4 & -1 & 2 & 2 \\ -7 & -6 & 0 & 4\end{bmatrix} \begin{bmatrix}a \\ b \\ c \\ d\end{bmatrix} = \begin{bmatrix}6 \\ -2 \\ -8\end{bmatrix}$$
> $$\updownarrow$$
> $$\begin{cases}
-2a & &+ 5c &- d &= 6 \\
4a &- b &+ 2c &+ 2d &= -2 \\
-7a &- 6b & &+ 4d &= -8
\end{cases}$$
> 
> - Permutation:
> 	- *Swapping first and second equation*
> $$\begin{bmatrix} 4 & -1 & 2 & 2 \\ -2 & 0 & 5 & -1 \\ -7 & -6 & 0 & 4\end{bmatrix} \begin{bmatrix}a \\ b \\ c \\ d\end{bmatrix} = \begin{bmatrix}-2 \\ 6 \\ -8\end{bmatrix}$$
> $$\updownarrow$$
> $$\begin{cases}
4a &- b &+ 2c &+ 2d &= -2 \\
-2a & &+ 5c &- d &= 6 \\
-7a &- 6b & &+ 4d &= -8
\end{cases}$$
>
> - Scale:
> 	- *Scaling first equation by 2*
> $$\begin{bmatrix} 8 & -2 & 4 & 4 \\ -2 & 0 & 5 & -1 \\ -7 & -6 & 0 & 4\end{bmatrix} \begin{bmatrix}a \\ b \\ c \\ d\end{bmatrix} = \begin{bmatrix} -4 \\ 6 \\ -8\end{bmatrix}$$
> $$\updownarrow$$
> $$\begin{cases}
8a &- 2b &+ 4c &+ 4d &= -4 \\
-2a & &+ 5c &- d &= 6 \\
-7a &- 6b & &+ 4d &= -8
\end{cases}$$
>
> - Addition:
> 	- *Adding 3 times the first equation to the third*
> $$\begin{bmatrix} 8 & -2 & 4 & 4 \\ -2 & 0 & 5 & -1 \\ 17 & 0 & 12 & 16\end{bmatrix} \begin{bmatrix}a \\ b \\ c \\ d\end{bmatrix} = \begin{bmatrix} -4 \\ 6 \\ -20\end{bmatrix}$$
> $$\updownarrow$$
> $$\begin{cases}
8a &- 2b &+ 4c &+ 4d &= -4 \\
-2a & &+ 5c &- d &= 6 \\
17a & &+ 12c &+ 16d &= -20
\end{cases}$$

---
tags: #Linear_Algebra 
links: [[Matrix Multiplication]] - [[Matrix Scalar Multiplication]] - [[Matrix Addition]]