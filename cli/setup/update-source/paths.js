const Path = require('path')

function getAliases (aliases, absPath) {
  return aliases.lookup.filter(item => absPath.startsWith(item.absPath))
}

/**
 * Resolves a relative path to an alias path
 *
 * @param   {string}    absFile    The absolute source file path
 * @param   {string}    trgPath   The relative path of the require or import
 * @param   {Aliases}   aliases   The Aliases model with data and methods to resolve aliases
 * @param   {string[]}  modules   A list of aliases to treat as modules
 * @returns {string|void}         An aliased path string if found, or void if not
 */
function toAlias (absFile, trgPath, { aliases, modules }) {
  // target (folder)
  let absTarget
  let absFolder

  // >> undefined path
  //    the `require(path)` is a variable
  //    don't process
  if (!trgPath) {
    return
  }

  // >> relative paths
  //    up or down from the current folder
  //    look to resolve to an existing @alias
  if (trgPath.startsWith('.')) {
    absFolder = Path.dirname(absFile)
    absTarget = Path.resolve(absFolder, trgPath)
  }

  // >> anything else
  //    could be a package, @namespaced package, or existing @alias
  //    need to check what kind of path it is
  else {
    // get first segment
    const segments = trgPath.split(Path.sep)
    const name = segments.shift()

    // >> existing alias
    //    this may or may not be the right alias (might just be @/)
    //    look to refine
    const alias = aliases.get(name)
    if (alias) {
      absTarget = Path.join(alias.absPath, ...segments)
    }

    // >> not an alias
    //    probably an npm package
    //    don't replace
    else {
      return
    }
  }

  // source data
  const sourceAliases = getAliases(aliases, absFile)
  const sourceAlias = sourceAliases[0]

  // target data
  const targetAliases = getAliases(aliases, absTarget)
  const targetAlias = targetAliases[0]

  // we have a target alias!
  if (targetAlias) {
    // variables
    const { alias, absPath } = targetAlias
    const aliased = absTarget.replace(absPath, alias)
    const isShort = trgPath.length < aliased.length

    // >> upstream paths
    //    if the user has traversed up, we need to check if we crossed a module boundary
    //    modules are identified (by the user) as:
    //      - @alias folders containing self-contained <module> folders
    //      - i.e. /projects/project/src/@modules/<module>
    //    the rules are:
    //      - inside the <module>, use relative paths
    //      - if we cross move outside (sibling <module> / other @alias) use the @alias
    if (trgPath.startsWith('../')) {
      // variables
      // const isModule = modules.includes(sourceAlias.alias)
      const upstream = trgPath.match(/^[./]+/).toString().slice(0, -1)
      const junction = Path.resolve(absFolder, upstream)

      // >> junction is outside the module (@modules/<module>)
      //    and we have a module boundary set
      //    return aliased path
      if (junction === absPath && modules.includes(alias)) {
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
    else if (trgPath.startsWith('.') && isShort) {
      return
    }

    // >> unchanged alias
    //    if the alias is the same, it is already optimised
    //    don't return
    if (aliased === trgPath) {
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
 * @param   {string}    absFile    The absolute source file path
 * @param   {string}    trgPath   The relative path of the require or import
 * @param   {Aliases}   aliases   The Aliases model with data and methods to resolve aliases
 * @returns {string|void}         A relative path string if found, or void if not
 */
function toRelative (absFile, trgPath, { aliases }) {
  // get alias
  const key = aliases.keys
    .sort().reverse()
    .find(key => trgPath.startsWith(key))

  // transform path
  if (key) {
    const alias = aliases.get(key)
    const absSource = Path.dirname(absFile)
    const absTarget = alias.absPath + trgPath.slice(key.length)
    const relTarget = Path.relative(absSource, absTarget)
    return relTarget.startsWith('.')
      ? relTarget
      : './' + relTarget
  }
}

module.exports = {
  toAlias,
  toRelative,
}
