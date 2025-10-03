import './GameStatus.css'

function GameStatus({ gameState, onNewGame, onReset, loading }) {
  const { current_player, game_over, winner, moves_count } = gameState

  const getStatusMessage = () => {
    if (game_over) {
      if (winner === 'tie') {
        return "It's a tie!"
      } else {
        return `Player ${winner} wins!`
      }
    } else {
      return `Current player: ${current_player}`
    }
  }

  return (
    <div className="game-status">
      <div className="status-info">
        <h2 className="status-message">{getStatusMessage()}</h2>
        <p className="moves-count">Moves: {moves_count}</p>
      </div>
      
      <div className="game-controls">
        <button
          className="btn btn-reset"
          onClick={onReset}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Reset Game'}
        </button>
        
        <button
          className="btn btn-new"
          onClick={onNewGame}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'New Game'}
        </button>
      </div>
    </div>
  )
}

export default GameStatus
