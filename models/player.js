var Player = (function () {
  var module = {}

  var x
  var y
  var direction
  var health
  var canMove
  var canPerformAction

  module.name = "p"

  module.constructor = function (x, y, direction, health) {
    this.x = x
    this.y = y
    this.direction = direction
    this.health = health
    this.canMove = true
    this.canPerformAction = true
  }

  module.getX = function () {
    return this.x
  }

  module.setDir = function (dir) {
    this.direction = dir
  }

  module.setHealth = function (health) {
    this.health = health
  }

  module.getHealth = function () {
    return this.health
  }

  //walk(): Moves the player in the current direction if they can perform actions and if movement is allowed.
  //Logs messages  if certain conditions are not met.
  module.walk = function () {
    if (!this.canPerformAction) {
      console.log("You can only run one action command at a time")
      return
    }
    this.canPerformAction = false
    if (!this.canMove && this.direction === "RIGHT") {
      console.log("You cant go any further")
      return
    }

    switch (this.direction) {
      case "UP":
        this.y++
        break
      case "DOWN":
        this.y--
        break
      case "LEFT":
        this.x--
        break
      case "RIGHT":
        this.x++
        break
      default:
        break
    }
  }

  // skipWall(): Skips over the wall if the next field contains 'w'.
  module.skipWall = function (map) {
    var nextField = this.getNext(map)

    if (nextField === "w") {
      switch (this.direction) {
        case "UP":
          this.y += 3
          break
        case "DOWN":
          this.y -= 3
          break
        case "LEFT":
          this.x -= 3
          break
        case "RIGHT":
          console.log("here")
          this.x += 3
          break
        default:
          break
      }
    } else {
      console.log("No wall to skip")
    }
  }

  //checkNextField(map): Checks the next field in the direction the player is facing,
  // returning the element found or indicating it's an empty field.
  module.checkNextField = function (map) {
    var offset = 0
    switch (this.direction) {
      case "LEFT":
        offset--
        break
      case "RIGHT":
        offset++
        break
      default:
        break
    }
    var returnValue = "empty field"
    map.forEach(function (element) {
      if (element.x === Player.getX() + offset) {
        returnValue = element
      }
    })

    return returnValue
  }
  //openChest(): Checks the next field and opens a chest if it's present.
  module.openChest = function () {
    console.log("opened")
    var offset = 0
    switch (this.direction) {
      case "LEFT":
        offset--
        break
      case "RIGHT":
        offset++
        break
      default:
        break
    }

    this.checkNextField(Map.map).open()
  }
  // getNext(): Returns the type of the next field based on the player's current direction.
  module.getNext = function () {
    var offset = 0
    switch (this.direction) {
      case "LEFT":
        offset--
        break
      case "RIGHT":
        offset++
        break
      default:
        break
    }

    var returnValue = "s"
    Map.map.forEach(function (element) {
      if (element.x === Player.getX() + offset) {
        returnValue = element.name
      }
    })
    return returnValue
  }
  //getChestDistance(): Calculates the distance to the nearest chest, adjusting the value based on the player’s direction.
  module.getChestDistance = function () {
    var distance = 0
    Map.map.forEach(function (element) {
      if (element.name === "c") {
        distance = Player.x - element.x
      }
    })
    if (Player.direction === "RIGHT") {
      distance *= -1
    }
    return distance
  }
  //attack(): Executes an attack in the current direction, playing a sound effect
  // and dealing damage to an enemy in that direction if the player can perform an action.
  module.attack = function () {
    if (!this.canPerformAction) {
      console.log("You can only run one action command at a time")
      return
    }
    this.canPerformAction = false
    //var audio = new Audio('assets/sounds/sword.mp3')
    //audio.play()

    if (Math.random() > 0.5) {
      var audio = new Audio("assets/sounds/sword1.ogg")
    } else {
      var audio = new Audio("assets/sounds/sword2.ogg")
    }
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
    Map.attack(coord, 25)
  }

  return module
})()
