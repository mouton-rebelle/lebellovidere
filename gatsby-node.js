const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require("fs")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const getImageIdForSlug = (nodes, slug) => {
  const filtered = nodes.filter(
    (node) => node.parent.relativePath.indexOf(slug.substr(1)) !== -1
  )
  if (filtered.length === 1) {
    return filtered[0].id
  }
  return null
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` }).replace(
      "/index/",
      "/"
    )
    const isFestival = node.fileAbsolutePath.indexOf("index.md") !== -1
    const isProgramme = node.fileAbsolutePath.indexOf("/programme/") !== -1
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    createNodeField({
      node,
      name: `kind`,
      value: !isProgramme ? "page" : isFestival ? "festival" : "show",
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  return graphql(`
    query data {
      allImageSharp {
        nodes {
          id
          parent {
            ... on File {
              id
              name
              relativePath
            }
          }
        }
      }
      allMarkdownRemark {
        nodes {
          fields {
            kind
            slug
          }
          frontmatter {
            dates
            tags
            title
          }
          id
          html
        }
      }
    }
  `).then((result) => {
    result.data.allMarkdownRemark.nodes.forEach((node) => {
      const kind = node.fields.kind
      let imgSlug = null
      let img = null
      if (kind === "festival") {
        imgSlug = `${node.fields.slug}/affiche`
      }
      if (kind === "show") {
        imgSlug = node.fields.slug.substr(0, node.fields.slug.length - 1)
      }
      img = result.data.allImageSharp.nodes.find(
        (node) => node.parent.relativePath.indexOf(imgSlug) !== -1
      )
      const festivalSlug = [
        ...node.fields.slug.split("/").slice(0, -2),
        "",
      ].join("/")
      createPage({
        path: node.fields.slug,
        component:
          kind === "festival"
            ? path.resolve("./src/components/festival.js")
            : kind === "show"
            ? path.resolve("./src/components/show.js")
            : path.resolve("./src/components/page.js"),
        context: {
          festivalHome: festivalSlug,
          festivalImgId: getImageIdForSlug(
            result.data.allImageSharp.nodes,
            `${festivalSlug}affiche`
          ),
          kind,
          imgId:
            kind === "show"
              ? getImageIdForSlug(
                  result.data.allImageSharp.nodes,
                  node.fields.slug.substr(0, node.fields.slug.length - 1)
                )
              : null,
        },
      })
    })
  })
}
