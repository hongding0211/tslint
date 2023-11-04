const path = require("path");
const match = require("./match.js");

const ROOT_DIR = process.cwd();

function flatArray(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatArray(val)) : acc.concat(val),
    []
  );
}

function parse(data, fileList, ignorePatterns) {
  const {
    program: { semanticDiagnosticsPerFile },
  } = data;

  const relativeFileList = fileList.map((f) => f.replace(ROOT_DIR, "."));

  return flatArray(semanticDiagnosticsPerFile).filter(
    (e) =>
      typeof e === "object" &&
      relativeFileList.includes(e.file) &&
      !match(e.file, ignorePatterns)
  );
}

module.exports = parse;
