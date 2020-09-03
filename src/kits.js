import moment from 'moment'

export const checkType = target => Object.prototype.toString.call(target).slice(8,-1).toLowerCase()

export const changeDataType = (defaultValue, value) => {
  const typeEnums = {
    'string': () => value + '',
    'number': () => value / 1
  }
  return typeEnums[checkType(defaultValue)] && typeEnums[checkType(defaultValue)]()
}

export const dateFormat = target => {
  const type = checkType(target)
  let flag = false
  let date = null
  const reg = /((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/

  if(type !== 'array' && type !== 'string') return target

  if(type === 'array') {
    date = target.map(item => {
      if(checkType(item) !== 'string') return item

      if(reg.test(item)) {
        flag = true
        return moment(item)
      }else {
        flag = false
      }
      return item
    })
  }else {
    if(reg.test(target)) {
      flag = true
      date = moment(target)
    }
  }
  if(!flag) return target
  return date
}