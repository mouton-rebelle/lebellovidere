import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Img from "gatsby-image"
import { HeaderContainer } from "./header.style"

const Header = ({ siteTitle, logo }) => (
  <HeaderContainer>
    <h1>
      <Link to="/">
        <Img {...logo} title={siteTitle} alt={siteTitle} />
      </Link>
    </h1>
    <nav>
      <ul>
        <li>
          <Link to="/programme" activeClassName="active">
            Le programme
          </Link>
        </li>
        <li>
          <Link to="/le-lieu" activeClassName="active">
            Le lieu
          </Link>
        </li>
      </ul>
    </nav>
  </HeaderContainer>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
