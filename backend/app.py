from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Game state storage (in production, use a database)
games = {}

class TicTacToeGame:
    def __init__(self):
        self.board = [['', '', ''], ['', '', ''], ['', '', '']]
        self.current_player = 'X'
        self.game_over = False
        self.winner = None
        self.moves_count = 0

    def make_move(self, row, col):
        if self.game_over or self.board[row][col] != '':
            return False
        
        self.board[row][col] = self.current_player
        self.moves_count += 1
        
        # Check for winner
        if self.check_winner():
            self.winner = self.current_player
            self.game_over = True
        elif self.moves_count == 9:
            self.game_over = True
            self.winner = 'tie'
        else:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
        
        return True

    def check_winner(self):
        # Check rows
        for row in self.board:
            if row[0] == row[1] == row[2] != '':
                return True
        
        # Check columns
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != '':
                return True
        
        # Check diagonals
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != '':
            return True
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != '':
            return True
        
        return False

    def reset(self):
        self.__init__()

    def get_state(self):
        return {
            'board': self.board,
            'current_player': self.current_player,
            'game_over': self.game_over,
            'winner': self.winner,
            'moves_count': self.moves_count
        }

@app.route('/api/game/new', methods=['POST'])
def new_game():
    """Create a new game"""
    game_id = len(games) + 1
    games[game_id] = TicTacToeGame()
    return jsonify({
        'game_id': game_id,
        'state': games[game_id].get_state()
    })

@app.route('/api/game/<int:game_id>/state', methods=['GET'])
def get_game_state(game_id):
    """Get current game state"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    return jsonify(games[game_id].get_state())

@app.route('/api/game/<int:game_id>/move', methods=['POST'])
def make_move(game_id):
    """Make a move in the game"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.get_json()
    if not data or 'row' not in data or 'col' not in data:
        return jsonify({'error': 'Row and column are required'}), 400
    
    row, col = data['row'], data['col']
    
    if not (0 <= row <= 2 and 0 <= col <= 2):
        return jsonify({'error': 'Invalid position'}), 400
    
    game = games[game_id]
    if game.make_move(row, col):
        return jsonify(game.get_state())
    else:
        return jsonify({'error': 'Invalid move'}), 400

@app.route('/api/game/<int:game_id>/reset', methods=['POST'])
def reset_game(game_id):
    """Reset the game"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    games[game_id].reset()
    return jsonify(games[game_id].get_state())

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
