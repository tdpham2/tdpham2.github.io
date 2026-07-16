---
layout: page
title: ChemGraph
description: An agentic AI framework for computational chemistry workflows.
img:
importance: 1
category: work
github: https://github.com/argonne-lcf/ChemGraph
related_publications: pham_chemgraph_2026, pham2026multiagent
---

**ChemGraph** is an agentic framework that lets researchers plan, reason about, and
execute atomistic simulation workflows through natural language. It combines graph
neural network–based foundation models for fast, accurate calculations with large
language models for task planning and scientific reasoning, wrapping simulation
codes (DFT, Monte Carlo, machine-learning interatomic potentials), databases, HPC
schedulers, and workflow engines behind an intuitive interface.

A core finding of the work is that decomposing complex tasks into smaller subtasks
through a multi-agent design enables even smaller LLMs to match or exceed a
single-agent GPT-4o baseline across a suite of computational-chemistry benchmarks.

- **Role:** Lead developer.
- **Stack:** Python, LangChain/LangGraph, MLIPs (MACE), ASE, HPC (ALCF Aurora/Polaris).
- **Code:** [github.com/argonne-lcf/ChemGraph](https://github.com/argonne-lcf/ChemGraph)
- **Paper:** _ChemGraph as an agentic framework for computational chemistry workflows_, Communications Chemistry (2026).
