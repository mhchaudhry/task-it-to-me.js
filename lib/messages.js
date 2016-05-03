module.exports = {
listProjectsHeader: listProjectsHeader,
noProjectsCreated: noProjectsCreated
}

function listProjectsHeader() {
  return "\x1b[38;5;40mListing projects:\x1b[0m\n";
}

function noProjectsCreated() {
  return "\x1b[40;38;5;214mNo projects created\x1b[0m\n\n";
}

