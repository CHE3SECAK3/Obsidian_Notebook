# Number System
- Digital Design uses 3 main number systems:

	- Decimal
	- Binary
	- Hexadecimal

>[!note] Generic Number in Base *R*
>$$(N)_{R} = (A_{n-1} \quad A_{n-2} \quad ... \quad A_{1} \quad A_{0} \quad {\Large\bf{.}} \quad A_{-1} \quad A_{-2} \quad ... \quad A_{-m})_{R}$$
> - where:
>   
> 	- $N_R$: Number in base $R$
>
> 	-  $R$ : Radix
>
> 	- $A_{n-1}$ : Most significant digit
>
> 	- ${\Large\bf{.}}$ : Radix Point
>
> 	- $A_{-m}$ : Least significant digit
>
> >[!info] Radix
> > - The radix determines how many symbols are present in the number system
> > - Radix 10 (the decimal system) has 10 digits to work with:
> > 	- $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$
> >
> > - Radix 2 (the binary system) has 2:
> > 	- $\{0, 1\}$
> >
> > - Radix 16 (the hexadecimal system) has 16:
> > 		- $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F\}$
> > - The radix point separates the integer and fractional part of a number
> > 	- A *decimal point* is the radix point in a radix 10 number system

>[!note] Digit Weight
> - Each digit in a number has a certain "weight", making it more or less significant
>
> - The weight is determined by the position of the digit and the radix
> 
> - In the decimal system, the ones place, tens place, and hundreds place are examples of weights given to digits 

>[!example] Example Numbers
> $$10110$$
> - This number could mean three different things based on what number system is used
>
> - In decimal ($10110_{10}$), this is just $10,110$
> - In binary ($10110_{2}$), this is equivalent to the decimal $22$
> - In hexadecimal ($10110_{16}$), this is equivalent to the decimal $65,808$
>   
> - Therefore when designing circuits and using numbers, it is important to specify what radix said number is in

## Number System Conversions
| Decimal | Binary | Hexadecimal |
|:-------:|:------:|:-----------:|
|    0    |  0000  |      0      |
|    1    |  0001  |      1      |
|    2    |  0010  |      2      |
|    3    |  0011  |      3      |
|    4    |  0100  |      4      |
|    5    |  0101  |      5      |
|    6    |  0110  |      6      |
|    7    |  0111  |      7      |
|    8    |  1000  |      8      |
|    9    |  1001  |      9      |
|   10    |  1010  |      A      |
|   11    |  1011  |      B      |
|   12    |  1100  |      C      |
|   13    |  1101  |      D      |
|   14    |  1110  |      E      |
|   15    |  1111  |      F      |

- Binary (0s and 1s) is the language of computers and is most often used in digital design
	- Binary digits are known as bits
	- A 4-bit value is known as a nibble
	- An 8-bit value is known as a byte

- The problem with binary numbers is that they can turn into long strings when the number gets too big (74 in binary is 1001010)
	- Hexadecimal is used as a binary shorthand, since one hexadecimal value represents 4 entire binary digits

	- $(01001010)_2 = (8A)_{16} = (74)_{10}$

---
tags: #TODO - #Digital_Design 
links: