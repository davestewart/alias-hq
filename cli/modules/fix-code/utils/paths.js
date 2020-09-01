// const { inspect } = require('../../../../src/utils')
const Path = require('path')

/**
 * Resolves the source file path to the target folder
 *
 * @param   {string}    source    The source file
 * @param   {string}    rel       The relative path
 * @param   {object}    aliases   An object containing lookup and names values
 * @param   {string[]}  modules   A list of aliases to treat as modules
 * @returns {string|void}         A folder path string if found, or void if not
 */
function getPath (source, rel, { aliases, modules }) {
  // get all alias data for a given path
  const getAliases = (path) => aliases.lookup.filter(item => path.startsWith(item.path))

  // target (folder)
  let target

  // >> undefined path
  //    the `require(path)` is a variable
  //    don't process
  if (!rel) {
    return
  }

  // >> relative paths
  //    up or down from the current folder
  //    look to resolve to an existing @alias
  if (rel.startsWith('.')) {
    source = Path.dirname(source)
    target = Path.resolve(source, rel)
  }

  // >> anything else
  //    could be a package, @namespaced package, or existing @alias
  //    need to check what kind of path it is
  else {
    // get first segment
    const segments = rel.split(Path.sep)
    const name = segments.shift()

    // >> existing alias
    //    this may or may not be the right alias (might just be @/)
    //    look to refine
    if (aliases.names.includes(name)) {
      const path = aliases.lookup.find(item => item.alias === name).path
      target = Path.join(path, ...segments)
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
    const { path, alias } = targetAlias
    const aliased = target.replace(path, alias)
    const isShort = rel.length < aliased.length

    // >> upstream paths
    //    if the user has traversed up, we need to check if we crossed a module boundary
    //    modules are identified (by the user) as:
    //      - @alias folders containing self-contained <module> folders
    //      - i.e. /projects/project/src/@modules/<module>
    //    the rules are:
    //      - inside the <module>, use relative paths
    //      - if we cross move outside (sibling <module> / other @alias) use the @alias
    if (rel.startsWith('../')) {
      // variables
      const isModule = modules.includes(sourceAlias.alias)
      const upstream = rel.match(/^[./]+/).toString().slice(0, -1)
      const junction = Path.resolve(source, upstream)

      // >> junction is outside the module (@modules/<module>)
      //    and we have a module boundary set
      //    return aliased path
      if (junction === path && modules.includes(alias)) {
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
    else if (rel.startsWith('.') && isShort) {
      return
    }

    // >> unchanged alias
    //    if the alias is the same, it is already optimised
    //    don't return
    if (aliased === rel) {
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
