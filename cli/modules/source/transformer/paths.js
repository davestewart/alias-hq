const Path = require('path')

/**
 * Resolves a relative path to an alias path
 *
 * @param   {string}    absSourceFile   The absolute source file path
 * @param   {string}    targetPath      The relative path of the require or import
 * @param   {Aliases}   aliases         The Aliases model with data and methods to resolve aliases
 * @param   {string[]}  modules         A list of aliases to treat as modules
 * @returns {string|void}               An aliased path string if found, or void if not
 */
function toAlias (absSourceFile, targetPath, { aliases, modules }) {
  // target (folder)
  let absTargetFile
  let absSourceFolder

  // >> undefined path
  //    the `require(path)` is a variable
  //    don't process
  if (!targetPath) {
    return
  }

  // >> relative paths
  //    up or down from the current folder
  //    look to resolve to an existing @alias
  if (targetPath.startsWith('.')) {
    absSourceFolder = Path.dirname(absSourceFile)
    absTargetFile = Path.resolve(absSourceFolder, targetPath)
  }

  // >> anything else
  //    could be a package, @namespaced package, or existing @alias
  //    need to check what kind of path it is
  else {
    // get first segment
    const segments = targetPath.split(Path.sep)
    const name = segments.shift()

    // >> existing alias
    //    this may or may not be the right alias (might just be @/)
    //    look to refine
    const alias = aliases.forName(name)
    if (alias) {
      absTargetFile = Path.join(alias.absPath, ...segments)
    }

    // >> not an alias
    //    probably an npm package
    //    don't replace
    else {
      return
    }
  }

  // aliases data
  // eslint-disable-next-line no-unused-vars
  const sourceAlias = aliases.forPath(absSourceFile)
  const targetAlias = aliases.forPath(absTargetFile)

  // we have a target alias!
  if (targetAlias) {
    // variables
    const { name, absPath } = targetAlias
    const aliased = absTargetFile.replace(absPath, name)
    const isShort = targetPath.length <= aliased.length

    // >> upstream paths
    //    if the user has traversed up, we need to check if we crossed a module boundary
    //    modules are identified (by the user) as:
    //      - @alias folders containing self-contained <module> folders
    //      - i.e. /projects/project/src/@modules/<module>
    //    the rules are:
    //      - inside the <module>, use relative paths
    //      - if we cross move outside (sibling <module> / other @alias) use the @alias
    if (targetPath.startsWith('../')) {
      // variables
      // const isModule = modules.includes(sourceAlias.name)
      const upstream = targetPath.match(/^[./]+/).toString().slice(0, -1)
      const junction = Path.resolve(absSourceFolder, upstream)

      // >> junction is outside the module (@modules/<module>)
      //    and we have a module boundary set
      //    return aliased path
      if (junction === absPath && modules.includes(name)) {
        return aliased
      }

      // >> short upstream paths
      //    would be simpler to use it
      //    don't replace
      if (isShort) {
        return
      }
    }

    // >> short downstream paths
    //    would be simpler to use it
    //    don't replace
    else if (targetPath.startsWith('.') && isShort) {
      return
    }

    // >> unchanged alias
    //    if the alias is the same, it is already optimised
    //    don't return
    if (aliased === targetPath) {
      return
    }

    // >> anything else
    //    return aliased path
    return aliased
  }
}

/**
 * Resolves an alias path to a relative path
 *
 * @param   {string}    absSourceFile   The absolute source file path
 * @param   {string}    targetPath      The relative path of the require or import
 * @param   {Aliases}   aliases         The Aliases model with data and methods to resolve aliases
 * @returns {string|void}               A relative path string if found, or void if not
 */
function toRelative (absSourceFile, targetPath, { aliases }) {
  // get alias
  const alias = aliases.fromName(targetPath)

  // transform path
  if (alias) {
    const absSourceFolder = Path.dirname(absSourceFile)
    const absTargetFile = alias.absPath + targetPath.slice(alias.name.length)
    const relTargetFile = Path.relative(absSourceFolder, absTargetFile)
    return relTargetFile.startsWith('.')
      ? relTargetFile
      : './' + relTargetFile
  }
}

const TransformMode = {
  ALIASED: 'aliased',
  RELATIVE: 'relative',
}

module.exports = {
  toAlias,
  toRelative,
  TransformMode,
}
