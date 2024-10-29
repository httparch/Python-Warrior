var Map = (function () {
  var module = {}
  //An array that represents the game map and stores different elements (e.g., player, enemies, items).
  var map = []
  var blocksEnum = {
    WALL: "w",
    RUBY: "r",
    ENEMY: "e",
    WARRIOR: "p",
    SPACE: "s",
    SCORPION: "m",
    SNAKE: "n",
    CHEST: "c",
    PRINCESS: "i",
  }

  /**
   *
   * parseLevel(contents): Takes a string contents representing the level layout and parses it character by character. Depending on the character encountered:
      Creates a new Player, Ruby, Gate, Chest, or Enemy and initializes it with coordinates.
      Pushes the initialized object onto the map array.
      Handles a space character ('s') by pushing an object representing empty space onto the map.
   */

  module.parseLevel = function (contents) {
    for (var index = 0; index < contents.length; index++) {
      var char = contents.charAt(index)
      switch (char) {
        case "p":
          Player.constructor(index, 4, "RIGHT", 100)
          map.push(Player)
          break
        case "r":
          var coin = Ruby()
          coin.init(index, 0)
          map.push(coin)
          break
        case "g":
          var gate = Gate()
          gate.init(index, 0)
          map.push(gate)
          break
        case "i":
          var princess = Princess()
          princess.init(index, 0)
          map.push(princess)
          break
        case "w":
          var wall = Crate()
          wall.init(index, 0)
          map.push(wall)
          break
        case "c":
          var chest = Chest()
          chest.init(index, 0)
          map.push(chest)
          break
        case "e":
          var enemy = Enemy()
          enemy.init(index, 0, "LEFT")
          enemy.setHealth(100)
          map.push(enemy)
          break
        case "m":
          var scorpion = Scorpion()
          scorpion.init(index, 0, "LEFT")
          scorpion.setHealth(120)
          map.push(scorpion)
          break
        case "n":
          var snake = Snake()
          snake.init(index, 0, "LEFT")
          snake.setHealth(140)
          map.push(snake)
          break
        case "s":
          map.push({ name: "s", x: index, y: 0 })
          break
        default:
          break
      }
    }
  }
  /**
   * attack(coord, dmg): Iterates through the map array to find an element at the specified coordinate.
   * If found, it reduces the health of that element by dmg.
   * If health drops to zero or below, the element is removed from the map.
   */

  module.attack = function (coord, dmg) {
    map.forEach(function (element, index) {
      if (element.x === coord) {
        element.health -= dmg

        if (element.health <= 0) {
          map.splice(index, 1)
        }
      }
    })
  }

  module.map = map
  return module
})()
