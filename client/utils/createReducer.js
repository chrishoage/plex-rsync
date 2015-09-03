export default function createReducer(initialState, actionsMap) {
  return (state = initialState, action) => {
    const reduceFn = actionsMap[action.type]
    if (!reduceFn) return state
    return reduceFn(state, action.payload)
  }
}
