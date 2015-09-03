import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon, ButtonGroup, Button, Table, PageHeader, Row, Col, Nav, NavItem } from 'react-bootstrap'
import JobList from 'components/JobList'
import { fetchLibrary } from 'actions/libraryActions'
import * as rsyncActions from 'actions/rsyncActions'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { Link } from 'react-router'
import { runningJobsSelector } from 'selectors'

@connect(runningJobsSelector, rsyncActions)
class RunningJobs {

  static propTypes = {
    children: PropTypes.any,
    jobList: PropTypes.object,
    runningJobsCount: PropTypes.number
  }

  componentDidMount() {
    const { fetchJobs } = this.props
    fetchJobs()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { children, jobList, runningJobsCount, removeJob } = this.props
    console.log('result', jobList)
    return (<Row>
              <Col md={12}>
                <PageHeader>{runningJobsCount} Running Jobs</PageHeader>
                <JobList list={jobList} removeJob={removeJob} />
              </Col>
            </Row>)
  }

}

export default RunningJobs
