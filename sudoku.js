'use strict';
class Square extends React.Component {
  render() {
      return (
      <div className="square">
        <input type="text" 
               id={this.props.id}
               maxLength="1"
               //defaultValue={this.props.value}
               defaultValue={this.props.id}
               onInput = {this.props.handleInput}/>
      </div>
      );
  }
}

class Puzzle extends React.Component{
  showProperValue(c){
    return (c>="1"&&c<="9"?c:"");
  }
  render(){
    let squareItems = []; //list of square item
    for(var i=0;i<81;i++){//pushing 81 square into the list
      squareItems.push(
        <Square value={this.showProperValue(this.props.sqaures[i])} 
                key={i} 
                //id={i}
                id={`${Math.floor(i/9)},${i%9}#${i}`}
                handleInput={this.props.handleSquareInput}
        />
      );
    }
    return(
      <div id="puzzle">
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
    dummyStart();
  }
  handleSquareInput(evt){
    console.log("setState begin")
    this.setState({
      squares: Array(81).fill(evt.nativeEvent.data)
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
  generatePuzzle
  render(){
    return(
      <div id="game">
        <Puzzle sqaures={this.state.squares}
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

/*
  square:[0,81]


*/
function dummyStart(){

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getColValuesFromPos(arr,pos):
 *  Purpose: return a list of all squares value with the same column of a given position
 *  Argument: arr = an ref array with length of 81, which stores all square values.
 *            pos = position of a square [0..80]
 *  Return type: Array(9)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function getColValuesFromPos(arr,pos){
  let colRef = pos%9; //nth column of the position [0..8]

  /*
   *  Explain: Array.from() returns an array [0..8] because .keys() return iterators from a length           *  of 9 array. For example, if pos=12 then colRef=3 it will first generator an array                      *  [0..8] and transfer into [3,12,21,..,75](these are indexes of targetValue) then maps into 
   *  cooresponing value as final result. 
   */
  return Array.from(Array(9).keys(),n =>arr[n*9+colRef]);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getRowValuesFromPos(arr,pos):
 *  Purpose: return a list of all squares value with the same row of a given position
 *  Argument: arr = an ref array with length of 81, which stores all square values.
 *            pos = position of a square [0..80]
 *  Return type: Array(9)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function getRowValuesFromPos(arr,pos){ //row
  let rowRef = Math.floor(pos/9); //nth row of the position [0..8]

  /* 
   * Explain: Same idea of getColValuesFromPos()
   *          If pos=22,then rowRef=2
   *          [0..8]->[18,19,..,26]->[arr[18],arr[19],..,arr[26]]
   */
  return Array.from(Array(9).keys(),n =>arr[n+9*rowRef]); 
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  getGridValuesFromPos(arr,pos):
 *  Purpose: return a list of all squares value with the same grid of a given position. A grid is a 3 by 3  *            squares collection
 *  Argument: arr = an ref array with length of 81, which stores all square values.
 *            pos = position of a square [0..80]
 *  Return type: Array(9)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function getGridValuesFromPos(arr,pos){ //3x3 grid
  /* 
   * GridRowRef and GridColRef:
   *  Any position number will be transform into top-left sqaure from its enclosed grid. 
   *  For example, position [0-2,9-11,18-20] all point to Grid#0 (0,0)
   *  [60-62,69-71,78-80] -> Grid#8 (6,6)
   */
  let [gRowRef,gColRef] = [Math.floor(pos/9),pos%9].map(x=>Math.floor(x/3)*3);

  /* 
   * This creates row numbers of its belonging Grid. Notice that Grid#0-2 has the same row numbers. For      *  example, when pos=67 -> [gRowRef,gColRef]=[6,3] -> rowsArray=[6,7,8]
   */
  let rowsArray = Array.from(Array(3).keys(),x=>x+gRowRef)



  return rowsArray.reduce(function(acc,cur){
    return acc.concat(Array.from(Array(3).keys(),x=>arr(9*cur+gColRef+x)))
  },[])
  /* 

  */
}