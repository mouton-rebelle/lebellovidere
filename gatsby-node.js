const path = require("path")
const fs = require("fs")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  return graphql(`
    query data {
      allMarkdownRemark {
        nodes {
          parent {
            ... on File {
              id
              name
              relativePath
            }
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
  `).then(result => {
    result.data.allMarkdownRemark.nodes.forEach(node => {
      let slug = node.parent.relativePath.replace(".md", "")
      if (slug.substring(slug.length - 5) === "index") {
        slug = slug.substring(0, slug.length - 5)
      }
      const temp = slug.split("/")
      console.log(temp)
      if (
        slug !== "" &&
        (temp.length < 3 || (temp[0] === "programme" && temp[2] === ""))
      ) {
        console.log(`/${slug}`)
        createPage({
          path: slug,
          component:
            temp.length === 3 && temp[0] === "programme"
              ? path.resolve("./src/components/programme.js")
              : path.resolve("./src/components/page.js"),
          context: {
            id: node.id,
            pathRegex: `/${slug}`,
          },
        })
      }
    })
  })
}
