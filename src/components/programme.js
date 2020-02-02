// ====================== LIBS
import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
// ====================== COMPONENTS
import SEO from "./seo"
// ====================== DATA

// ====================== TYPES

export default ({ data }) => {
  console.log(data)
  const shows = data.allMarkdownRemark.nodes
    .filter(show => show.frontmatter.dates !== null)
    .sort((a, b) => (a.frontmatter.dates[0] > b.frontmatter.dates[0] ? 1 : -1))
  const festivals = data.allMarkdownRemark.nodes.filter(
    show => show.frontmatter.dates === null
  )
  const festival = festivals[0]
  const images = data.allFile.nodes.map(n => n.childImageSharp.fluid)
  return (
    <React.Fragment>
      <SEO title={festival.frontmatter.title} />
      <h1>{festival.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: festival.html }} />
      {images.map((fluid, i) => (
        <Img key={i} fluid={fluid} />
      ))}
      {shows.map(show => (
        <div key={show.id}>
          <h1>{show.frontmatter.title}</h1>
          <div>
            {show.frontmatter.tags &&
              show.frontmatter.tags.map(tag => (
                <React.Fragment key={tag}>
                  <label>{tag}</label>&nbsp;
                </React.Fragment>
              ))}
          </div>
          <div dangerouslySetInnerHTML={{ __html: show.html }} />
        </div>
      ))}
    </React.Fragment>
  )
}
export const query = graphql`
  query($pathRegex: String!) {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: $pathRegex } }) {
      nodes {
        id
        html
        frontmatter {
          title
          tags
          dates
        }
      }
    }
    allFile(
      filter: { relativePath: { regex: $pathRegex }, extension: { eq: "jpg" } }
    ) {
      nodes {
        childImageSharp {
          fluid(maxWidth: 600) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`
