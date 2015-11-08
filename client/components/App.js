import React, { Component } from 'react'
import { Grid, Navbar, Nav, NavItem, NavBrand } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { LinkContainer } from 'react-router-bootstrap'

class App extends Component {

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (<Grid fluid={true} style={{paddingTop: '40px'}}>
              <Navbar fixedTop={true} fluid={true}>
                <NavBrand>Plex Rsync</NavBrand>
                <Nav>
                  <LinkContainer to="/library/sections"><NavItem>Start Job</NavItem></LinkContainer>
                  <LinkContainer to="/jobs"><NavItem>Running Jobs</NavItem></LinkContainer>
                </Nav>
              </Navbar>
              {this.props.children}
            </Grid>)
  }

}

export default App
