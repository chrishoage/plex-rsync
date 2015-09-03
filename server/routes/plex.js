import PlexAPI from 'plex-api'
import qs from 'querystring'
import pluralize from 'pluralize'
import plexConfig from '../../plex.config.json'

const client = new PlexAPI(plexConfig)

function reduceChildren(children = []) {
  return children.reduce((props, child) => {
    const { _elementType, _children, ...rest} = child

    const childs = reduceChildren(_children)

    const propName = pluralize(_elementType.toLowerCase())

    props[propName] = Array.isArray(props[propName]) ? props[propName] : []
    props[propName] = props[propName].concat({...rest, ...childs})

    return props
  }, {})
}


export function get({params, query}, res) {
  const querystring = qs.stringify(query)
  client.query(`/${Object.keys(params).map((key) => params[key]).join('/')}?${querystring}`, query).then((results) => {
    const { _children, _elementType, ...mediaContainer } = results
    const additionalProps = reduceChildren(_children)
    res.json({...mediaContainer, ...additionalProps})
  }, (err) => {
    throw new Error('Could not connect to plex server')
  })
}
