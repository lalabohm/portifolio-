# Portfólio

Site estático feito em [Astro](https://astro.build) + Tailwind, publicado via GitHub Pages.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:4321`.

## Antes do primeiro deploy

1. Em `astro.config.mjs`, troque `site` pela sua URL final (`https://SEU-USUARIO.github.io`).
   - Se o repositório se chamar `SEU-USUARIO.github.io`, **apague a linha `base`**.
   - Se tiver outro nome (ex: `portfolio`), mantenha `base: '/portfolio/'` com o nome certo.
2. Troque `seu-usuario` / `seu-nome` nos componentes `Header.astro` e `Footer.astro`.
3. Ajuste os links de repositório em `src/content/projects/*.md`.

## Publicar

```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/SEU-USUARIO/portfolio.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source → GitHub Actions**. O workflow em
`.github/workflows/deploy.yml` já faz build e publica a cada push na `main`.

## Adicionar conteúdo

- **Novo projeto**: crie um `.md` em `src/content/projects/` seguindo o
  frontmatter dos exemplos existentes.
- **Novo writeup de CTF**: crie um `.md` em `src/content/writeups/`.

Nenhum código de página precisa mudar — as listagens e páginas individuais
são geradas automaticamente a partir do conteúdo.
