# Python Warrior
  - Python Warrior cannot be played without being connected to CodeHub, as it relies on data stored within CodeHub for proper functionality.

<p align="center">
  <img src="assets/images/Screenshot 2025-02-01 125724.png" alt="Image 1" width="200px" />
  <img src="assets/images/Screenshot 2025-02-01 130054.png" alt="Image 2" width="200px" />
</p>
## Player Class

This class represents the Player and provides several methods to control its behavior and interaction within a game environment.

### Methods / Commands

#### `setDir(dir)`
- **Description**: Sets the player's direction.
- **Parameters**: 
  - `dir` (String): Takes either `"LEFT"` or `"RIGHT"` to determine the direction the player is facing.

#### `setHealth(health)`
- **Description**: Sets the player's current health.
- **Parameters**:
  - `health` (Integer): The player's health value.

#### `getHealth()`
- **Description**: Returns the player's current health.
- **Returns**: 
  - `Integer`: The player's current health.

#### `walk()`
- **Description**: Moves the player forward in the current direction.

#### `skipWall()`
- **Description**: If the next field contains a wall (`'w'`), the player skips over it.

#### `openChest()`
- **Description**: Opens a chest if the next field contains one.

#### `getNext()`
- **Description**: Returns the type of the next field based on the player's current direction.
- **Returns**: 
  - `String`: Type of the next field.

#### `getChestDistance()`
- **Description**: Calculates the distance to the nearest chest, adjusting based on the player's current direction.
- **Returns**: 
  - `Integer`: 
    - `> 0`: Chest is in front.
    - `< 0`: Chest is behind.

#### `attack()`
- **Description**: Executes an attack in the player's current direction.

### Types of Fields
- **n**: Snake
- **m**: Scorpion
- **e**: Spider
- **c**: Chest
- **s**: Space
- **w**: Wall

## Example Usage

```python
player = Player()
player.setDir("RIGHT")
player.setHealth(100)
player.walk()

if player.getNext() == "c":
    player.openChest()
