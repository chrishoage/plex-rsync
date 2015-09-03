import React, { PropTypes, Component } from 'react'
import { Glyphicon, ButtonGroup, Button, Modal } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'

const { Body } = Modal

class JobListItem extends Component {

  static propTypes = {
    job: PropTypes.object
  }

  state = {
    isModalOpen: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  handleOpenModal() {
    this.setState({isModalOpen: true})
  }


  handleCloseModal() {
    this.setState({isModalOpen: false})
  }

  render() {
    const { job, removeJob } = this.props
    const isCompleted = job.get('status') === 'COMPLETED'
    return (<tr>
              <td>
                <ButtonGroup>
                  <Button onClick={() => removeJob(job.get('id'))}><Glyphicon glyph={isCompleted ? 'remove' : 'stop'} /></Button>
                  <Button onClick={::this.handleOpenModal}><Glyphicon glyph="info-sign" /></Button>
                  <Modal show={this.state.isModalOpen} onHide={::this.handleCloseModal}>
                    <Body><pre>{job.get('output')}</pre></Body>
                  </Modal>
                </ButtonGroup>
              </td>
              <td>{job.get('id')}</td>
              <td>{job.get('pid')}</td>
              <td>{job.get('status')}</td>
            </tr>)
  }

}

export default JobListItem
