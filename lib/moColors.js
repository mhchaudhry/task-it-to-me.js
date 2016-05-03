module.exports = {
green: green
//orange: orange,
//magenta: magenta,
//blackOnWhite: blackOnWhite
}

function green (text) {
  return "\x1b[38;5;40m" + text + "\x1b[0m";
}
