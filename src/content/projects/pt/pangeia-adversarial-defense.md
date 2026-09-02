---
title: "Pangeia — Adversarial Defense Framework"
summary: "Framework de defesa adversarial para detectores de DDoS baseados em ML em redes 5G/SDN, usando Feature Squeezing + PCA Whitening, integrado ao Heimdall."
stack: ["ML", "5G/SDN", "Feature Squeezing", "PCA Whitening", "Heimdall"]
status: "completed"
metrics: ["4º lugar — IEEE SA Cybersecurity Hackathon 2026"]
repoUrl: "https://github.com/massarrahelenna/hackaton-pangeia"
date: 2026-03-01
featured: true
---

Framework de defesa em profundidade para detectores de DDoS baseados em ML,
com avaliação de robustez adversarial. Aplicado à detecção de **SYN Flood**
em um detector XGBoost (cenário 80/20).

## Estrutura

```
pangeia/
├── defenses/
│   ├── feature_squeezing.py    # Camada 1 — quantização de 8 bits
│   ├── pca_whitening.py        # Camada 2 — PCA (rotação)
│   └── defense_pipeline.py     # pipeline integrado (FS + PCA + detector)
├── attacks/
│   ├── common.py               # loader compartilhado + wrapper black-box
│   ├── spsa.py                 # gradiente estocástico (implementação própria)
│   ├── hopskipjump.py          # baseado em decisão (ART)
│   └── boundary.py             # baseado em decisão (ART)
├── evaluation/
│   └── evaluate_defense.py     # preservação de baseline + latência + robustez
├── dashboard/
│   └── app.py                  # dashboard em Streamlit
├── artifacts/                  # model.pkl, scaler.pkl, features.json, dataset
├── docs/
│   └── robustness_results.md   # tabelas consolidadas dos ataques
├── requirements.txt
└── README.md
```

---

## Resultados medidos

**Defesa em tráfego limpo:** 99,94% de preservação do baseline (sem falsos
positivos), ~0,005 ms/amostra de latência (SLA < 5 ms ✓).

**Robustez do detector:** quatro famílias de ataque (PGD, SPSA, HopSkipJump,
Boundary) mais uma varredura de epsilon do PGD (500→100k) — todos com 0% de
evasão. Veja
[`docs/robustness_results.md`](https://github.com/massarrahelenna/hackaton-pangeia/blob/main/docs/robustness_results.md).

Ataques gradient-free também falham, descartando gradient masking (Athalye
et al. 2018). A robustez decorre do espaço de ameaça restrito
(*realizability*): as features decisivas do SYN Flood não podem ser
forjadas sem quebrar o próprio ataque.

## Referências

- Madry et al. (2018). PGD. — Chen et al. (2020). HopSkipJump.
- Brendel et al. (2018). Boundary Attack. — Xu et al. (2017). Feature Squeezing.
- Athalye et al. (2018). Obfuscated Gradients Give a False Sense of Security.
