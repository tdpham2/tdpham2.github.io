---
layout: page
title: MOFA
description: Generative MOF design and screening at leadership-class scale.
img:
importance: 3
category: work
github: https://github.com/globus-labs/mof-generation-at-scale
related_publications: pham2026multiagent
---

**MOFA** is a workflow for generating and screening metal–organic frameworks at
scale on HPC systems. It couples generative models for proposing new MOF
structures with high-throughput property evaluation, orchestrated across many
nodes so that generation, assembly, and simulation run as a continuous
discovery pipeline.

The project connects to my broader work on **multi-agent orchestration for
high-throughput materials screening on leadership-class systems**, running
large campaigns across hundreds of compute nodes.

- **Stack:** Python, Parsl, generative ML, HPC (ALCF).
- **Code:** [github.com/globus-labs/mof-generation-at-scale](https://github.com/globus-labs/mof-generation-at-scale)
