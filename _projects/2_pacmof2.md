---
layout: page
title: PACMOF2
description: Machine-learning models for predicting partial atomic charges in porous materials.
img:
importance: 2
category: work
github: https://github.com/snurr-group/pacmof2
related_publications: pham_predicting_2024
---

**PACMOF2** provides fast, accurate machine-learning models for assigning partial
atomic charges in metal–organic frameworks (MOFs) and other porous materials —
a prerequisite for reliable gas-adsorption simulations. The models reproduce
high-fidelity DDEC6 charges at a tiny fraction of the cost, and this release
extends coverage to **ionic MOFs** with extra-framework ions, a class that
previous charge-assignment methods handled poorly.

- **Stack:** Python, scikit-learn / PyTorch, RASPA, DFT reference data.
- **Code:** [github.com/snurr-group/pacmof2](https://github.com/snurr-group/pacmof2)
- **Paper:** _Predicting Partial Atomic Charges in Metal–Organic Frameworks: An Extension to Ionic MOFs_, J. Phys. Chem. C (2024).
