const Path = require('path')

/**
 * Resolves the source file path to a target folder
 *
 * @param   {string}    source    The absolute source file path
 * @param   {string}    relPath   The relative path of the require or import
 * @param   {Aliases}   aliases   The Aliases model with data and methods to resolve aliases
 * @param   {string[]}  modules   A list of aliases to treat as modules
 * @returns {string|void}         A folder path string if found, or void if not
 */
function getPath (source, relPath, { aliases, modules }) {
  // get all alias data for a given path
  function getAliases (absPath) {
    return aliases.lookup.filter(item => absPath.startsWith(item.absPath))
  }

  // target (folder)
  let target

  // >> undefined path
  //    the `require(path)` is a variable
  //    don't process
  if (!relPath) {
    return
  }

  // >> relative paths
  //    up or down from the current folder
  //    look to resolve to an existing @alias
  if (relPath.startsWith('.')) {
    source = Path.dirname(source)
    target = Path.resolve(source, relPath)
  }
  // >> anything else
  //    could be a package, @namespaced package, or existing @alias
  //    need to check what kind of path it is
  else {
    // get first segment
    const segments = relPath.split(Path.sep)
    const name = segments.shift()

    // >> existing alias
    //    this may or may not be the right alias (might just be @/)
    //    look to refine
    const alias = aliases.get(name)
    if (alias) {
      target = Path.join(alias.absPath, ...segments)
    }

    // >> not an alias
    //    probably an npm package
    //    don't replace
    else {
      return
    }
  }

  // source data
  const sourceAliases = getAliases(source)
  const sourceAlias = sourceAliases[0]

  // target data
  const targetAliases = getAliases(target)
  const targetAlias = targetAliases[0]

  // we have a target alias!
  if (targetAlias) {
    // variables
    const { alias, absPath } = targetAlias
    const aliased = target.replace(absPath, alias)
    const isShort = relPath.length < aliased.length

    // >> upstream paths
    //    if the user has traversed up, we need to check if we crossed a module boundary
    //    modules are identified (by the user) as:
    //      - @alias folders containing self-contained <module> folders
    //      - i.e. /projects/project/src/@modules/<module>
    //    the rules are:
    //      - inside the <module>, use relative paths
    //      - if we cross move outside (sibling <module> / other @alias) use the @alias
    if (relPath.startsWith('../')) {
      // variables
      // const isModule = modules.includes(sourceAlias.alias)
      const upstream = relPath.match(/^[./]+/).toString().slice(0, -1)
      const junction = Path.resolve(source, upstream)

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
    else if (relPath.startsWith('.') && isShort) {
      return
    }

    // >> unchanged alias
    //    if the alias is the same, it is already optimised
    //    don't return
    if (aliased === relPath) {
      return
    }

    // >> anything else
    //    return aliased path
    return aliased
  }
}

module.exports = {
  getPath
}
