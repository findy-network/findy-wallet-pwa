Utils.toTimeString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

Utils.toDateString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString()
}

Utils.getSchemaName = (schemaId: string) => {
  var splitted = schemaId.split(':', 3)
  return splitted[2]
}

function Utils() {}

export default Utils
