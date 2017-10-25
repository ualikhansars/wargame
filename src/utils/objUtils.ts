export const deleteObjectFromArray = (object:any, arr:any[]):any[] => {
  let updatedArr = arr.filter((el) => {
    if(el.x === object.x && el.y === object.y) {
      return false;
    }
    return true;
  });
  return updatedArr;
}

export const isObjectInArray = (object:any, arr:any[]):boolean => {
  let result:boolean = false;
  for(let node of arr) {
    if(object.x === node.x && object.y === node.y) {
      result = true;
    }
  }
  return result;
}

export const isUnitInArray = (unitToAdd:any, arr:any[]):boolean => {
  let result:boolean = false;
  for(let unit of arr) {
    if(unitToAdd.id === unit.id) {
      result = true;
    }
  }
  return result;
}

export const getNodeFromArray = (object:any, arr:any[]):any => {
  for(let node of arr) {
    if(node.x === object.x && node.y && object.y) {
      return node;
    }
  }
}


export const isObjectEmpty = (obj:any):boolean => {
  let hasOwnProperty = Object.prototype.hasOwnProperty;
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

/*
  Get min value of the node from the array 
*/
export const getMinValueFromNode = (value:any, nodes:any[]):any => {
  let min = nodes[0];
  for(let i = 1; i < nodes.length; ++i) {
    if(min[i].value > nodes[i]) {
      min = nodes[i];
    }
  }
  return min.value;
}
