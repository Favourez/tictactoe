import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import './App.css'

function App() {
  const [gameId, setGameId] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create a new game when the component mounts
  useEffect(() => {
    createNewGame()
  }, [])

  const createNewGame = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/game/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to create new game')
      }
      
      const data = await response.json()
      setGameId(data.game_id)
      setGameState(data.state)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const makeMove = async (row, col) => {
    if (!gameId || gameState?.game_over) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/game/${gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row, col }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to make move')
      }
      
      const data = await response.json()
      setGameState(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetGame = async () => {
    if (!gameId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/game/${gameId}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to reset game')
      }
      
      const data = await response.json()
      setGameState(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !gameState) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
      </header>
      
      <main className="game-container">
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        {gameState && (
          <>
            <GameStatus 
              gameState={gameState}
              onNewGame={createNewGame}
              onReset={resetGame}
              loading={loading}
            />
            
            <GameBoard 
              board={gameState.board}
              onCellClick={makeMove}
              gameOver={gameState.game_over}
              loading={loading}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
