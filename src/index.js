import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  PriorityQueue,
  MinPriorityQueue,
  MaxPriorityQueue,
  ICompare,
  IGetCompareValue,
} from '@datastructures-js/priority-queue';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }
  
  render() {
    return (
      <input className={ this.props.isActive ? 'active' : 'square' }
       onClick={() => {console.log("I am here!");this.props.onClick(this.props.value);}}
       onChange={(e) => {
          console.log("receive values: "+e.target.value);
          this.props.onValueChange(this.props.value, e.target.value);
        }
       }
      >
        {this.state.isActive}
      </input>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      activeIndex: null
    };
  }
  
  renderSquare(i) {
    return <Square value={i} onClick={ this.handleClick }
             onValueChange={this.onValueChange}
             isActive={ this.state.activeIndex === i } />;
  }
  
  handleClick = (index) => this.setState({ activeIndex: index })
  onValueChange = (index,value) => {
    const squares = this.state.squares.slice();    
    squares[index] = value;    
    this.setState({squares: squares});
    console.log(squares);
  }
  
  render() {
    const status = 'Next player: X';

    return (
      
      <div>
        <div onClick={() => {console.log("click!")}} className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.boardRef = React.createRef();
  }

  makeMove = (currState, rowIndex, colIndex, nextRowIndex, nextColIndex) => {
    let nextState = [];

    for (var i = 0; i < currState.length; i++)
      nextState[i] = currState[i].slice();

    let tmp = nextState[rowIndex][colIndex];
    nextState[rowIndex][colIndex] = nextState[nextRowIndex][nextColIndex];
    nextState[nextRowIndex][nextColIndex] = tmp;
    console.log("current move");
    console.log(currState);
    console.log("move made");
    console.log(nextState);
    return nextState;
  };

  slideUp = (currState) => {
    let rowIndex = currState.findIndex((subArr) => subArr.includes(0));
    let colIndex = (rowIndex > -1) ? currState[rowIndex].indexOf(0) : -1;
    console.log(rowIndex+ " "+ colIndex);
    if (rowIndex == 0) {

        return null;
    }

    return makeMove(currState, rowIndex, colIndex, rowIndex - 1, colIndex);
  }

  slideDown = (currState) => {
    let rowIndex = currState.findIndex((subArr) => subArr.includes(0));
    let colIndex = (rowIndex > -1) ? currState[rowIndex].indexOf(0) : -1;

    if (rowIndex == currState.length - 1) {
        return null;
    }
    
    return makeMove(currState, rowIndex, colIndex, rowIndex + 1, colIndex);
  }

  slideLeft = (currState) => {        
    let rowIndex = currState.findIndex((subArr) => subArr.includes(0));
    let colIndex = (rowIndex > -1) ? currState[rowIndex].indexOf(0) : -1;

    if (colIndex == 0) {
        return null;
    }
    
    return makeMove(currState, rowIndex, colIndex, rowIndex, colIndex - 1);
  }

  slideRight = (currState) => {                
    let rowIndex = currState.findIndex((subArr) => subArr.includes(0));
    let colIndex = (rowIndex > -1) ? currState[rowIndex].indexOf(0) : -1;

    if (colIndex == currState[rowIndex].length - 1) {
        return null;
    }

    return makeMove(currState, rowIndex, colIndex, rowIndex, colIndex + 1);
  }

  
  twoDimensional = (arr, size) => {
    let res = []; 
    for(let i=0; i < arr.length; i = i+size)
        res.push(arr.slice(i,i+size).map(ele => Number(ele)));
    return res;
  }

  findNeighbours = (currNode) => {      
    let currArr = currNode.arr;
    let nextMoves = [];
    // possible moves are going to be maximum 4.
    // if zero is in the middle of the matrix, then it is going to have 4 neighbours.
    // else if zero is in one of the edges, then it is going to have 3 neighbours.
    // else zero should be in one of the corners, and it would have 2 neighbours.

    // we are going to try to do all  possible moves and stop at impossible moves.

    if (nextState = slideUp(currArr)) {
      console.log("up move");
      console.log(nextState);
      console.log(currArr);
      console.log({arr: nextState, moveCount: currNode.moveCount + 1});
      nextMoves.push({arr: nextState, moveCount: currNode.moveCount + 1});
    }
    if (nextState = slideDown(currArr)) {
      console.log("down move");
      console.log(nextState);
      console.log(currArr);
      console.log({arr: nextState, moveCount: currNode.moveCount + 1});
      nextMoves.push({arr: nextState, moveCount: currNode.moveCount + 1});
    }
    if (nextState = slideLeft(currArr)) {
      console.log("left move");
      console.log(nextState);
      console.log(currArr);
      console.log({arr: nextState, moveCount: currNode.moveCount + 1});
      nextMoves.push({arr: nextState, moveCount: currNode.moveCount + 1});
    }
    if (nextState = slideRight(currArr)) {
      console.log("right move");
      console.log(nextState);
      console.log(currArr);
      console.log({arr: nextState, moveCount: currNode.moveCount + 1});
      nextMoves.push({arr: nextState, moveCount: currNode.moveCount + 1});
    }      
    return nextMoves;
  };


  isPuzzleSolved = (nodeArrVal) => {
    console.log("Is solved?")
    console.log(nodeArrVal);
    
    for (let i = 0; i < nodeArrVal.length; i++) {
      for (let j = 0; j < nodeArrVal[i].length; j++) {
        if (i == nodeArrVal.length - 1 && j == nodeArrVal[i].length -1) {
          if (nodeArrVal[i][j] != 0) {
            return false;
          }
        } else if (nodeArrVal[i][j] != (3*i+j+1)) {
          return false;
        }
      }
    }
    return true;
  };
  

  calculateMoves = (arrVal) => {
    
    let multiArr = twoDimensional(arrVal, 3);
    let node = {arr: multiArr, moveCount: 0};

    const boardQueue = new PriorityQueue((a, b) => {
        console.log("a, b "+ a);
        let hammingDistance = (mdArr) => {
           console.log("hamming "+mdArr);
           let distance = 0;
           for (let i = 0; i < mdArr.length; i++) {
            for (let j = 0; j < mdArr[i].length; j++) {
              if (i == mdArr.length - 1 && j == mdArr[i].length -1) {
                if (mdArr[i][j] != 0) {
                  distance++;
                }
              } else if (mdArr[i][j] != (3*i+j+1)) {
                distance++;
              }
            }
           }
           return distance;
        };
        
	    
        if ((hammingDistance(a.arr) + a.moveCount) < (hammingDistance(b.arr) + b.moveCount)) {
            return -1;
        } else if ((hammingDistance(a.arr) + a.moveCount) > (hammingDistance(b.arr) + b.moveCount)) {
            // prioratize for less distance
             return 1;
        }
        
        return 0;
      }
    );

    boardQueue.enqueue(node);
    console.log(boardQueue);
    let lastMove = null;
    top:
    while(!boardQueue.isEmpty()) {
      let currState = boardQueue.dequeue();
      console.log(currState);
      let nextMoves = findNeighbours(currState);
      console.log("next move arr");
      console.log(nextMoves);
      for (let move of nextMoves) {
        console.log("In for loop" + move);
        move.prevState = currState;
        if (isPuzzleSolved(move.arr)) {
          console.log(move.arr);
          lastMove = move;
          return lastMove;
        }
      }
      nextMoves.forEach(element => {
        console.log("next element"+ element);
        boardQueue.enqueue(element);
      });
    }
  };
  
  handleClick = () => { console.log(this.boardRef.current.state.squares);};

  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board ref={this.boardRef} />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
        <button onClick={ this.handleClick }>Find solution</button>
      </div>
    );
  }
  
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

