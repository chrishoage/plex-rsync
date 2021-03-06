import React, { PropTypes, Component } from 'react'
import { Glyphicon, Button, ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { LinkContainer } from 'react-router-bootstrap'

class LibraryBrowser extends Component {

  static propTypes = {
    location: PropTypes.object,
    list: PropTypes.object,
    copyList: PropTypes.array,
    addMedia: PropTypes.func.isRequired,
    removeMedia: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onToggleMedia(metadata, hasCopyList) {
    const { addMedia, removeMedia } = this.props

    return (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (hasCopyList) {
        removeMedia(metadata)
      } else {
        addMedia(metadata)
      }
    }
  }

  render() {
    const { list, copyList } = this.props
    return (<ListGroup style={{marginTop: '20px'}}>
              {list && list.toJSON().map(({ratingKey, title}, i) => {
                const hasCopyList = copyList.includes(ratingKey)
                return (<LinkContainer key={ratingKey} to={`/library/metadata/${ratingKey}`}>
                          <ListGroupItem><Glyphicon glyph={hasCopyList ? 'minus' : 'plus'} onClick={this.onToggleMedia(ratingKey, hasCopyList)} /> {title}</ListGroupItem>
                        </LinkContainer>)
              })}
            </ListGroup>)
  }

}

export default LibraryBrowser
