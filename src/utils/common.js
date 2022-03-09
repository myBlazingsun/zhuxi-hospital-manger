export const findNodeById = (tree, id, childPath, idPath)=> {
  if(!tree.length)return
  let matchNode;

  function _findNodeById(tree, id, childPath, idPath){
    for(let i = 0;i< tree.length;i++){
      if(matchNode)break
      let child = tree[i]
      if(child[idPath] == id){
        matchNode = child;
      }
      let childs = child[childPath];
      if(childs && childs.length){
        _findNodeById(childs, id, childPath, idPath)
      }
    }
  }
  _findNodeById(tree, id, childPath, idPath)
  
  return matchNode
}


export const walkTree = (tree, childPath, level, parent, fn) => {
  if (Array.isArray(tree) && tree.length) {
      walkArray(tree, childPath, level, parent, fn)
  } else if (typeof tree === 'object') {
      fn(tree, level, parent)
      let children = tree[childPath];
      if (Array.isArray(children) && children.length) {
          walkArray(children, childPath, ++level, tree, fn)
      }
  }
}

export const walkArray = (array, childPath, level, parent, fn) => {
  for (let i = 0; i < array.length; i++) {
      let trunk = array[i];
      walkTree(trunk, childPath, level, parent, fn)
  }
}