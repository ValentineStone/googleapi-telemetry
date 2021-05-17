const timeout = (fn, ms) => {
  let id
  return () => {
    clearTimeout(id)
    id = setTimeout(fn, ms)
  }
}

module.exports = {
  timeout,
}