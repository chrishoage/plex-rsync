import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon, ButtonGroup, Button, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import LibraryBrowser from 'components/LibraryBrowser'
import * as libraryActions from 'actions/libraryActions'
import { libraryResultsSelector } from 'selectors'

@connect(libraryResultsSelector, libraryActions)
class MediaContainer extends Component {

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

  toggleAllMedia() {
    const { addAllMedia, removeAllMedia, list, copyList } = this.props
    if (copyList.length) {
      removeAllMedia()
    } else {
      const metadataIds = list.map((l) => l.get('ratingKey')).toJS()

      addAllMedia(metadataIds)
    }
  }

  render() {
    const { list, copyList, ...actions } = this.props
    const hasCopyList = copyList && copyList.length

    return (<Row>
              <Col md={12}>
                <ButtonGroup>
                  <Button onClick={::this.toggleAllMedia}><Glyphicon glyph={hasCopyList ? 'minus' : 'plus'} /> {hasCopyList ? 'Remove' : 'Add'} All Media</Button>
                </ButtonGroup>
                <LibraryBrowser list={list} copyList={copyList} {...actions} />
              </Col>
            </Row>)
  }

}

export default MediaContainer
