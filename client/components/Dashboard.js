import React, { Component, PropTypes } from 'react'
import { ListGroup, ListGroupItem, PageHeader, Row, Col } from 'react-bootstrap'
import Dest from 'connectors/Dest'
import Library from 'connectors/Library'
import shouldPureComponentUpdate from 'react-pure-render/function'

class Dashboard extends Component {

  static propTypes = {
    children: PropTypes.any
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (<div>
              <Dest {...this.props} />
              <Library {...this.props} />
            </div>)
  }

}

export default Dashboard
