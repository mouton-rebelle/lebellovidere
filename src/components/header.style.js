import styled from "styled-components"

export const HeaderContainer = styled.header`
  background-color: crimson;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.6);
  display: flex;
  padding: 0.6rem 2rem;
  margin: 0;
  align-items: center;
  font-size: 1.2rem;
  nav li {
    display: inline-block;
    margin-left: 1rem;
    a {
      display: block;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      text-decoration: none;
      color: #fff;
      background-color: hsla(0, 0%, 0%, 0);
      transition: background-color ease-in-out 0.3s;
      &.active,
      &:hover,
      &:visited:hover {
        background-color: hsla(0, 0%, 0%, 0.4);
      }
    }
  }
`
