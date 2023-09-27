1. Express the algorithm recursively
2. Write a lemme defining valid inputs, desired outputs
3. Prove the algorithm is correct for the smallest basis inputs
4. Assume that the algorithm is correct for smaller inputs, up to and including some constant $k$ (hypothesis)
5. Show the algorithm is correct for larger inputs ($k+1$) using the hypothesis to justify recursive calls

# Complexity
- regardless of hardware and other things that affect running time, time complexity uses the number of operations performed as a metric
- Given an input of size $n$, $T(n)$ is the function determining the number of operations based on the input size
- For a recursive algorithm, $T(n) = a \cdot T(m) + O(g(n))$ where:
	- $a$: the most number of recursive calls at $n$ elements
	- $m$ size of input when recursively calling (should be smaller than $n$)
	- $T(n) = a \cdot T(m)$ is the total number of operations done recursively
	- $O(g(n)$ is the total number of non-recursive operations
- This *recurrence relation* is also a recursive equation, so finding a big-O closed equation is necessary

# Master Theorem
If $T(n) = a \cdot T\left(\frac{n}{b}\right)+ O(n^d)$, where $a > 0, b > 1, d \geq 0$, then:
$$
O(n^{d}),\log_{b}a < d,
O(n^{d}\log n),\log_{b}a = d,
O(n^{\log_{b}a}), \log_{b}a > d


$$

A smaller big-O estimate indicates less operations and therefore a faster algorithm