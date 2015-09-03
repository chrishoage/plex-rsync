export default function createActionTypes (types) {
  const ActionTypes = types.reduce((collector, type) => {
    collector[type] = type
    return collector
  }, {})
  return ActionTypes
}
