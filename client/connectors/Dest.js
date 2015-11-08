import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as destActions from 'actions/destActions'
import * as rsyncActions from 'actions/rsyncActions'
import { Well, ListGroup, ListGroupItem, PageHeader, Row, Col } from 'react-bootstrap'
import DestBrowser from 'components/DestBrowser'
import DestInfo from 'components/DestInfo'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { destInfoSelector } from 'selectors'

@connect(destInfoSelector)
class Dest extends Component {

  static propTypes = {
    dest: PropTypes.object.isRequired,
    addedUsed: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { addedUsed, dest, dest: {confirmed, results, path }, dispatch } = this.props

    const boundActions = bindActionCreators({...destActions, ...rsyncActions}, dispatch)

    return (<Row style={{paddingBottom: confirmed ? '200px' : 0}}>
              {confirmed ? <DestInfo dest={dest} addedSize={addedUsed} {...boundActions} />
                         : <DestBrowser results={results} path={path} {...boundActions} />}
            </Row>)
  }

}

export default Dest
