import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.highlight ? 'W' : props.value}
    </button>
  );
}


class Board extends React.Component {
  

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
				highlight = {this.props.highlight[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
		
	
  render() {

		let squares = [];
		for(let i = 0; i < 3; i++){
			let row = [];
			for(let j = 0; j < 3; j++) {
				row.push(this.renderSquare(i*3 + j));
			}
			squares.push(<div className="board-row"> {row} </div>);
		}
		return (
			<div>
				{squares}
			</div>
		);
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				x : null,
				y : null,
				highlight: Array(9).fill(false),
			}],
			stepNumber: 0,
			xIsNext: true,
			yList : [1,1,1,2,2,2,3,3,3],
			xList : [1,2,3,1,2,3,1,2,3],
			isAscending : true,
			updateWinner : true,
		};
	}
	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(calculateWinner(squares) || squares[i]) {
			return;
		}
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
			history : history.concat([{
				squares: squares,
				x : this.state.xList[i],
				y : this.state.yList[i],
				highlight : Array(9).fill(false),
			}]),
			stepNumber : history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}
  render() {
		const history  = this.state.history;
		const current = history[this.state.stepNumber];
		let winner = null;
		if(history.length===10) {
			winner = 'Draw';
		}
		if(this.state.updateWinner && calculateWinner(current.squares)) {
			winner = calculateWinner(current.squares)[0];
			const highlight = current.highlight;
			highlight[calculateWinner(current.squares)[1]] = true;
			highlight[calculateWinner(current.squares)[2]] = true;
			highlight[calculateWinner(current.squares)[3]] = true;
			this.setState({
				history : history.concat([{
					squares: current.squares,
					highlight : highlight,
				}]),
				updateWinner : false,
			});
		}
		const moves = [];
		if(!this.state.isAscending){
		for(let move = history.length-1; move > -1;  move--){
			const step = history[move];
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			const location = step.x ? step.x + ',' + step.y : null;
			if(move === this.state.stepNumber) {
				moves.push(
					<li key={move}>
					<button onClick = { () => this.jumpTo(move)}> <b> {desc} </b> </button>
					<p> {location} </p>
					</li>
				);
			}
			else {
				moves.push(
				<li key={move}>
				<button onClick = { () => this.jumpTo(move)}> {desc} </button> 
				<p> {location} </p>
				</li>
			);
		}
	}
		}
		else{
		for(let move = 0; move < history.length;  move++){
			const step = history[move];
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			const location = step.x ? step.x + ',' + step.y : null;
			if(move === this.state.stepNumber) {
				moves.push(
					<li key={move}>
					<button onClick = { () => this.jumpTo(move)}> <b> {desc} </b> </button>
					<p> {location} </p>
					</li>
				);
			}
			else {
				moves.push(
				<li key={move}>
				<button onClick = { () => this.jumpTo(move)}> {desc} </button> 
				<p> {location} </p>
				</li>
				);
			}
		}
		}

		
		let toggle = this.state.isAscending ? 'Descending order' : 'Ascending order';
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		}
		else {
			status =  'Next Player: ' + (this.state.xIsNext ? 'X'  : 'O');
		}
    return (
      <div className="game">
        <div className="game-board">
          <Board 
						squares={current.squares}
						onClick={ (i) => this.handleClick(i) }
						highlight={current.highlight}
				/>
        </div>
        <div className="game-info">
          <div>{status}</div>
					<button onClick={()  => {this.setState({isAscending : !this.state.isAscending,})}}>{toggle} </button>
					<ol> {moves} </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
	const lines = [
		[0,1,2], 
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];
	for(let i = 0; i < lines.length; i++){
		const  [a, b, c] =  lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], a, b, c];
		}
	}
	return null;
}
