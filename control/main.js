var loop //Manages the game loop for processing turns.
var level // Keeps track of the current level.
var victory //A flag indicating if the player has reached the goal (the gate).
var skin //Represents the visual style or theme for the game.

/**
 *
 * This function starts the game loop, processing player actions and interactions with the map every half second.
It evaluates code input by the player (using eval), which can potentially introduce commands that modify the game's state.
It checks the player's next field for various elements (like coins, enemies, chests, etc.) and handles interactions accordingly.
 */

function parse(str) {
  restart()
  var i = 0

  loop = setInterval(function () {
    Player.canPerformAction = true

    i++
    console.log("ROUND " + i + " ------------------")

    check()

    var element = Player.checkNextField(Map.map)

    switch (element.name) {
      case "r":
        if (Player.health < 100) {
          Player.health += 20
        }
        Player.canMove = true
        var audio = new Audio("assets/sounds/coin.wav")
        audio.play()
        Map.map.splice(Map.map.indexOf(element), 1)
        break
      case "e":
        Player.canMove = false
        element.attack()
        break
      case "m":
        Player.canMove = false
        element.attack()
        break
      case "n":
        Player.canMove = false
        element.attack()
        break
      case "c":
        Player.canMove = false
        break
      case "w":
        Player.canMove = false
        break
      case "s":
        Player.canMove = true
        if (Player.health < 100) {
          Player.health += 20
        }
        break
      case "g":
        victory = true
        break
      case "i":
        victory = true
        break
      default:
        if (Player.health < 100) {
          Player.health += 20
        }
        Player.canMove = true
        break
    }

    // Translate Python-like code to JavaScript
    try {
      var jsCommands = convertPythonToJS(str)
      console.log("Translated code:", jsCommands)
      eval(jsCommands) // Execute the translated JavaScript commands
    } catch (error) {
      console.error("Error executing command:", error)
    }

    if (i > 25) {
      clearInterval(loop)
    }
  }, 500)
}

function convertPythonToJS(pythonCode) {
  // Replace Python if-else syntax with JavaScript equivalent
  pythonCode = pythonCode.replace(/if\s+(.*):/g, "if ($1) {") // Handle if statements
  pythonCode = pythonCode.replace(/elif\s+(.*):/g, "} else if ($1) {") // Handle elif statements
  pythonCode = pythonCode.replace(/else:/g, "} else {") // Handle else statements

  // Split code into lines to handle indentation and block structure
  const lines = pythonCode.split("\n")
  let outputCode = ""
  let openBlocks = 0

  lines.forEach((line) => {
    const trimmedLine = line.trim()

    // Add line to output
    if (trimmedLine) {
      // Only process non-empty lines
      outputCode += line + "\n"

      // Detect block openings
      if (trimmedLine.endsWith("{")) {
        openBlocks++
      }
      // Detect closing blocks manually
      if (trimmedLine.startsWith("}")) {
        openBlocks--
      }
    }
  })

  // Ensure there are no extra closing braces
  while (openBlocks > 0) {
    outputCode += "}\n"
    openBlocks--
  }

  return outputCode
}

/**
 * This checks for win or lose conditions:
If victory is true, it checks if there are any remaining coins or chests in the map. If not, it clears the loop, increments the level, and plays a victory sound.
If the player's health drops to zero, it restarts the game and plays a defeat sound.
 */

function check() {
  if (victory) {
    var win = true
    Map.map.forEach(function (element) {
      if (element.name === "r" || element.name === "c") {
        win = false
      }
    })
    if (win) {
      clearInterval(loop)
      level++
      if (Math.random() > 0.5) {
        var audio = new Audio("assets/sounds/win1.wav")
      } else {
        var audio = new Audio("assets/sounds/win2.wav")
      }
      audio.play()

      document.getElementById("console-log-text").textContent = ""
      console.log("You won!")
      Player.health = 100
      Map.map.splice(0, Map.map.length)
      loadMap(skin)
    } else {
      console.log("Pick up all the coins!")
    }
  }
  if (Player.health <= 0) {
    restart()
    console.log("Defeat!")
    var audio = new Audio("assets/sounds/dead.wav")
    audio.play()
  }
}
//restart():Clears the current game loop, resets the console log, and reloads the current map.
function restart() {
  clearInterval(loop)
  document.getElementById("console-log-text").textContent = ""
  Map.map.splice(0, Map.map.length)
  loadMap(skin)
}
// loadMap(skin): Loads hints and the level layout from text files based on the current level. It sets up the player and initializes the map display.
function loadMap(skin) {
  // Load hints
  fetch(`assets/levels/${level}/hint.txt`)
    .then((response) => response.text())
    .then((responseText) => {
      document.getElementById("hint").innerHTML = responseText
    })

  // Load level layout
  fetch(`assets/levels/${level}/level.txt`)
    .then((response) => response.text())
    .then((responseText) => {
      victory = false
      Player.constructor()
      Display.setPlayer = Player
      Map.parseLevel(responseText)
      Display.initMap(skin, Map.map)
    })
}

// changeLevel(): Allows the player to change levels through a prompt. If the new level exists, it loads it; otherwise, it shows an error.
function changeLevel() {
  const levelPopup = prompt("Enter level", "")

  if (levelPopup !== null && level !== levelPopup) {
    fetch(`assets/levels/${levelPopup}/level.txt`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Level not found")
        }
        return response.text()
      })
      .then(() => {
        window.history.pushState(
          null,
          null,
          `?level=${levelPopup}&skin=${getParameterByName("skin")}`
        )
        level = levelPopup
        restart()
      })
      .catch(() => {
        alert(`There is no level: ${levelPopup}`)
      })
  }
}

// showPopup(): Loads a popup hint from a text file and displays it in the UI.
function showPopup() {
  fetch(`assets/levels/${level}/popup.txt`)
    .then((response) => response.text())
    .then((responseText) => {
      document.getElementById("hint-text").innerHTML = responseText
    })
}

// The code sets the initial level and skin based on URL parameters and loads the corresponding map.
document.addEventListener("DOMContentLoaded", function () {
  level = getParameterByName("level")
  skin = getParameterByName("skin")
  loadMap(skin)
})

function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

//Initializes a CodeMirror instance for code input, allowing for JavaScript code editing.
//When the player presses Ctrl + Enter, it saves the code and parses it
var cm = CodeMirror.fromTextArea(code, {
  mode: "javascript",
  lineNumbers: true,
  theme: "solarized light",
  autofocus: true,
})

// Set text alignment for elements with role 'presentation'
const presentationElements = document.querySelectorAll("[role=presentation]")
presentationElements.forEach((element) => {
  element.style.textAlign = "initial"
})

// Add classes to the CodeMirror element
const codeMirrorElement = document.querySelector(".CodeMirror")
if (codeMirrorElement) {
  codeMirrorElement.classList.add(
    "uk-width-2-3",
    "uk-padding-remove",
    "uk-margin-remove"
  )
}

// Handle keydown events for the CodeMirror editor
codeMirrorElement.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    cm.save()
    parse(document.getElementById("code").value)
  }
})
