var Scorpion = function () {
  var module = {}

  var x
  var y
  var direction
  var health

  module.name = "m"

  module.init = function (x, y, dir) {
    this.x = x
    this.y = y
    this.direction = dir
  }

  module.getX = function () {
    return this.x
  }

  module.setDirection = function (dir) {
    this.direction = dir
  }

  module.setHealth = function (health) {
    this.health = health
  }
  /**
   * attack(): Plays an attack sound and calculates the attack coordinate based on the enemy's direction. It then calls the Map.attack() function to deal damage at the calculated coordinate.
   */
  module.attack = function () {
    var audio = new Audio("assets/sounds/scorpion.wav")
    audio.play()
    var coord = this.x
    switch (this.direction) {
      case "LEFT":
        coord--
        break
      case "RIGHT":
        coord++
        break
      default:
        break
    }
    Map.attack(coord, 10)
  }

  return module
}
