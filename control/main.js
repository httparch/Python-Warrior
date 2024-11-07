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

window.addEventListener("message", function (event) {
  // Make sure to check the origin of the message for security
  // if (event.origin !== "http://localhost:5173/app") return; // Replace with the actual origin

  const data = event.data
  // console.log("Received data:", data)

  // Check if message type and data are correct
  if (data.type === "parent-to-python-warrior" && data.level && data.skill) {
    receivedLevel = data.level
    receivedSkill = data.skill
    /*
     if(data.skill === 'Beginner'){
      receivedLevel = `b`+data.level
     }else if(data.skill === 'Intermediate'){
      receivedLevel = `i`+data.level
     }else{
      receivedLevel = data.level
     }*/
    // console.log("Level received:", receivedLevel, receivedSkill)
  }
})

function logAction(action) {
  console.log(`Player is ${action}`)
}

function parse(str) {
  restart()
  var i = 0

  loop = setInterval(function () {
    Player.canPerformAction = true

    i++
    /*console.log("ROUND " + i + " ------------------")*/

    check()

    var element = Player.checkNextField(Map.map)

    switch (element.name) {
      case "r":
        if (Player.health < 100) {
          Player.health += 20
        }
        Player.canMove = true
        logAction("collecting a coin")
        var audio = new Audio("assets/sounds/coin.wav")
        audio.play()
        Map.map.splice(Map.map.indexOf(element), 1)
        break
      case "e":
      case "m":
      case "n":
        Player.canMove = false
        logAction("fighting an enemy")
        element.attack()
        break
      case "c":
        Player.canMove = false
        logAction("facing a chest - need to open it!")
        break
      case "w":
        Player.canMove = false
        logAction("bumping into a wall")
        break
      case "g":
        victory = true
        logAction("teleporting")
        break
      case "i":
        victory = true
        break
      case "s":
        Player.canMove = true
        if (Player.health < 100) {
          Player.health += 20
          logAction("healing")
        }
        logAction("walking forward")
        break
      default:
        Player.canMove = true
        logAction("walking forward")
        break
    }

    // Translate Python-like code to JavaScript
    try {
      var jsCommands = convertPythonToJS(str)
      // Store initial values to check for changes
      const initialHealth = Player.health
      const initialDir = Player.dir

      eval(jsCommands) // Execute the translated JavaScript commands

      // Log direction change only if it happened
      if (Player.dir !== initialDir) {
        logAction(`turning ${Player.dir.toLowerCase()}`)
      }
    } catch (error) {
      console.log("There's something wrong with your code")
    }

    if (i > 25) {
      clearInterval(loop)
    }
  }, 500)
}

function convertPythonToJS(pythonCode) {
  const lines = pythonCode.trim().split("\n")
  let jsCode = ""
  let indentStack = [0]
  let currentIndent = 0

  // First pass: validate and process indentation
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === "") continue

    // Count leading spaces (convert tabs to 4 spaces first)
    const processedLine = line.replace(/\t/g, "    ")
    const indentLevel = processedLine.search(/\S/)
    if (indentLevel === -1) continue

    const trimmedLine = processedLine.trim()

    // Handle dedents
    while (indentLevel < currentIndent) {
      jsCode += "} "
      indentStack.pop()
      currentIndent = indentStack[indentStack.length - 1]
    }

    // Validate indentation
    if (indentLevel > currentIndent && indentLevel !== currentIndent + 4) {
      throw new Error(
        `Invalid indentation at line ${i + 1}. Expected ${
          currentIndent + 4
        } spaces but got ${indentLevel}`
      )
    }

    // Process the line
    if (trimmedLine.startsWith("if ")) {
      const condition = trimmedLine.substring(3, trimmedLine.length - 1)
      jsCode += `if (${condition}) {`
      currentIndent = indentLevel
      indentStack.push(currentIndent)
    } else if (trimmedLine.startsWith("elif ")) {
      if (indentStack.length <= 1) {
        throw new Error(
          `Invalid 'elif' at line ${
            i + 1
          }. 'elif' must follow an 'if' statement.`
        )
      }
      const condition = trimmedLine.substring(5, trimmedLine.length - 1)
      jsCode += `} else if (${condition}) {`
    } else if (trimmedLine.startsWith("else:")) {
      if (indentStack.length <= 1) {
        throw new Error(
          `Invalid 'else' at line ${
            i + 1
          }. 'else' must follow an 'if' statement.`
        )
      }
      jsCode += "} else {"
    } else if (trimmedLine.startsWith("while ")) {
      const condition = trimmedLine.substring(6, trimmedLine.length - 1)
      jsCode += `while (${condition}) {`
      currentIndent = indentLevel
      indentStack.push(currentIndent)
    } else {
      jsCode += trimmedLine + ";"
    }
    jsCode += "\n"
  }

  // Close any remaining blocks
  while (indentStack.length > 1) {
    jsCode += "} "
    indentStack.pop()
  }

  return jsCode
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
    // console.log("current:" + level) // Output example: 5

    if (!win) {
      console.log("Pick up all the coins!")
    }

    if (win) {
      clearInterval(loop)

      if (isNaN(level)) level = parseInt(level.slice(1))

      if (level < 15) {
        // Extract the number part of the level and increment it
        level++
        // console.log("before:", level)
        if (receivedSkill === "Beginner") level = `b` + level
        if (receivedSkill === "Intermediate") level = `i` + level
        // console.log("mainjs_level:", level) // Updated level

        // Play a random win sound
        var audio = new Audio(
          Math.random() > 0.5
            ? "assets/sounds/win1.wav"
            : "assets/sounds/win2.wav"
        )
        audio.play()

        document.getElementById("console-log-text").textContent = ""
        console.log("You won!")
        Player.health = 100
        Map.map.splice(0, Map.map.length)
        UIkit.modal("#level-complete-modal").show()
      } else {
        document.getElementById("console-log-text").textContent = ""
        console.log("Congratulations! You've finished the game!")
        Player.health = 100
        Map.map.splice(0, Map.map.length)

        // console.log("check:", level) // Output example: 15
        UIkit.modal("#game-complete-modal").show()
      }
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
