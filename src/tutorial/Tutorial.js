import React from "react";
import './index.css'

function Square(props) {
	return (
		<button className={`square ${props.highLight ? 'high-light' : ''}`} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				highLight={this.props.highLight.includes(i)}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const board = [0, 3, 6].map(row =>
			<div className="board-row">
				{[0, 1, 2].map(col =>
					this.renderSquare(row + col)
				)}
			</div>
		)

		return (
			<div>
				{board}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					point: null
				}
			],
			stepNumber: 0,
			xIsNext: true,
			historyDesc: false,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					point: i + 1
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	handleSortClick() {
		this.setState({
			historyDesc: !this.state.historyDesc
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const {winner, line: highLight} = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const descText = move ?
				`Go to move #${move}(${step.point % 3 || 3}, ${Math.floor((step.point - 1) / 3 + 1)})` :
				'Go to game start';
			const desc = this.state.stepNumber === move ? (<strong>{descText}</strong>) : descText
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		if (this.state.historyDesc) {
			moves.reverse();
		}

		let status;
		if (winner) {
			status = <h2>{"Winner: " +winner}</h2>;
		} else {
			if (this.state.stepNumber === 9) {
				status = <h2>Equal</h2>
			} else {
				status = "Next player: " + (this.state.xIsNext ? "X" : "O");
			}
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						highLight={highLight || []}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.handleSortClick()}>Reserve</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

// ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {winner: squares[a], line: [a, b, c]};
		}
	}
	return {};
}

export default Game
