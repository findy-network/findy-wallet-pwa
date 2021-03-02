
Utils.toTimeString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function Utils() { }

export default Utils
