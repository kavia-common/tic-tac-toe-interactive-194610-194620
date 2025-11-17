import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Utility: all winning line triplets (indices in a 1D array of 9 cells).
 */
const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diags
  [2, 4, 6],
];

/**
 * PUBLIC_INTERFACE
 * Calculates winner given a 9-cell board array and returns:
 * - winner: 'X' | 'O' | null
 * - line: the winning line indices or null
 */
export function calculateWinner(cells) {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * PUBLIC_INTERFACE
 * A single board square button.
 */
function Square({ value, onClick, isWinning }) {
  /** This is a public function component for an individual click-able square. */
  return (
    <button
      className={`ttt-square ${isWinning ? 'is-winning' : ''} ${value ? 'filled' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Scoreboard component showing X and O scores.
 */
function Scoreboard({ scoreX, scoreO }) {
  /** This is a public function component for rendering the scoreboard. */
  return (
    <div className="scoreboard" role="group" aria-label="Scoreboard">
      <div className="score score-x">
        <span className="label">X</span>
        <span className="value">{scoreX}</span>
      </div>
      <div className="score score-o">
        <span className="label">O</span>
        <span className="value">{scoreO}</span>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component rendering the 3x3 grid.
 */
function Board({ cells, onCellClick, winningLine }) {
  /** This is a public function component for rendering a 3x3 grid board. */
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {cells.map((val, idx) => {
        const isWinning = winningLine ? winningLine.includes(idx) : false;
        return (
          <Square
            key={idx}
            value={val}
            onClick={() => onCellClick(idx)}
            isWinning={isWinning}
          />
        );
      })}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App component housing the Tic Tac Toe game logic and UI.
 */
function App() {
  /** This is a public function component for the Tic Tac Toe app. */
  const [theme] = useState('light'); // lock to light per style guide
  const [cells, setCells] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [locksMoves, setLocksMoves] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const { winner, line } = useMemo(() => calculateWinner(cells), [cells]);
  const isBoardFull = useMemo(() => cells.every((c) => c !== null), [cells]);
  const isDraw = !winner && isBoardFull;

  useEffect(() => {
    // Lock moves and update score upon win
    if (winner) {
      setLocksMoves(true);
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (isDraw) {
      setLocksMoves(true);
    }
  }, [winner, isDraw]);

  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleCellClick = (idx) => {
    if (locksMoves || cells[idx]) return; // prevent moves after game end or on filled cell
    setCells((prev) => {
      const next = prev.slice();
      next[idx] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  const handleResetBoard = () => {
    setCells(Array(9).fill(null));
    setXIsNext(true);
    setLocksMoves(false);
  };

  const handleResetScores = () => {
    setScore({ X: 0, O: 0 });
    handleResetBoard();
  };

  let statusText = `Current Player: ${currentPlayer}`;
  if (winner) {
    statusText = `Winner: ${winner} 🎉`;
  } else if (isDraw) {
    statusText = "It's a draw 🤝";
  }

  return (
    <div className="App">
      <main className="game-shell">
        <h1 className="title">Tic Tac Toe</h1>
        <Scoreboard scoreX={score.X} scoreO={score.O} />
        <div className="status" aria-live="polite">{statusText}</div>
        <Board cells={cells} onCellClick={handleCellClick} winningLine={line} />
        <div className="controls">
          <button className="btn primary" onClick={handleResetBoard} aria-label="Reset game">
            Reset Game
          </button>
          <button className="btn accent" onClick={handleResetScores} aria-label="Reset scores">
            Reset Scores
          </button>
        </div>
        <footer className="footnote">
          Built with React • Light theme • Accents #3b82f6 / #06b6d4
        </footer>
      </main>
    </div>
  );
}

export default App;
