const fs = require("fs")
const slugify = require("slugify")
const rub = require("./spip_rubriques.json")
const articles = require("./spip_articles.json")
const utils = require("./utils.js")
const { cleanTexte, parseDate } = utils
// ====================== Tags map
const tags = new Map(
  require("./spip_mots.json")
    .filter(m => m.id_groupe === 2)
    .map(m => [m.id_mot, m.titre])
)

// ====================== Tags for shows
const tagsForArticle = require("./spip_mots_liens.json")
  .filter(ml => ml.objet === "article")
  .reduce((acc, ml) => {
    if (tags.has(ml.id_mot)) {
      if (!acc.has(ml.id_objet)) {
        acc.set(ml.id_objet, [tags.get(ml.id_mot)])
      } else {
        acc.set(ml.id_objet, [...acc.get(ml.id_objet), tags.get(ml.id_mot)])
      }
    }
    return acc
  }, new Map())
const basePath = "./importer/"

const targetPath = `${basePath}result/`
if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath)
if (!fs.existsSync(`${targetPath}programme/`))
  fs.mkdirSync(`${targetPath}programme/`)

function cleanRub(r) {
  let affiche = null
  const path = `${basePath}IMG/rubon${r.id_rubrique}`
  if (fs.existsSync(`${path}.jpg`)) {
    affiche = `${path}.jpg`
  } else if (fs.existsSync(`${path}.gif`)) {
    affiche = `${path}.gif`
  } else if (fs.existsSync(`${path}.png`)) {
    affiche = `${path}.png`
  }
  const slug = slugify(r.titre.replace(/'/g, "-").toLowerCase())
  return {
    id: r.id_rubrique,
    slug,
    title: r.titre.replace(/\//g, ""),
    text: cleanTexte(r.texte),
    affiche,
    path: `${targetPath}programme/${slug}/`,
  }
}
const festivals = rub.filter(r => r.id_rubrique > 7).map(cleanRub)
const shows = articles
  .filter(
    article =>
      article.statut === "publie" &&
      festivals.filter(f => f.id === article.id_rubrique).length === 1
  )
  .map(article => {
    const filteredFestivals = festivals.filter(
      f => f.id === article.id_rubrique
    )
    const festival = filteredFestivals[0]
    const path = `${basePath}IMG/arton${article.id_article}`
    if (fs.existsSync(`${path}.jpg`)) {
      affiche = `${path}.jpg`
    } else if (fs.existsSync(`${path}.gif`)) {
      affiche = `${path}.gif`
    } else if (fs.existsSync(`${path}.png`)) {
      affiche = `${path}.png`
    }
    return {
      id: article.id_article,
      title: article.titre,
      affiche,
      subtitle: article.soustitre,
      festival,
      slug: slugify(article.titre.toLowerCase()),
      dates: parseDate(article.chapo, festival.slug),
      text: cleanTexte(article.texte),
      tags: tagsForArticle.get(article.id_article),
    }
  })

// ====================== IMPORT FESTIVALS

festivals.forEach(f => {
  if (!fs.existsSync(f.path)) fs.mkdirSync(f.path)
  fs.writeFileSync(
    `${f.path}index.md`,
    `
---
  title: ${f.title}
---

${f.text}
`
  )

  if (f.affiche !== null) {
    fs.copyFileSync(f.affiche, `${f.path}affiche.jpg`)
  }
  // ====================== IMPORT SHOWS
  shows
    .filter(s => s.festival.id === f.id)
    .forEach(s => {
      fs.writeFileSync(
        `${f.path}${s.slug}.md`,
        `---
title: ${s.title.replace(":", " - ")}${
          s.tags && s.tags.length > 0
            ? `
tags: 
${s.tags.map(t => `  - ${t}`).join("\n")}`
            : ""
        }${
          s.dates.length === 0
            ? ""
            : `
dates:
${s.dates.map(t => `  - ${t}`).join("\n")}`
        }
---

${s.text}
`
      )
      if (s.affiche !== null) {
        fs.copyFileSync(s.affiche, `${f.path}${s.slug}.jpg`)
      }
    })
})
