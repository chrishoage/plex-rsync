import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import { fetchLibrary } from 'actions/libraryActions'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { Link } from 'react-router'

@connect(({entities, library}) => {
  return {
    entities,
    library
  }
})
class Library extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.any,
    library: PropTypes.object,
    entities: PropTypes.object
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { children, library, entities } = this.props

    const { key,
            title1,
            title2,
            librarySectionTitle,
            librarySectionID } = library.toJS()
    const directory = entities.getIn(['directories', key])

    return (<Row>
              <Col md={12}>
                <PageHeader>{library.size ? (<span>{title1} {title2 && <small>{title2}</small>}</span>) : 'Loading...'}</PageHeader>
                {library.size > 0 && <ol className="breadcrumb">
                                  <li><Link to="/library/sections">Plex Library</Link></li>
                                  {librarySectionID && <li><Link to={`/library/sections/${librarySectionID}`}>{librarySectionTitle}</Link></li>}
                                  {title1 && librarySectionTitle !== title1 && title1 !== 'Plex Library'
                                   && <li>{directory ? <Link to={`/library/metadata/${directory.get('parentRatingKey')}`}>{title1}</Link> : {title1}}</li>}
                                  {title2 && <li>{title2}</li>}
                                </ol>}
                {children}
              </Col>
            </Row>)
  }

}

export default Library
