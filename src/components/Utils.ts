Utils.toTimeString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

Utils.toDateString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString()
}

Utils.toDateDotString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString('et-EE')
}

Utils.toDateMsgString = (str: string) => {
  let options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'numeric',
  }
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString('et-EE', options)
}

Utils.parseSchemaName = (schemaId: string) => {
  var splitted = schemaId.split(':', 3)
  if (splitted[2]) {
    return splitted[2]
  }
  return schemaId
}

Utils.parseIssuer = (schemaId: string) => {
  var splitted = schemaId.split(':', 5)
  if (splitted[4]) {
    return splitted[4]
  }
  return schemaId
}

function Utils() {}

export default Utils
