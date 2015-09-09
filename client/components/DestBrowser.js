import React, { PropTypes } from 'react'
import { Well, ListGroup, ListGroupItem, PageHeader, Row, Col, Button } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'

const ROOT_PATH_LABEL = 'All Drives'

class DestBrowser {

  static propTypes = {
    path: PropTypes.string.isRequired,
    results: PropTypes.object.isRequired,
    fetchDest: PropTypes.func.isRequired,
    updateDest: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    const { fetchDest, path } = this.props
    fetchDest({path})
  }

  componentDidUpdate(prevProps) {
    const { path: prevPath } = prevProps
    const { fetchDest, path } = this.props

    if (prevPath !== path) fetchDest({path})

  }

  onSetDest(dest) {
    const { updateDest } = this.props
    return (event) => {
      event.preventDefault()
      updateDest(dest)
    }
  }

  onUpDest() {
    const { updateDest, path } = this.props
    updateDest({path: this.walkPath(-1)})
  }

  onConfirmDest() {
    const { updateDest } = this.props
    updateDest({confirmed: true})
  }

  walkPath(i) {
    const { path } = this.props
    if (path === '/') return ''
    const splitPath = path.split('/')
    return splitPath.slice(0, i).join('/') || '/'
  }

  render() {
    const { results, path } = this.props
    const hasPath = path !== ''
    const splitPath = hasPath ? path.split('/') : [ROOT_PATH_LABEL]
    return (<Col md={12}>
              <PageHeader>Pick a destination folder</PageHeader>
              <ol className="breadcrumb">
              {splitPath.map((part, i) =>
                <li key={i}>{splitPath.length - 1 === i ? <span>{part}</span>
                                                : <a href="#" onClick={this.onSetDest({path: ::this.walkPath(i + 1)})}>{part === '' ? '/' : part}</a>
                    }
                </li>
              )}
              </ol>
              <ListGroup>
                {hasPath ? <ListGroupItem key="up" href="#" onClick={::this.onUpDest}>..</ListGroupItem> : {/*ListGroup can't take anything other than a react element as a child*/}}
                {results.map((result, i) =>
                  <ListGroupItem key={result.path} href="#" onClick={this.onSetDest(result)}>{result.path}</ListGroupItem>
                )}
              </ListGroup>
              <Button bsStyle="primary" onClick={::this.onConfirmDest}>Set Destination</Button>
            </Col>)
  }

}

export default DestBrowser
