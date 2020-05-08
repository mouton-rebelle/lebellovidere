// ====================== LIBS
import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
// ====================== COMPONENTS
import SEO from "./seo"
import Layout from "./layout"
import { ShowContainer } from "./show.style"
// ====================== DATA

// ====================== TYPES

export default ({ data, pageContext, location }) => {
  console.log(data, pageContext, location)
  const shows = data.allMarkdownRemark.nodes.filter(
    (show) => show.fields.kind === "show"
  )
  const show = shows.find((show) => show.fields.slug === location.pathname)

  const festival = data.allMarkdownRemark.nodes.find(
    (show) => show.fields.kind === "festival"
  )

  return (
    <Layout>
      <SEO title={festival.frontmatter.title} />
      <h2>{festival.frontmatter.title}</h2>
      <h1>{show.frontmatter.title}</h1>
      <ShowContainer>
        <div>
          <Img {...data.festivalLogo} />
          <div dangerouslySetInnerHTML={{ __html: festival.html }} />
          {shows.map((show) => (
            <div key={show.id}>
              <Link to={show.fields.slug}>{show.frontmatter.title}</Link>
            </div>
          ))}
        </div>
        <div>
          <div>
            <div>
              {show.frontmatter.tags &&
                show.frontmatter.tags.map((tag) => (
                  <React.Fragment key={tag}>
                    <label>{tag}</label>&nbsp;
                  </React.Fragment>
                ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: show.html }} />
          </div>
        </div>
        <Img {...data.showLogo} />
      </ShowContainer>
    </Layout>
  )
}
export const query = graphql`
  query($festivalHome: String!, $imgId: String, $festivalImgId: String) {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: $festivalHome } }) {
      nodes {
        id
        html
        fields {
          slug
          kind
        }
        frontmatter {
          title
          tags
          dates
        }
      }
    }
    showLogo: imageSharp(id: { eq: $imgId }) {
      fluid(maxWidth: 510) {
        ...GatsbyImageSharpFluid
      }
    }
    festivalLogo: imageSharp(id: { eq: $festivalImgId }) {
      fluid(maxWidth: 510) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`
