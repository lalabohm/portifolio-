---
title: "Internship"
summary: "Data science pipeline for thematic clustering of CNPq-funded research projects using BGE-M3 semantic embeddings, dimensionality reduction, and unsupervised clustering."
stack: ["Python", "UMAP", "HDBSCAN", "K-Means", "PCA", "Plotly", "Pandas"]
status: "in progress"
metrics: []
date: 2026-09-01
featured: false
---

**Role/Area:** Data Science & AI Intern — Engineering Coordination (COENG), CNPq

**Status:** In progress

**Focus:** semantic embeddings, dimensionality reduction, unsupervised
clustering, interactive data visualization, security and data
governance in the public sector.

**Technologies:** Python · UMAP · HDBSCAN · K-Means · PCA · Plotly · Pandas

## Context

- **DCTI** — CNPq's Scientific Directorate. Conducts the evaluation, monitoring, and funding processes for science, technology, and innovation across the major fields of knowledge, and is organized into thematic general coordinations (such as Engineering and Technologies, Exact Sciences, Human and Social Sciences, Agricultural Sciences, among others).
- **CGETE** — General Coordination of Engineering and Technologies. Part of DCTI, concentrating activities related to the engineering fields.
- **COENG** — Engineering Coordination. A unit linked to CGETE, working specifically on managing and monitoring scholarships, grants, and funding calls directed at the different sub-areas of Engineering — such as Electrical, Mechanical, Civil, and Production Engineering, among others — including proposal analysis, monitoring of funded projects, and technical support to the advisory committees of these areas.

## Projects

Development of a **data science pipeline for thematic clustering of research projects funded by CNPq**, based on semantic embeddings generated with the BGE-M3 model. The project involves dimensionality reduction (PCA, UMAP) and unsupervised clustering (K-Means, HDBSCAN) to identify thematic groupings among thousands of research projects, followed by cluster interpretation and interactive visualization of the results.

**All work is conducted in a restricted environment (local JupyterLab, without unrestricted internet access), requiring solutions adapted to infrastructure constraints, demonstrating alignment with security and data governance best practices in the public sector.**

## Technical skills acquired

### Machine Learning / NLP

- Critical selection of embedding models, weighing trade-offs between dimension, context limit, parameter size, and multilingual support
- Applying model-specific requirements (e.g., the mandatory prefix for the E5 family) that affect quality in non-obvious ways
- Diagnosing anisotropy in embeddings through statistical evidence (similarity distribution, standard deviation)

### Methodological rigor

- Grounding observed problems in academic literature before applying corrections
- Empirically validating hypotheses with concrete before/after metrics
- Identifying that a correction that is statistically positive on average can distort individual results, confirmed through a controlled experiment

### Data pipeline engineering

- Designing reproducible pipelines, with per-model output versioning and independent cell execution across sessions
- Systematic debugging of errors (file paths, field names, data misalignment)
- Ensuring consistency of transformations between data generation and later use

### Technical communication

- Technical documentation of decisions and experiment results in a clear, replicable format
- Translating complex technical findings into accessible explanations for institutional reports
