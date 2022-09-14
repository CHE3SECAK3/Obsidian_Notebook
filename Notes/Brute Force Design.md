# Brute Force Design
- An iterative approach to digital design that accounts for all combinations of inputs

## Steps
1. Draw a [[Black Box Diagram|black box diagram]]
2. Create a [[Truth Table|truth table]]
3. Create an equation that satisfies the function
4. Translate the equation into a digital circuit


>[!example] BFD Example
> **Design a circuit that indicates when a 3-bit input is greater than 4**
> 
> 1. BBD
> ![[GT_THAN_4 BBD]]
> 
> 2. Truth Table
> 
> | B2  | B1  | B0  |  F  |
|:---:|:---:|:---:|:---:|
|  0  |  0  |  0  |  0  |
|  0  |  0  |  1  |  0  |
|  0  |  1  |  0  |  0  |
|  0  |  1  |  1  |  0  |
|  1  |  0  |  0  |  0  |
|  1  |  0  |  1  |  1  |
|  1  |  1  |  0  |  1  |
|  1  |  1  |  1  |  1  |
> - Out of the total 8 possibilities, there are 3 combinations that satisfies this circuit.
> 
> 3. Equation
> $$F = (B2 \cdot \overline{B1} \cdot B0) + (B2 \cdot B1 \cdot \overline{B0}) + (B2 \cdot B1 \cdot B0)$$
> 
> 4. Final BBD Circuit
> ![[GT_THAN_4 Completed Circuit]]

---
tags: #TODO - #Digital_Design 
links: 