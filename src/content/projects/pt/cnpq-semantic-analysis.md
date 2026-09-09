---
title: "Estágio"
summary: "Pipeline de ciência de dados para agrupamento temático de projetos de pesquisa financiados pelo CNPq, a partir de embeddings semânticos gerados com o modelo BGE-M3."
stack: ["Python", "UMAP", "HDBSCAN", "K-Means", "PCA", "Plotly", "Pandas"]
status: "in progress"
metrics: []
date: 2026-09-01
featured: false
---

**Cargo/Área:** Estagiária de Ciência de Dados e Inteligência Artificial — Coordenação de Engenharias (COENG), CNPq

**Status:** Em andamento

**Foco:** embeddings semânticos, redução de dimensionalidade, clusterização
não supervisionada, visualização interativa de dados, segurança e
governança de dados no setor público.

**Tecnologias:** Python · UMAP · HDBSCAN · K-Means · PCA · Plotly · Pandas

## Contexto

- **DCTI** — Diretoria Científica do CNPq. Conduz os processos de avaliação, acompanhamento e fomento à ciência, tecnologia e inovação nas diversas grandes áreas do conhecimento, sendo dividida em coordenações-gerais temáticas (como Engenharias e Tecnologias, Ciências Exatas, Ciências Humanas e Sociais, Ciências Agrárias, entre outras).
- **CGETE** — Coordenação-Geral de Engenharias e Tecnologias. Integra a DCTI e concentra as atividades relacionadas às áreas de engenharia.
- **COENG** — Coordenação de Engenharias. Unidade vinculada à CGETE, atua na gestão e acompanhamento de bolsas, auxílios e editais de fomento voltados às diferentes subáreas da Engenharia — como Engenharias Elétrica, Mecânica, Civil, de Produção, entre outras —, incluindo a análise de propostas, o acompanhamento de projetos financiados e o suporte técnico aos comitês assessores dessas áreas.

## Projetos

Desenvolvimento de um **pipeline de ciência de dados para agrupamento temático de projetos de pesquisa financiados pelo CNPq**, a partir de embeddings semânticos gerados com o modelo BGE-M3. O projeto envolve redução de dimensionalidade (PCA, UMAP) e clusterização não supervisionada (K-Means, HDBSCAN) para identificar agrupamentos temáticos entre milhares de projetos, com posterior interpretação dos clusters e visualização interativa dos resultados.

**Todo o trabalho é conduzido em ambiente restrito (JupyterLab local, sem acesso irrestrito à internet), exigindo soluções adaptadas às limitações de infraestrutura, demonstrando alinhamento com boas práticas de segurança e governança de dados no setor público.**

## Habilidades técnicas adquiridas

### Machine Learning / NLP

- Seleção crítica de modelos de embedding, avaliando trade-offs entre dimensão, limite de contexto, tamanho de parâmetros e suporte multilíngue
- Aplicação de requisitos específicos de modelo (ex: prefixo obrigatório da família E5) que afetam qualidade de forma não-óbvia
- Diagnóstico de anisotropia em embeddings através de evidência estatística (distribuição de similaridades, desvio padrão)

### Rigor metodológico

- Fundamentação teórica de problemas observados via literatura acadêmica antes de aplicar correções
- Validação empírica de hipóteses com métricas concretas antes/depois
- Identificação de que uma correção estatisticamente positiva em média pode distorcer resultados individuais, comprovado com experimento controlado

### Engenharia de pipelines de dados

- Design de pipelines reprodutíveis, com versionamento de saídas por modelo e execução independente de células entre sessões
- Debugging sistemático de erros (caminhos de arquivo, nomes de campo, desalinhamento de dados)
- Garantia de consistência de transformações entre geração e uso posterior dos dados

### Comunicação técnica

- Documentação técnica de decisões e resultados de experimentos em formato claro e replicável
- Tradução de achados técnicos complexos em explicações acessíveis para relatórios institucionais
