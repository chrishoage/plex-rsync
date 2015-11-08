import React, { Component, PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import JobListItem from './JobListItem'

class JobList extends Component {

  static propTypes = {
    children: PropTypes.any,
    removeJob: PropTypes.func,
    list: PropTypes.object
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { list, removeJob } = this.props
    return (<Table>
              <thead>
                <tr>
                  <th>Controls</th>
                  <th>id</th>
                  <th>pid</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((job) => <JobListItem job={job} removeJob={removeJob} />)}
              </tbody>
            </Table>)
  }

}

export default JobList
