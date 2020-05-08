/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import Header from "./header"
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { GlobalStyle, Container } from "./layout.style"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
      logo: file(relativePath: { eq: "bellovidere-logo.png" }) {
        childImageSharp {
          fixed(width: 145) {
            height
            src
            srcSet
            srcSetWebp
            srcWebp
            tracedSVG
            width
            base64
            aspectRatio
          }
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <GlobalStyle />
      <Header
        siteTitle={data.site.siteMetadata.title}
        logo={data.logo.childImageSharp}
      />
      <Container>
        <main>{children}</main>
      </Container>
      <footer>© {new Date().getFullYear()}</footer>
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
