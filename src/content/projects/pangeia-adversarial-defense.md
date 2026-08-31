---
title: "Pangeia — Adversarial Defense Framework"
summary: "Adversarial defense framework for ML-based DDoS detectors in 5G/SDN networks, using Feature Squeezing + PCA Whitening, integrated with Heimdall."
stack: ["ML", "5G/SDN", "Feature Squeezing", "PCA Whitening", "Heimdall"]
status: "completed"
metrics: ["4th place — IEEE SA Cybersecurity Hackathon 2026"]
repoUrl: "https://github.com/massarrahelenna/hackaton-pangeia"
date: 2026-03-01
featured: true
---

Defense-in-depth framework for ML-based DDoS detectors, with adversarial
robustness evaluation. Applied to **SYN Flood** detection on an XGBoost detector
(80/20 scenario).

## Structure

```
pangeia/
├── defenses/
│   ├── feature_squeezing.py    # Layer 1 — 8-bit quantization
│   ├── pca_whitening.py        # Layer 2 — PCA (rotation)
│   └── defense_pipeline.py     # integrated pipeline (FS + PCA + detector)
├── attacks/
│   ├── common.py               # shared loader + black-box wrapper
│   ├── spsa.py                 # stochastic-gradient (own implementation)
│   ├── hopskipjump.py          # decision-based (ART)
│   └── boundary.py             # decision-based (ART)
├── evaluation/
│   └── evaluate_defense.py     # baseline preservation + latency + robustness
├── dashboard/
│   └── app.py                  # Streamlit dashboard
├── artifacts/                  # model.pkl, scaler.pkl, features.json, dataset
├── docs/
│   └── robustness_results.md   # consolidated attack tables
├── requirements.txt
└── README.md
```

---

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 1) main evaluation (baseline + latency + robustness)
python evaluation/evaluate_defense.py

# 2) interactive dashboard
streamlit run dashboard/app.py

# 3) individual attacks (optional; reproduce the robustness tables)
python attacks/spsa.py 50
python attacks/hopskipjump.py 25
python attacks/boundary.py 20
```

---

## Measured results

**Defense on clean traffic:** 99.94% baseline preservation (no false positives),
~0.005 ms/sample latency (SLA < 5 ms ✓).

**Detector robustness:** four attack families (PGD, SPSA, HopSkipJump, Boundary)
plus a PGD epsilon sweep (500→100k) — all 0% evasion. See
[`docs/robustness_results.md`](https://github.com/massarrahelenna/hackaton-pangeia/blob/main/docs/robustness_results.md).

Gradient-free attacks fail too, ruling out gradient masking (Athalye et al. 2018).
Robustness stems from the restricted threat space (*realizability*): the decisive
SYN Flood features cannot be forged without breaking the attack.

---

## References

- Madry et al. (2018). PGD. — Chen et al. (2020). HopSkipJump.
- Brendel et al. (2018). Boundary Attack. — Xu et al. (2017). Feature Squeezing.
- Athalye et al. (2018). Obfuscated Gradients Give a False Sense of Security.
