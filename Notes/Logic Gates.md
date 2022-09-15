# Logic Gates
- *[[Boolean Algebra]] in digital circuits*

- Logic gates are devices that when given inputs, output a value based on boolean algebra

## Basic Gates
| Logic Gates             | Behavior                                | Number of Inputs |
|:----------------------- |:--------------------------------------- |:----------------:|
| AND gate ![[AND Gate]]  | Outputs $1$ if ALL inputs are also $1$  |    $\infty$*     |
| OR gate  ![[OR Gate]]   | Output $1$ if ANY of the inputs are $1$ |    $\infty$*     |
| NOT gate  ![[NOT Gate]] | Outputs the opposite of the input       |        1         |

## Compund Gates
- Some gates are a combination of the basic gates and are abstracted into a new gate

| Logic Gates              | Behavior                                 | Number of Inputs |
|:------------------------ |:---------------------------------------- |:----------------:|
| NAND gate ![[NAND Gate]] | Outputs $0$ if ALL inputs are $1$        |    $\infty$*     |
| NOR gate  ![[NOR Gate]]  | Outputs $0$ if ANY of the inputs are $1$ |    $\infty$*     |
| XOR gate  ![[XOR Gate]]  | Outputs $1$ if ONLY one input is $1$     |        2         |
| XNOR gate ![[XNOR Gate]] | Outputs $0$ if ONLY one input is $1$     |        2         |

\* *Traditionally, AND and OR gates take only 2 inputs, but their behavior does not change when more than 2 are given, so they require at LEAST 2 but can have more*

>[!note] Compound Logic Gate Derivations
> ![[Compound Logic Gates]]

---
tags: #TODO - #Digital_Design 
links: