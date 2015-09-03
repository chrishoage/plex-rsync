import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon, ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import Link from 'components/Link'
import LibraryBrowser from 'components/LibraryBrowser'
import { fetchMetadata, fetchSection, addAllMedia, removeAllMedia } from 'actions/libraryActions'
import { libraryResultsSelector } from 'selectors'

@connect(libraryResultsSelector, { fetchMetadata, fetchSection, addAllMedia, removeAllMedia })
class MediaContainer {

  static propTypes = {
    result: PropTypes.object,
    params: PropTypes.object,
    fetchMetadata: PropTypes.func,
    fetchSection: PropTypes.func,
    addAllMedia: PropTypes.func,
    removeAllMedia: PropTypes.func,
    list: PropTypes.object,
    copyList: PropTypes.array
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { params: { section: prevSection, id: prevId } } = prevProps
    const { fetchMetadata, params: { section, id } } = this.props

    if (id && prevId !== id || prevSection !== section) this.fetchData()
  }

  fetchData() {
    const { fetchMetadata, fetchSection, params: { section, id } } = this.props

    switch (section) {
      case 'sections':
        fetchSection(id)
        break
      case 'metadata':
        fetchMetadata(id)
        break
    }
  }

  render() {
    const { list, copyList, addAllMedia, removeAllMedia } = this.props

    return (<Row>
              <Col md={12}>
                <LibraryBrowser list={list} copyList={copyList} addAllMedia={addAllMedia} removeAllMedia={removeAllMedia} />
              </Col>
            </Row>)
  }

}

export default MediaContainer
