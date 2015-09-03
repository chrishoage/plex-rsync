import { Iterable, fromJS } from 'immutable'

const DIGIT_REGEX = /^\d+$/

const coerceInt = (i) => {
  if (DIGIT_REGEX.test(i)) {
    return parseInt(i, 10)
  }
  return i
}

const coerceEntries = ([k, v]) => {
  return [coerceInt(k), coerceInt(v)]
}

export default function fromJSMapped(obj) {
  return fromJS(obj, (key, val) => {
    const isIndexed = Iterable.isIndexed(val)
    const value = isIndexed ? val.toList().map(coerceInt)
                            : val.toMap().mapEntries(coerceEntries)
    return value
  })
}
