const fs = require('fs')
const path = require('path')
const util = require('util')
const PRAGAMA_SOLIDITY_VERSION_REGEX = /^\s*pragma\ssolidity\s+(.*?)\s*;/;
const SUPPORTED_VERSION_DECLARATION_REGEX = /^\^?\d+(\.\d+){1,2}$/;
const IMPORT_SOLIDITY_REGEX = /^.*import.*$/mg;

const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile)

const SolidityParser = require('solidity-parser');

async function normalizeCompilerVersionDeclarations(files) {
  let pinnedVersion;
  let pinnedVersionFile;

  let maxCaretVersion;
  let maxCaretVersionFile;

  for (const file of files) {
    const version = await getFileCompilerVersionDeclaration(file);

    if (version === undefined) {
      continue;
    }

    if (version.startsWith("^")) {
      if (maxCaretVersion == undefined) {
        maxCaretVersion = version;
        maxCaretVersionFile = file;
      } else {
        if (semver.gt(version.substr(1), maxCaretVersion.substr(1))) {
          maxCaretVersion = version;
          maxCaretVersionFile = file;
        }
      }
    } else {
      if (pinnedVersion === undefined) {
        pinnedVersion = version;
        pinnedVersionFile = file;
      } else if (pinnedVersion !== version) {
        throw new Error(
          "Different pinned compiler versions in " +
            pinnedVersionFile +
            " and " +
            file
        );
      }
    }

    if (maxCaretVersion !== undefined && pinnedVersion !== undefined) {
      if (!semver.satisfies(pinnedVersion, maxCaretVersion)) {
        throw new Error(
          "Incompatible compiler version declarations in " +
            maxCaretVersionFile +
            " and " +
            pinnedVersionFile
        );
      }
    }
  }

  if (pinnedVersion !== undefined) {
    return pinnedVersion;
  }

  return maxCaretVersion;
}


async function getFileCompilerVersionDeclaration(fileContents) {

  const matched = fileContents.match(PRAGAMA_SOLIDITY_VERSION_REGEX);


  if (matched === null) {
    return undefined;
  }

  const version = matched[1];

  if (!SUPPORTED_VERSION_DECLARATION_REGEX.test(version)) {
    throw new Error("Unsupported compiler version declaration");
  }

  return version;
}


function getDirPath(filePath) {
  return filePath.substring(0, filePath.lastIndexOf(path.sep));
}


function getDependencies(filePath, fileContents) {
  const dependencies = filePath;
  let imports;

  try {
    imports = SolidityParser.parse(fileContents, "imports")
  } catch(error) {
    throw new Error(
      "Could not parse " + filePath + " for extracting its imports."
    );
  }

  for (var dependency of imports) {
    dependency = getDirPath(filePath) + path.sep + dependency;
    dependency = path.normalize(dependency);
    dependencies.push(dependency)
  }

  return dependencies
}


async function writeConcatenation(files) {
  const version = await normalizeCompilerVersionDeclarations(files);

  if (version) {
    console.log('pragma solidity ' + version + ";");
  }

  for (const file of files) {
    console.log("\n//File: " + file + "\n");
    let fileContents = await readFile(file, 'utf-8')
    let output = fileContents.replace(PRAGAMA_SOLIDITY_VERSION_REGEX, "")
                              .replace(IMPORT_SOLIDITY_REGEX, "")

  await appendFile('./FullContract.sol', output)
  }
}

async function flatten(path) {
  let content = await readFile(path, 'utf-8')
  let dependencies = await getDependencies(path, content)
  await writeConcatenation(dependencies)
}

module.exports = {
  flatten
}