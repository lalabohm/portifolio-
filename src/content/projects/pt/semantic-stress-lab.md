---
title: "semantic-stress-lab"
summary: "Benchmark adversarial que testa como a sintaxe literária (hipérbato, neologismo, metáfora) degrada a fidelidade de embeddings e induz alucinação em LLMs em textos em português."
stack: ["BGE-M3", "LaBSE", "EmbeddingGemma", "Python"]
status: "in progress"
metrics: ["25 pares anotados", "3 modelos de embedding comparados", "Similaridade média de cosseno: 0.76 (BGE-M3)"]
repoUrl: "https://github.com/lalabohm/semantic-stress-lab"
date: 2026-08-15
featured: true
---

Pesquisa sobre como a complexidade sintática e retórica literária —
antítese, eufemismo, neologismo, paradoxo, zeugma, paródia e fenômenos
relacionados — afeta a similaridade de embeddings. Este projeto mede como
a complexidade sintático-literária de um fragmento afeta a similaridade de
embedding (similaridade de cosseno, um efeito de "deslocamento espacial")
entre um texto original e sua "tradução intralinguística" — uma reescrita
simplificada e semanticamente equivalente em português contemporâneo — em
múltiplos modelos de embedding (BGE-M3, LaBSE, EmbeddingGemma), para que a
conclusão não dependa de uma única arquitetura. Este projeto testa
especificamente **textos em língua portuguesa**: o corpus é construído a
partir de literatura brasileira em domínio público (Padre Antônio Vieira,
Machado de Assis, Augusto dos Anjos, Mário de Andrade, Aluísio Azevedo).

**Experimento**: para cada par (original, simplificado), gerar embeddings
de `texto_original` e `texto_simplificado` com cada modelo, calcular sua
similaridade de cosseno, e comparar essa similaridade entre
`fenomeno_linguistico` e entre modelos — sob a hipótese de que um fragmento
com complexidade sintática mais pronunciada deveria apresentar menor
similaridade do que um sintaticamente direto, mesmo que ambos os membros do
par sejam, por construção, semanticamente equivalentes.

Metodologia completa, incluindo o protocolo de tradução intralinguística e
a checagem de entailment bidirecional, em
[`docs/METHODOLOGY.md`](https://github.com/lalabohm/semantic-stress-lab/blob/main/docs/METHODOLOGY.md).
Critérios de anotação em
[`docs/ANNOTATION_GUIDE.md`](https://github.com/lalabohm/semantic-stress-lab/blob/main/docs/ANNOTATION_GUIDE.md).

## Status atual

✅ Dataset (`data/annotation/dataset_v0_draft.csv`) construído, validado e
convertido para `data/processed/dataset_v0.jsonl` via o schema em
`src/dataset/schema.py` (`DatasetEntry`) e `src/dataset/csv_to_jsonl.py`.
Começou com 12 pares anotados (1 por fenômeno) e foi **expandido para 25
pares** para adicionar observações repetidas de quatro fenômenos
(Paradoxo, Antítese, Hipérbato, Zeugma) — veja
[Resultados](#resultados-deslocamento-espacial-do-embedding) para entender
por que essa expansão importou.

✅ O pipeline de embeddings está implementado em `src/embeddings/` e foi
executado duas vezes com os três modelos de embedding (BGE-M3, LaBSE,
EmbeddingGemma): uma no piloto de 12 pares
([`results/phase1_embeddings/cosine_similarity_by_model.csv`](https://github.com/lalabohm/semantic-stress-lab/blob/main/results/phase1_embeddings/cosine_similarity_by_model.csv),
preservado para comparação) e outra no dataset expandido de 25 pares
([arquivos com sufixo `_v1`](https://github.com/lalabohm/semantic-stress-lab/blob/main/results/phase1_embeddings/cosine_similarity_by_model_v1.csv)),
sem valores ausentes em nenhuma das execuções. Um conjunto de controle
sintético de 5 pares (`data/processed/control_baseline.jsonl`, paráfrases
triviais sem figura de linguagem) também passou pelo mesmo pipeline para
estabelecer um piso de similaridade.

Uma fase anterior deste projeto testou um experimento de
interpretação-avaliação com LLM; ela foi retirada do escopo ativo e
arquivada — veja [`archive/`](https://github.com/lalabohm/semantic-stress-lab/tree/main/archive/)
e a seção "Trabalhos futuros" em
[`docs/METHODOLOGY.md`](https://github.com/lalabohm/semantic-stress-lab/blob/main/docs/METHODOLOGY.md)
para saber o que era e por que foi descontinuada.

## Resultados: deslocamento espacial do embedding

Os resultados abaixo são apresentados na ordem em que foram efetivamente
encontrados, incluindo o ponto em que a hipótese original deixou de se
sustentar. Este projeto trata isso como o processo funcionando como
esperado, não como um fracasso a ser omitido silenciosamente: um padrão
inicial foi proposto a partir de uma amostra pequena, testado contra um
controle e um possível confundidor, e então retestado com mais dados — o
que foi exatamente o que revelou uma explicação mais robusta do que a
inicial.

**1. Hipótese inicial e primeiro padrão (n=12, um par por fenômeno).** A
hipótese de partida era que categorias retóricas/sintáticas específicas —
paradoxo, zeugma, antítese etc. — se deslocariam em quantidades diferentes
no espaço de embedding. A primeira rodada piloto pareceu confirmar isso
claramente: *Paradoxo* teve a menor similaridade de cosseno do conjunto
(0,34–0,51 entre os três modelos), *Zeugma* a maior (0,87–0,88), e os três
modelos arquiteturalmente não relacionados (BGE-M3, LaBSE, EmbeddingGemma)
concordaram em ambos os extremos — um sinal promissor contra artefato de
modelo único.

**2. Controle de referência (5 pares sintéticos de paráfrase trivial).**
Para saber se essa dispersão era significativa, medimos um "piso" de
similaridade: pares que dizem a mesma coisa sem nenhuma complexidade
retórica pontuaram 0,95–0,97 entre os modelos. Convertendo a similaridade
de cada fenômeno em um z-score contra esse piso, 11 dos 12 fenômenos
originais se desviaram muito além do que o ruído amostral explicaria —
sinal real, não um artefato de n=12.

**3. Surge um confundidor: dependência de contexto.** A revisão manual
constatou que vários fragmentos dependem de contexto externo ao trecho
para serem totalmente interpretáveis (conectivos pressuposicionais como
"mas ainda", dêixis não resolvida, um interlocutor não identificado).
Dividindo os 12 pares por esse critério, apareceu uma diferença grande e
significativa — fragmentos dependentes de contexto tiveram similaridade
média de 0,57 contra 0,73 dos autocontidos (Mann-Whitney p≈0,004) — e 5
dos 6 fenômenos "lógico-pragmáticos" (incluindo a maioria dos exemplos de
paradoxo) também eram dependentes de contexto. As duas variáveis estavam
quase totalmente confundidas no conjunto de 12 pares: ainda não havia como
saber se era a própria figura retórica, ou o contexto ausente, que
explicava o efeito.

**4. A expansão do dataset (12 → 25 pares) quebra a hierarquia original.**
Adicionar mais exemplos de Paradoxo e Antítese (Camões, um segundo soneto
de Gregório de Matos) foi o teste direto desse confundidor. Resultado: a
hierarquia original não se sustentou. `matos_001` (Gregório de Matos,
*Paradoxo*, mas autocontido) obteve a **maior** similaridade média de todo
o dataset de 25 pares (0,889) — empatado com o melhor exemplo de Zeugma —
enquanto `vieira_002` (Padre Antônio Vieira, *Paradoxo*, dependente de
contexto) permaneceu o **menor** (0,393). Mesmo rótulo retórico, extremos
opostos da distribuição. Ser "um paradoxo" não prediz nada sozinho; o que
importa é se o trecho depende de contexto.

**5. Descartando um confundidor mais simples: comprimento do texto.**
Antes de aceitar a dependência de contexto como explicação, verificamos se
ela não era apenas um proxy de quanto a reescrita simplificada precisou se
expandir para compensar o que foi cortado. A diferença bruta de contagem
de caracteres entre o texto original e o simplificado *não* se
correlacionou significativamente com a similaridade, mas a razão de
expansão *proporcional* (comprimento simplificado / comprimento original)
se correlacionou — uma correlação negativa moderada (r≈−0,43 a −0,47,
p<0,05) nos três modelos: reescritas que precisaram se expandir
proporcionalmente mais tenderam a se afastar mais do original no espaço de
embedding.

**6. Dois fatores independentes, não um só.** Uma regressão múltipla
(`similaridade ~ razão_tamanho + dependia_contexto`) testou se essas duas
variáveis eram realmente efeitos separados ou se uma estava secretamente
absorvendo a outra. Ambas permaneceram estatisticamente significativas ao
controlar pela outra, em quase todas as combinações modelo/termo (R²
0,35–0,42), com apenas um caso limítrofe (o termo de razão de tamanho do
EmbeddingGemma, p≈0,05). Com n=25 e 2 preditores, isso é indicativo, não
conclusivo — mas apoia tratar dependência de contexto e expansão
proporcional de texto como dois contribuintes distintos e majoritariamente
independentes.

**Conclusão de trabalho atual:** a categoria retórica de um fragmento
(paradoxo, zeugma, antítese...) não prediz, por si só, o quanto um
embedding "se desloca" entre o original e sua reescrita simplificada. Dois
fatores mais fundamentais explicam melhor: (a) se o trecho depende de
contexto ausente do fragmento registrado, e (b) o quanto,
proporcionalmente, a reescrita simplificada precisou se expandir para
compensar o que foi cortado. Similaridade média entre os 25 pares, por
modelo, para referência:

| Modelo | Média | Desvio padrão |
|---|---|---|
| BGE-M3 | 0,7612 | 0,1100 |
| LaBSE | 0,7531 | 0,1526 |
| EmbeddingGemma | 0,7112 | 0,1445 |

O detalhamento estatístico completo (z-scores, os testes de Mann-Whitney,
as correlações de comprimento e as tabelas de regressão) está em
`results/phase1_embeddings/` e é percorrido passo a passo em
`notebooks/exploratory_analysis.ipynb`. Com n=25 pares no total, isso
permanece exploratório/gerador de hipóteses, não confirmatório — o próximo
passo natural é um dataset maior e balanceado entre categoria retórica ×
dependência de contexto × razão de expansão, para que cada fator possa ser
testado com poder estatístico real.

## Estrutura do projeto

```
archive/          código e dados do piloto descontinuado de interpretação
                  via LLM (fora do escopo ativo — veja docs/METHODOLOGY.md)
assets/           imagens estáticas (ex.: fotos do projeto)
data/
  raw/            textos originais extraídos, organizados por autor
  processed/      dataset final consolidado (.jsonl)
  annotation/     planilhas/CSVs de trabalho para revisão humana
src/
  dataset/        construção e validação do dataset (schema, CSV -> JSONL)
  embeddings/     modelos de embedding, similaridade de cosseno, pipeline principal
notebooks/        análise exploratória
docs/             METHODOLOGY.md, ANNOTATION_GUIDE.md
results/          saídas de experimentos, gráficos, tabelas
tests/            testes automatizados
```

## Configuração do ambiente

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

EmbeddingGemma (um dos três modelos de embedding) é um modelo com acesso
restrito: aceite a licença em
[google/embeddinggemma-300m](https://huggingface.co/google/embeddinggemma-300m)
e autentique-se com `huggingface-cli login` (ou defina `HF_TOKEN`, veja
`.env.example`) antes de rodar o pipeline com os três modelos de
embedding.

## Como executar

**Construir o dataset** a partir de uma planilha de anotação:

```bash
python -m src.dataset.csv_to_jsonl \
  --input data/annotation/dataset_v0_draft.csv \
  --output data/processed/dataset_v0.jsonl
```

Veja `data/annotation/exemplo.csv` para o formato de colunas esperado (uma
por campo de `DatasetEntry` em `src/dataset/schema.py`). Erros de
validação são coletados em todas as linhas e reportados juntos; o arquivo
`.jsonl` só é escrito se todas as linhas passarem na validação.

**Rodar os testes**:

```bash
pytest
```

**Gerar embeddings e calcular a similaridade de cosseno**:

```bash
# teste rápido de fumaça em um único par primeiro
python -m src.embeddings.run_phase1 --ids vieira_001 --output /tmp/test.csv

# execução completa
python -m src.embeddings.run_phase1
```

## Questão em aberto para trabalhos futuros

O achado sobre dependência de contexto acima tem um ângulo prático que
vale estudar separadamente: **trechos de texto precisam ser semanticamente
autocontidos para gerar embeddings confiáveis?** Vários fragmentos deste
dataset pontuaram baixa similaridade não pela complexidade retórica, mas
porque pressupõem contexto cortado pelo limite do trecho (um conectivo não
resolvido, dêixis, um interlocutor não identificado). Isso é
estruturalmente o mesmo problema que um pipeline de retrieval/chunking
enfrenta ao dividir um documento sem considerar se cada chunk se sustenta
sozinho — então o mesmo efeito medido aqui em fragmentos literários pode
ser relevante para como os limites de chunk são escolhidos em sistemas RAG
de forma mais geral. Isso ainda não foi testado em texto não literário nem
em diferentes estratégias de chunking; fica registrado aqui como uma
questão de acompanhamento, não uma afirmação.
