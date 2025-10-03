import Cell from './Cell'
import './GameBoard.css'

function GameBoard({ board, onCellClick, gameOver, loading }) {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            disabled={gameOver || loading || cell !== ''}
          />
        ))
      )}
    </div>
  )
}

export default GameBoard
