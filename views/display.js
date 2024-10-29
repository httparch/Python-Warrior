//Display module encapsulates functionality for rendering a 2D game display on an HTML canvas.

//
var Display = (function () {
  var module = {}
  var imageCache = {}
  var player = {}
  var skin
  var drawInterval
  //Sets the player variable to the provided message (likely an object representing player state).
  module.setPlayer = function (message) {
    player = message
  }
  //Initializes the game map, caches images based on the provided skin, and starts a drawing loop after a brief delay.
  module.initMap = function (s, map) {
    clearInterval(drawInterval)
    drawInterval = undefined

    skin = s
    cacheImage("crate", "crate")
    cacheImage("player", "character")
    cacheImage("player_left", "character_left")
    cacheImage("enemy", "enemy")
    cacheImage("scorpion", "scorpion")
    cacheImage("snake", "snake")
    cacheImage("heart", "heart")
    cacheImage("ruby", "coin")
    cacheImage("bg", "bg")
    cacheImage("bg_cloud", "bg_cloud")
    cacheImage("bg_secondary", "bg_secondary")
    cacheImage("bg_front", "bg_front")
    cacheImage("gate", "gate")
    cacheImage("princess", "princess")
    cacheImage("chest", "chest")

    setTimeout(function () {
      if (drawInterval === undefined)
        drawInterval = setInterval(function () {
          draw(map)
        }, 50)
    }, 500)
  }
  var dx = 2
  var x = 0
  /**
   *
   * The core rendering function that:
        Clears the canvas.
        Draws the background and clouds.
        Draws player health indicators based on the player's health.
        Iterates through the map array to draw different game elements (e.g., player, enemies, collectibles) based on their type.
   */
  function draw(map) {
    var canvas = document.getElementById("playcanvas")
    var context = canvas.getContext("2d")

    context.clearRect(0, 0, canvas.width, canvas.height)

    context.drawImage(imageCache.bg, 0, 0, canvas.width, canvas.height)

    // reset, start from beginning
    if (x > canvas.width) {
      x = -canvas.width + x
    }
    // draw additional image1

    if (x > 0) {
      context.drawImage(
        imageCache.bg_cloud,
        -canvas.width + x,
        0,
        canvas.width + 5,
        canvas.height
      )
    }
    // draw additional image2
    if (x - canvas.width > 0) {
      context.drawImage(
        imageCache.bg_cloud,
        -canvas.width * 2 + x,
        0,
        canvas.width,
        canvas.height
      )
    }
    // amount to move
    x += dx

    // draw image
    context.drawImage(imageCache.bg_cloud, x, 0, canvas.width, canvas.height)

    for (var i = 1; i <= Player.health / 20; i++) {
      context.drawImage(imageCache.heart, i * 55, 10, 50, 50)
    }
    context.drawImage(
      imageCache.bg_secondary,
      0,
      0,
      canvas.width,
      canvas.height
    )

    map.forEach(function (element) {
      switch (element.name) {
        case "p":
          if (element.direction === "LEFT") {
            context.drawImage(
              imageCache.player_left,
              translateImage(element.getX()),
              translateImage(1),
              186,
              186
            )
          } else {
            context.drawImage(
              imageCache.player,
              translateImage(element.getX()),
              translateImage(1),
              186,
              186
            )
          }
          break
        case "r":
          context.drawImage(
            imageCache.ruby,
            translateImage(element.getX()),
            translateImage(1.5),
            64,
            64
          )
          break
        case "e":
          context.drawImage(
            imageCache.enemy,
            translateImage(element.getX()),
            translateImage(1),
            206,
            250
          )
          break
        case "m":
          context.drawImage(
            imageCache.scorpion,
            translateImage(element.getX()),
            translateImage(1),
            206,
            210
          )
          break
        case "n":
          context.drawImage(
            imageCache.snake,
            translateImage(element.getX()),
            translateImage(1),
            206,
            200
          )
          break
        case "w":
          context.drawImage(
            imageCache.crate,
            translateImage(element.getX()),
            translateImage(1),
            206,
            200
          )
          break
        case "g":
          context.drawImage(
            imageCache.gate,
            translateImage(element.getX()),
            translateImage(1),
            206,
            200
          )
          break
        case "c":
          context.drawImage(
            imageCache.chest,
            translateImage(element.getX()),
            translateImage(1),
            206,
            200
          )
          break
        case "i":
          context.drawImage(
            imageCache.princess,
            translateImage(element.getX()),
            translateImage(1),
            206,
            200
          )
          break
        default:
          break
      }
    })

    context.drawImage(imageCache.bg_front, 0, 65, canvas.width, canvas.height)
  }
  //translateImage(coord): Translates coordinates for scaling purposes
  function translateImage(coord) {
    return coord * 92
  }
  //cacheImage(name, longName): Caches an image by creating a new Image object, setting its src, and storing it in imageCache once it loads.
  function cacheImage(name, longName) {
    var imageObj = new Image()
    imageObj.src = "assets/images/" + skin + "/" + longName + ".svg"
    imageObj.onload = function () {
      imageCache[name] = imageObj
    }
  }

  return module
})()
