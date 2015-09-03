import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon, ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import { fetchSection, addAllMedia } from 'actions/libraryActions'
import shouldPureComponentUpdate from 'react-pure-render/function'
import Link from 'components/Link'
import LibraryBrowser from 'components/LibraryBrowser'

@connect(({library}) => {
  const copyKeys = library.get('copyKeys')
  const entityKey = library.hasIn(['result', 'directories']) ? 'directories' : 'videos'
  const entities = library.getIn(['entities', entityKey])
  const results = library.getIn(['result', entityKey])
  if (!entities || !results) return {}
  const videos = library.getIn(['entities', 'videos'])
  const copyVideos = copyKeys.map((key) => videos.get(key))
  const list = results.map((key) => entities.get(key))
  const copyList = copyVideos.reduce((coll, key, val) => {
    const {ratingKey, parentRatingKey, grandparentRatingKey} = val.toJS()
    return coll.concat(ratingKey, parentRatingKey, grandparentRatingKey)
  }, [])
  return {
    list,
    copyList
  }
})
class Section {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    const { dispatch, params: { section } } = this.props
    if (section) dispatch(fetchSection(section))
  }

  componentDidUpdate(prevProps) {
    const { params: { section: prevSection } } = prevProps
    const { dispatch, params: { section } } = this.props

    if (section && prevSection !== section) dispatch(fetchSection(section))
  }


  render() {
    const { list, copyList, dispatch } = this.props
    const boundActions = bindActionCreators({addAllMedia}, dispatch)
    return (<Row>
              <Col md={12}>
                <LibraryBrowser list={list} copyList={copyList} {...boundActions} />
              </Col>
            </Row>)
  }

}

export default Section
