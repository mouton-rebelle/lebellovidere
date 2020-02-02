const slugify = require("slugify")
const Luxon = require("luxon")

function cleanTexte(t) {
  const h3 = /{{{(.*?)}}}/gm
  const strong = /{{(.*?)}}/gm
  const italic = /{(.*?)}/gm

  return t
    .replace(h3, (match, firstGroup) => {
      return `### ${firstGroup}\n`
    })
    .replace(strong, (match, firstGroup) => {
      return `**${firstGroup}**`
    })
    .replace(italic, (match, firstGroup) => {
      return `*${firstGroup}*`
    })
}

function parseDateLine(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(slugify)
    .filter(
      c =>
        c !== "" &&
        c !== "le" &&
        c !== "les" &&
        c !== "a" &&
        c !== "-" &&
        c !== "_"
    )
}

const months = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
]
const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
]

function guessHour(parts) {
  const temp = parts.filter(p => p.indexOf("h") === p.length - 1)
  return parseInt(temp[0])
}
function guessDays(parts) {
  return parts
    .filter(p => parseInt(p) == p)
    .map(p => parseInt(p))
    .filter(p => p > 0 && p < 32)
}

function parseDate(text, slug) {
  const regex = /\d{4}/gm
  const match = regex.exec(slug)
  if (match === null) return []
  const year = parseInt(match[0])
  let dates = []
  text
    .split("\n")
    .map(parseDateLine)
    .forEach(parts => {
      const matchingMonths = parts.filter(p => months.includes(p))
      if (matchingMonths.length > 0) {
        const monthIndex = matchingMonths[0]
        const month = months.indexOf(monthIndex) + 1
        const filteredParts = parts.filter(
          p => !months.includes(p) && !days.includes(p)
        )
        const hour = guessHour(filteredParts)
        guessDays(filteredParts).map(day => {
          const d = Luxon.DateTime.utc(
            slug.indexOf("hiver") !== -1 && month < 8 ? year + 1 : year,
            month,
            day,
            hour
          )
          if (d.isValid) dates.push(d.toFormat("yyyy-LL-dd HH:mm:ss"))
        })
      }
    })
  return dates
}

module.exports = { parseDate, cleanTexte }
