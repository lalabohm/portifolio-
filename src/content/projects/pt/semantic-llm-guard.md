---
title: "semantic-llm-guard"
summary: "Detector semântico para ataques de prompt injection e jailbreak usando embeddings BGE-M3, comparado com uma baseline baseada em regex."
stack: ["BGE-M3", "Docker", "Qwen3-8B", "Python"]
status: "completed"
metrics: ["F1 semântico: 0.833", "F1 da baseline regex: 0.545", "Corpus: 69 exemplos", "GPU: RTX 3050"]
repoUrl: "https://github.com/lalabohm/semantic-llm-guard"
date: 2026-06-01
featured: true
---

## Objetivo do projeto

**semantic-llm-guard** é um firewall semântico para detectar ataques de
*prompt injection* e *jailbreak*, com o objetivo de proteger um LLM local
(Qwen3-8B via Ollama) de entradas maliciosas antes que cheguem ao modelo.

A abordagem central usa **embeddings BGE-M3** (`BAAI/bge-m3`) para
representar semanticamente cada prompt de entrada e compará-lo, via
similaridade de cosseno, com um corpus rotulado de exemplos de ataques
conhecidos e de uso legítimo. Essa abordagem de detecção **semântica** é
comparada com uma abordagem tradicional de **filtragem baseada em regex**,
permitindo avaliar os ganhos e limitações de cada método — incluindo a
capacidade do BGE-M3 de generalizar entre idiomas (por exemplo, detectar
em português um ataque originalmente descrito em inglês).

## Como começar

Clone este repositório para começar:

```bash
git clone https://github.com/lalabohm/semantic-llm-guard.git
cd semantic-llm-guard
```

Veja [Início rápido com Docker](#início-rápido-com-docker) abaixo para as
instruções completas de instalação, incluindo Docker.

Para uma introdução aos conceitos centrais por trás deste projeto (prompt
injection, detecção semântica vs. por palavras-chave, métricas de
avaliação), veja
[Conceitos de fundo](https://github.com/lalabohm/semantic-llm-guard/blob/main/docs/BACKGROUND_CONCEPTS.md).

## Por que detecção semântica? (e por que o regex ainda importa)

Regex e correspondência por palavras-chave continuam sendo uma primeira
linha de defesa comum contra prompt injection em sistemas de produção: são
rápidos, determinísticos e baratos de executar, já que os padrões são
avaliados localmente sem precisar de uma chamada ao modelo. Arquiteturas de
guardrails, em geral, ainda dependem desse tipo de correspondência de
padrão/schema para validação de formato — verificar se uma saída segue uma
estrutura esperada é um caso em que uma checagem determinística é a
ferramenta certa, mesmo em sistemas que, para outras categorias mais
abertas (detecção de jailbreak/injection, tratamento de PII, toxicidade,
política de tópicos e groundedness), usam camadas semânticas.

Este projeto não defende que o regex deva ser substituído. O objetivo é
quantificar uma lacuna específica e bem conhecida que a filtragem baseada
em palavras-chave deixa aberta: ataques parafraseados que evitam frases-
gatilho conhecidas. A avaliação neste repositório
(`results/evaluation_report.json`) traz evidência direta dessa lacuna:

- A baseline de regex detectou 0 dos 8 ataques parafraseados/sutis no
  conjunto de teste, e gerou 2 falsos positivos em exemplos benignos que
  continham palavras-gatilho ("system administrator", "developer mode")
  usadas em um contexto totalmente inofensivo.
- O detector semântico (BGE-M3) detectou 4 dos mesmos 8 ataques
  parafraseados, com 0 falsos positivos, alcançando um F1 de 0,833 contra
  0,545 da baseline de regex.

A conclusão prática não é "substituir regex por embeddings", e sim defesa
em profundidade: um filtro de regex rápido como primeira linha de defesa
contra padrões de ataque óbvios e conhecidos, seguido por uma camada
semântica que captura paráfrases e tentativas mais sutis que a camada de
regex deixa passar. Isso é consistente com a orientação mais ampla de
frameworks como o NIST AI Risk Management Framework e o OWASP Top 10 for
LLM Applications, que recomendam combinar múltiplas camadas de defesa
independentes em vez de depender de um único mecanismo de detecção (veja
[Referências](#referências)).

### Resultados em resumo

Os gráficos e o heatmap são gerados por `src/generate_charts.py` e
`src/similarity_matrix.py` a partir de `results/evaluation_report.json`.

![Precisão, recall, F1 e taxa de falsos positivos do detector semântico vs. baseline de regex](https://raw.githubusercontent.com/lalabohm/semantic-llm-guard/main/results/comparison_metrics.png)

*Em todas as métricas, o detector semântico (BGE-M3) supera a baseline de
regex — com destaque para uma taxa de falsos positivos de 0% contra 25% do
regex.*

![Gráfico de barras mostrando que o detector semântico capturou 4 de 8 ataques parafraseados, e a baseline de regex capturou 0 de 8](https://raw.githubusercontent.com/lalabohm/semantic-llm-guard/main/results/paraphrase_detection.png)

*A lacuna que mais importa: ataques parafraseados sem palavras-gatilho
conhecidas. O regex erra todos eles; o detector semântico captura metade.*

![Boxplot dos escores de similaridade de cosseno para exemplos de ataque vs. benignos, com o limiar de decisão de 0,7 marcado](https://raw.githubusercontent.com/lalabohm/semantic-llm-guard/main/results/score_distribution.png)

*Exemplos de ataque e benignos formam faixas de escore majoritariamente
separadas, com o limiar de 0,7 situado no meio do intervalo — alguns
ataques parafraseados (parte inferior da caixa de ataque) ainda ficam logo
abaixo dele, o que explica um recall de 0,71 e não mais alto.*

![Heatmap da similaridade de cosseno entre cada exemplo do conjunto de teste e cada exemplo rotulado do corpus, agrupados por categoria](https://raw.githubusercontent.com/lalabohm/semantic-llm-guard/main/results/similarity_heatmap.png)

*Visão par a par completa: os exemplos de teste (linhas) são mais claros
contra os exemplos do corpus (colunas) da própria categoria de ataque, e
visivelmente mais escuros contra as colunas benignas à direita.*

### Estrutura do projeto

- `src/` — código principal (geração de embeddings, detecção, pipeline de avaliação)
- `data/` — corpus rotulado de exemplos (prompts legítimos, injections, jailbreaks)
- `notebooks/` — experimentos e análise exploratória
- `results/` — métricas salvas, matrizes de similaridade e heatmaps
- `requirements.txt` — dependências Python do projeto
- `config.yaml` — configuração do pipeline (modelo LLM, tamanho de contexto, modo de raciocínio)

## Requisitos de hardware

O detector semântico (BGE-M3) roda em CPU por padrão e funciona em
qualquer máquina. O LLM local (Qwen3-8B via Ollama) é a parte pesada em
recursos; `config.yaml` permite trocá-lo por uma variante menor se o
hardware for limitado.

| Cenário | Hardware | Notas |
|---|---|---|
| Mínimo | Somente CPU, sem GPU | Funciona, mas a geração do Qwen3-8B é lenta. Defina `llm.model` em `config.yaml` como `qwen3:4b` ou `qwen3:1.7b` para uma latência utilizável. |
| Recomendado | GPU com 6GB+ de VRAM (ex.: RTX 3050) | O Qwen3-8B roda majoritariamente na GPU; espere algum offload para CPU com o tamanho de contexto padrão — veja a nota sobre contenção de VRAM abaixo. |
| Ideal | GPU com 8GB+ de VRAM | O Qwen3-8B cabe inteiramente na GPU, com espaço para uma janela de contexto maior. |

Para usar um modelo menor, edite `config.yaml`:

```yaml
llm:
  model: qwen3:4b   # ou qwen3:1.7b para hardware muito limitado
```

Depois baixe-o uma vez com o Ollama: `ollama pull qwen3:4b`.

## Início rápido com Docker

Uma alternativa à configuração manual acima (venv + Python local + Ollama
instalado localmente) — útil se você preferir não configurar o ambiente do
zero. Requer [Docker](https://docs.docker.com/get-docker/) e o plugin
Docker Compose.

```bash
# 1. Inicia o serviço Ollama
docker compose up -d ollama

# 2. Baixa o modelo dentro do container (uma vez)
docker compose exec ollama ollama pull qwen3:8b

# 3. Executa a demo
docker compose run semantic-firewall python src/demo_scenarios.py

# 4. Executa a avaliação
docker compose run semantic-firewall python src/evaluate.py
```

`docker-compose.yml` sobe dois serviços: `ollama` (imagem oficial, com um
volume nomeado para que os modelos baixados persistam entre reinícios) e
`semantic-firewall` (construído a partir do `Dockerfile` do projeto, torch
somente CPU já que o BGE-M3 roda em CPU por padrão). O container
`semantic-firewall` se comunica com o `ollama` pela rede do Compose via a
variável de ambiente `OLLAMA_HOST` (veja `OLLAMA_HOST` em
`src/pipeline.py`), e `./results` é montado dentro do container para que
logs, embeddings e gráficos persistam no host. A aceleração por GPU para o
serviço `ollama` é opcional e está comentada em `docker-compose.yml` — ela
requer o [NVIDIA Container
Toolkit](https://github.com/NVIDIA/nvidia-container-toolkit) instalado no
host.

## Integração no pipeline

O detector semântico fica na frente do LLM local como uma etapa de
triagem: toda entrada do usuário é classificada antes de poder chegar ao
Qwen3-8B. Requisições sinalizadas como ataque são bloqueadas imediatamente
e nunca são enviadas ao modelo.

```
entrada do usuário
    |
    v
embedding BGE-M3
    |
    v
checagem de similaridade (vs. corpus rotulado)
    |
    +-- flagged=True  --> [BLOQUEADO]  (registrado, sem envio ao modelo)
    |
    +-- flagged=False --> encaminhado ao Qwen3-8B via Ollama --> resposta
```

![Diagrama de arquitetura do pipeline: a entrada do usuário passa pelo embedding BGE-M3 e por uma checagem de similaridade, então segue para um caminho bloqueado ou é encaminhada ao Qwen3-8B, ambos terminando no log do pipeline](https://raw.githubusercontent.com/lalabohm/semantic-llm-guard/main/results/pipeline_architecture.png)

*Toda requisição é registrada independentemente do resultado — requisições
bloqueadas são registradas sem nunca chegar ao Qwen3-8B.*

Cada requisição processada pelo pipeline (`src/pipeline.py`) é registrada
como uma linha JSON em `results/pipeline_log.jsonl`, incluindo a decisão, a
categoria correspondente e o escore de similaridade, e a latência de cada
etapa (triagem semântica vs. resposta do modelo).

### Uma nota sobre contenção de GPU (6GB de VRAM)

Em uma GPU de 6GB (RTX 3050), rodar o BGE-M3 e o Qwen3-8B na GPU ao mesmo
tempo causa contenção de VRAM: o Ollama não tem memória livre suficiente
para acomodar o Qwen3-8B e recorre a uma divisão CPU/GPU lenta,
transformando uma resposta normal em uma espera de vários minutos. Três
mudanças em `src/pipeline.py` e `src/semantic_detector.py` resolvem isso:

- **O BGE-M3 roda em CPU por padrão.** Precisa de apenas ~90ms por
  requisição após o warmup, rápido o suficiente para uma etapa de triagem,
  e isso significa que ele nunca disputa VRAM com o Qwen3-8B.
- **Uma janela de contexto menor** (`num_ctx=2048`) reduz o consumo de
  VRAM do Qwen3-8B, já que mesmo sozinho ele não cabe totalmente nos
  ~5,67GB de VRAM utilizável desta placa com o contexto padrão de 4096
  tokens.
- **O modo de raciocínio é desativado** (`think=False`) para esses prompts
  informativos e diretos, evitando um grande número de tokens de
  raciocínio ocultos que praticamente dobravam o tempo de geração.

Combinadas, essas mudanças reduziram o cenário benigno de ponta a ponta na
demo abaixo de ~254s para ~51s. `pipeline.py` também registra o uso de
VRAM (campo `gpu_release` em `pipeline_log.jsonl`) em torno de uma etapa
defensiva de liberação de memória da GPU, de forma que qualquer regressão
aqui fica visível diretamente no log.

### Executando a demo

```
python src/demo_scenarios.py
```

Isso executa 3 cenários representativos de ponta a ponta (uma prompt
injection clássica, um ataque parafraseado/sutil e uma requisição benigna
legítima) e imprime a decisão, categoria, escore de similaridade e
latência por etapa para cada um — a resposta do Qwen3-8B só é exibida para
a requisição que é permitida.

### Status

Pipeline principal implementado: triagem semântica na frente do Qwen3-8B,
com logging estruturado e avaliação comparativa contra uma baseline de
regex.

## Referências

### Artigos acadêmicos

1. Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz,
   M. (2023). "Not What You've Signed Up For: Compromising Real-World
   LLM-Integrated Applications with Indirect Prompt Injection." Workshop
   on Artificial Intelligence and Security (AISec), co-localizado com a
   ACM CCS 2023. arXiv:[2302.12173](https://arxiv.org/abs/2302.12173)
2. Liu, Y., Jia, Y., Geng, R., Jia, J., & Gong, N. Z. (2024). "Formalizing
   and Benchmarking Prompt Injection Attacks and Defenses." 33rd USENIX
   Security Symposium (USENIX Security '24), pp. 1831-1847.
   [usenix.org](https://www.usenix.org/conference/usenixsecurity24/presentation/liu-yupei)
3. Hines, K., Lopez, G., Hall, M., Zarfati, F., Zunger, Y., & Kiciman, E.
   (2024). "Defending Against Indirect Prompt Injection Attacks With
   Spotlighting." arXiv:[2403.14720](https://arxiv.org/abs/2403.14720)
4. Zou, A., Wang, Z., Carlini, N., Nasr, M., Kolter, J. Z., & Fredrikson,
   M. (2023). "Universal and Transferable Adversarial Attacks on Aligned
   Language Models." (Introduz o ataque de sufixo adversarial GCG.)
   arXiv:[2307.15043](https://arxiv.org/abs/2307.15043)
5. Chao, P., Robey, A., Dobriban, E., Hassani, H., Pappas, G. J., & Wong,
   E. (2023). "Jailbreaking Black Box Large Language Models in Twenty
   Queries." (Introduz o algoritmo PAIR.) IEEE Conference on Secure and
   Trustworthy Machine Learning (SaTML 2025).
   arXiv:[2310.08419](https://arxiv.org/abs/2310.08419)

### Frameworks e padrões

- OWASP Top 10 for Large Language Model Applications (LLM01:2025 — Prompt
  Injection). [owasp.org](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- NIST AI Risk Management Framework (AI RMF 1.0). National Institute of
  Standards and Technology.
  [nist.gov](https://www.nist.gov/itl/ai-risk-management-framework)
- MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence
  Systems). [atlas.mitre.org](https://atlas.mitre.org/)

### Ferramentas e projetos open-source

- Modelo de embedding BAAI BGE-M3.
  [github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
- Ollama. [ollama.com](https://ollama.com)
- Qwen3 (Alibaba Cloud / Qwen Team) — o modelo de linguagem local que o
  pipeline deste projeto protege.

## Licença

Este projeto é licenciado sob a Licença MIT — veja o arquivo
[LICENSE](https://github.com/lalabohm/semantic-llm-guard/blob/main/LICENSE) para mais detalhes.
