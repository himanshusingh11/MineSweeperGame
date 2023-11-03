import React, { useState, useEffect } from "react";
import "./styles.css";

const ROWS = 5;
const COLS = 5;
const MIN_BOMBS = 1;
const MAX_BOMBS = 5;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [numBombs, setNumBombs] = useState(MIN_BOMBS);

  useEffect(() => {
    resetGame();
  }, [numBombs]);

  function resetGame() {
    setGrid([]);
    setBombs([]);
    setDiamonds([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setRevealAll(false);

    const newGrid = Array(ROWS)
      .fill()
      .map(() =>
        Array(COLS)
          .fill()
          .map(() => ({
            isBomb: false,
            isDiamond: false
          }))
      );

    const newBombs = generateRandomPositions(numBombs);
    const newDiamonds = generateRandomDiamonds(newBombs);

    newBombs.forEach((position) => {
      const [row, col] = position.split("-").map(Number);
      newGrid[row][col].isBomb = true;
    });

    newDiamonds.forEach((position) => {
      const [row, col] = position.split("-").map(Number);
      newGrid[row][col].isDiamond = true;
    });

    setGrid(newGrid);
    setBombs(newBombs);
    setDiamonds(newDiamonds);
  }

  function generateRandomPositions(num) {
    const positions = [];
    while (positions.length < num) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      const position = `${row}-${col}`;
      if (!positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions;
  }

  function generateRandomDiamonds(bombPositions) {
    const diamondPositions = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const position = `${row}-${col}`;
        if (!bombPositions.includes(position)) {
          diamondPositions.push(position);
        }
      }
    }
    return diamondPositions;
  }

  function handleClick(row, col) {
    if (gameOver || gameWon || grid[row][col].isClicked) {
      return;
    }

    const cell = grid[row][col];

    if (cell.isBomb) {
      setGameOver(true);
    } else if (cell.isDiamond) {
      setScore(score + 1);
    }

    const updatedGrid = [...grid];
    updatedGrid[row][col].isClicked = true;
    setGrid(updatedGrid);

    if (score === ROWS * COLS - numBombs) {
      setGameWon(true);
    }
  }

  function renderCell(row, col) {
    const cell = grid[row][col];
    let className = "cell";

    if (cell.isClicked) {
      className += " clicked";
      if (cell.isBomb) {
        className += " bomb";
        return (
          <div
            key={`${row}-${col}`}
            className={className}
            onClick={() => handleClick(row, col)}
          >
            💣
          </div>
        );
      } else if (cell.isDiamond) {
        className += " diamond";
        return (
          <div
            key={`${row}-${col}`}
            className={className}
            onClick={() => handleClick(row, col)}
          >
            💎
          </div>
        );
      }
    } else if (gameOver || revealAll) {
      if (cell.isBomb) {
        className += " bomb";
        return (
          <div key={`${row}-${col}`} className={className}>
            💣
          </div>
        );
      } else if (cell.isDiamond) {
        className += " diamond";
        return (
          <div key={`${row}-${col}`} className={className}>
            💎
          </div>
        );
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        onClick={() => handleClick(row, col)}
      ></div>
    );
  }

  return (
    <div className="App">
      <h1>Diamond Bomb Game</h1>
      <div className="options">
        <label>Number of Bombs (1-5): </label>
        <input
          type="number"
          min={MIN_BOMBS}
          max={MAX_BOMBS}
          value={numBombs}
          onChange={(e) => setNumBombs(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <div className="status">
        {gameOver && (
          <div>
            <p>Game Over! Try Again!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
        {gameWon && <p>Congratulations! You Won!</p>}
        <p>Score: {score}</p>
      </div>
    </div>
  );
};

export default App;
