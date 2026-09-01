---
layout: page
title: MOFGA
description: Genetic-algorithm software for optimizing metal–organic frameworks for carbon capture.
img:
importance: 5
category: work
github: https://github.com/snurr-group/mofga
related_publications: pham_implementation_2025
---

**MOFGA** is a Python framework for optimizing metal–organic framework (MOF)
building blocks for target properties. It represents each candidate as a
combination of topology, metal and organic nodes, and linkers, then searches the
resulting design space with selection, crossover, and mutation. The framework
supports both single- and multi-objective optimization and uses ToBaCCo to
construct candidate crystal structures.

MOFGA was developed and tested for identifying MOFs with strong carbon-capture
performance, including high CO₂/N₂ selectivity and CO₂ working capacity.

- **Stack:** Python, scikit-optimize, ToBaCCo.
- **Code:** [github.com/snurr-group/mofga](https://github.com/snurr-group/mofga)
- **Paper:** _Implementation of Genetic Algorithms to Optimize Metal-Organic Frameworks for CO₂ Capture_, Langmuir (2025).
