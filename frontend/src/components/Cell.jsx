import './Cell.css'

function Cell({ value, onClick, disabled }) {
  return (
    <button
      className={`cell ${value ? `cell-${value.toLowerCase()}` : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}

export default Cell
