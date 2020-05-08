// ====================== LIBS
import React from "react"
import { graphql } from "gatsby"
// ====================== COMPONENTS
import Layout from "./layout"
import Seo from "./seo"
// ====================== DATA

// ====================== TYPES

export default ({ data }) => {
  console.log(data)
  const { html, frontmatter } = data.markdownRemark
  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      <Seo title={frontmatter.title} />
      <div>
        {frontmatter.tags &&
          frontmatter.tags.map((tag) => (
            <React.Fragment key={tag}>
              <label>{tag}</label>&nbsp;
            </React.Fragment>
          ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        dates
        tags
        title
      }
    }
  }
`
