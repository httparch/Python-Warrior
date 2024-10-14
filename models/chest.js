var Chest = function () {
  var module = {}

  var x
  var y

  module.init = function (x, y) {
    this.x = x
    this.y = y
  }

  module.getX = function () {
    return this.x
  }
  /**
   * open(): Removes the chest from the Map.map array. It first finds the index of the chest within the map. If the chest is found (i.e., the index is not -1), it uses splice() to remove it.
   */
  module.open = function () {
    var index = Map.map.indexOf(this)
    Map.map.splice(index, 1)
  }

  module.name = 'c'
  return module
}
