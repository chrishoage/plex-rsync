import React from 'react'
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap'
import { RouteHandler }  from 'react-router'
import shouldPureComponentUpdate from 'react-pure-render/function'
import Link from './Link'

class App {

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (<Grid fluid={true} style={{paddingTop: '40px'}}>
              <Navbar brand="Plex Rsync" fixedTop={true} fluid={true}>
                <Nav>
                  <Link component={NavItem} to="/library/sections">Start Job</Link>
                  <Link component={NavItem} to="/jobs">Running Jobs</Link>
                </Nav>
              </Navbar>
              {this.props.children}
            </Grid>)
  }

}

export default App
