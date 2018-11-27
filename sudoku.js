'use strict';
class Square extends React.Component {
  render() {
      return (
      <div className="square">
        <input type="text" 
               id={this.props.id}
               maxLength="1"
               defaultValue={this.props.value}
               onInput = {this.props.handleInput}/>
      </div>
      );
  }
}

class Board extends React.Component{
  showProperValue(c){
    return (c>="1"&&c<="9"?c:"");
  }
  render(){
    let squareItems = []; //list of square item
    for(var i=0;i<81;i++){//pushing 81 square into the list
      squareItems.push(
        <Square value={this.showProperValue(this.props.sqaures[i])} 
                key={i} 
                id={i}
                handleInput={this.props.handleSquareInput}
        />
      );
    }
    return(
      <div id="board">
        {squareItems}
      </div>
    )
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      squares: Array(81).fill("0")
    };
    this.handleSquareInput=this.handleSquareInput.bind(this);
  }
  handleSquareInput(evt){
    console.log("setState begin")
    this.setState({
      squares: Array(81).fill("0")
    });
    console.log("setState end")
    /*
    let num = evt.nativeEvent.data;
    let pos = parseInt(evt.target.id);
    let arr = this.state.squares;
    console.log(`s[${pos}]->${num}`);
    this.state.squares = arr.slice(0,pos).concat(num).concat(arr.slice(pos+1,81));
    console.log(this.state.squares);
    */
  }
  render(){
    return(
      <div id="game">
        <Board sqaures={this.state.squares}
               handleSquareInput={(evt)=>this.handleSquareInput(evt)}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

