import React from 'react'
import { Redirect, Router, Route } from 'react-router'
import { createHashHistory } from 'history'

import App from 'components/App'
import Dashboard from 'components/Dashboard'
import Library from 'connectors/Library'
import Sections from 'connectors/Sections'
import RunningJobs from 'connectors/RunningJobs'
import MediaContainer from 'connectors/MediaContainer'

export default (<Router history={createHashHistory()}>
      <Route component={App}>
        <Route path="library" component={Dashboard}>
            <Route path="sections" component={Sections} />
            <Route path=":section/:id" component={MediaContainer} />
            <Route path=":section/:id" component={MediaContainer} />
        </Route>
        <Route path="jobs" component={RunningJobs} />
        <Redirect from="/" to="/library/sections"  />
      </Route>
    </Router>)
