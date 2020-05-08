import styled, { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle` 
:root {
  color-scheme: light dark;
  --bg-color:hsla(217, 86%, 18%, 0.05);
  --border-color: black;
}
@media (prefers-color-scheme: dark) {
  :root {
      --bg-color: hsla(217, 86%, 18%, 1.000);
      --border-color: white;
  }
}

html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: var(--bg-color);
}

blockquote{
  border-left: 1px solid crimson;
  display: block;
  margin: 1em 0;
  font-family: Georgia, "Times New Roman", serif;
  padding-left: 1em;
  cite{
    color: crimson;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0.3em
  }
}

`

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1080px;
  padding: 0 1em;
  p,
  ul,
  li {
    line-height: 1.2em;
    margin-bottom: 1em;
  }
  blockquote p {
    line-height: 1.5rem;
  }
`
