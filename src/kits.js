export const checkType = target => Object.prototype.toString.call(target).slice(8,-1).toLowerCase()

export const changeDataType = (defaultValue, value) => {
  const typeEnums = {
    'string': () => value + '',
    'number': () => value / 1
  }
  return typeEnums[checkType(defaultValue)] && typeEnums[checkType(defaultValue)]()
}