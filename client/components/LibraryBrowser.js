import React, { PropTypes } from 'react'
import { Glyphicon, Button, ListGroup, ListGroupItem, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import Link from './Link'

class LibraryBrowser {

  static propTypes = {
    location: PropTypes.object,
    list: PropTypes.object,
    copyList: PropTypes.array,
    addAllMedia: PropTypes.func.isRequired,
    removeAllMedia: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onToggleMedia(metadata, hasCopyList) {
    const { addAllMedia, removeAllMedia } = this.props

    return (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (hasCopyList) {
        removeAllMedia(metadata)
      } else {
        addAllMedia(metadata)
      }
    }
  }

  addAllMedia() {
    const { list, addMedia } = this.props
    const keys = list.map((l) => l.get('ratingKey')).toJSON()
    console.log('addAllMedia', keys)
    addMedia({keys})
  }

  render() {
    const { list, copyList } = this.props
    return (<div>
            <Button onClick={::this.addAllMedia}>Add All Movies</Button>
            <ListGroup>
              {list && list.toJSON().map(({ratingKey, title}, i) => {
                const hasCopyList = copyList.includes(ratingKey)
                return (<Link component={ListGroupItem} key={ratingKey} to={`/library/metadata/${ratingKey}`}>
                          <Glyphicon glyph={hasCopyList ? 'minus' : 'plus'} onClick={this.onToggleMedia(ratingKey, hasCopyList)} /> {title}
                        </Link>)
              })}
            </ListGroup>
            </div>)
  }

}

export default LibraryBrowser
