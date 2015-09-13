import React, { PropTypes } from 'react'
import { Glyphicon, Well, ButtonGroup, Button, ProgressBar, PageHeader, Row, Col } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'

const PROGRESS_LABEL_DEVIDER = 1000000 // GB

class DestInfo {

  static propTypes = {
    updateDest: PropTypes.func,
    startJob: PropTypes.func,
    dest: PropTypes.object,
    addedSize: PropTypes.number
  }

  static defaultProps = {
    addedSize: 0
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onChangeDest() {
    const { updateDest } = this.props
    updateDest({confirmed: false})
  }

  sizeWarningStates(percent) {
    if (percent > 1) {
      return 'danger'
    } else if (percent > 0.75) {
      return 'warning'
    }

    return 'success'
  }

  render() {
    const { dest: { path, used, total }, addedSize, startJob } = this.props
    // Plex is reporting in bytes, df is reporting in kilobtyes
    const displayUsed = (addedSize / 1000) + used
    const percentUsed = displayUsed / total

    return (<Col md={12} style={{position: 'fixed', backgroundColor: '#FFF', zIndex: 1}}>
              <PageHeader>{path}</PageHeader>
              <ProgressBar striped bsStyle={this.sizeWarningStates(percentUsed)} now={displayUsed} max={total} label={`${Math.round(displayUsed / PROGRESS_LABEL_DEVIDER)}GB used / ${Math.round(total / PROGRESS_LABEL_DEVIDER)}GB`} />
              <ButtonGroup>
                <Button onClick={::this.onChangeDest}><Glyphicon glyph="edit" /> Change Destination</Button>
                <Button onClick={startJob}><Glyphicon glyph="transfer" /> Start Sync Job</Button>
              </ButtonGroup>
            </Col>)
  }

}

export default DestInfo
