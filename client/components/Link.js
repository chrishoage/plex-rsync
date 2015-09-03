import React from 'react'

const { object, string, func, any, bool } = React.PropTypes

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function isDefined(def) {
  return def !== null && def !== undefined
}

/**
 * <Link> components are used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name (or the
 * value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route name="showPost" path="/posts/:postID" handler={Post}/>
 *
 * You could use the following component to link to that route:
 *
 *   <Link to="showPost" params={{ postID: "123" }} />
 *
 * In addition to params, links may pass along query string parameters
 * using the `query` prop.
 *
 *   <Link to="showPost" params={{ postID: "123" }} query={{ show:true }}/>
 */

export default class Link {

  static propTypes = {
    children: any,
    component: any,
    activeStyle: object,
    activeClassName: string,
    to: string.isRequired,
    query: object,
    state: object,
    active: bool,
    onClick: func
  }

  static contextTypes = {
    router: object
  }

  handleClick(event) {
    let allowTransition = true
    let clickResult

    if (this.props.onClick) {
      clickResult = this.props.onClick(event)
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return

    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false
    }

    event.preventDefault()

    if (allowTransition) {
      this.context.router.transitionTo(this.props.to, this.props.query, this.props.state)
    }
  }

  render() {
    const { router } = this.context
    const { to, query, active, children,
            component: Component = React.DOM.a, } = this.props

    const props = Object.assign({}, this.props, {
      href: router.makeHref(to, query),
      active: isDefined(active) ? active : router && router.isActive(to, query),
      onClick: ::this.handleClick
    })

    return <Component {...props}>{children}</Component>
  }

}
