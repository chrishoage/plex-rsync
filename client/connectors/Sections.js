import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import { fetchLibrary } from 'actions/libraryActions'
import shouldPureComponentUpdate from 'react-pure-render/function'
import Link from 'components/Link'
import { librarySectionsSelector } from 'selectors'

@connect(librarySectionsSelector, {fetchLibrary})
class Sections {

  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    list: PropTypes.object
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    const { fetchLibrary } = this.props
    console.log('Sections mounted')
    fetchLibrary()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Sections updated')
  }

  render() {
    const { list } = this.props
    return (<Row>
              <Col md={12}>
                <ListGroup>
                  {list && list.map((result, i) =>
                    <Link component={ListGroupItem} key={result.get('key')} to={`/library/sections/${result.get('key')}`}>
                      {result.get('title')}
                    </Link>)}
                </ListGroup>
              </Col>
            </Row>)
  }

}

export default Sections
