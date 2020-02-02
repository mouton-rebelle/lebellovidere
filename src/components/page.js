// ====================== LIBS
import React from "react"
import { graphql } from "gatsby"
// ====================== COMPONENTS

// ====================== DATA

// ====================== TYPES

export default ({ data }) => {
  console.log(data)
  const { html, frontmatter } = data.markdownRemark
  return (
    <React.Fragment>
      <h1>{frontmatter.title}</h1>
      <div>
        {frontmatter.tags &&
          frontmatter.tags.map(tag => (
            <React.Fragment key={tag}>
              <label>{tag}</label>&nbsp;
            </React.Fragment>
          ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </React.Fragment>
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
