'use strict';
class Square extends React.Component {
  render() {
      return (
      <div className="square">
        <input type="text" 
               id={this.props.id}
               maxLength="2"
               //value={this.props.value}
               defaultValue={this.props.id}
               onChange = {this.props.handleInput}readOnly/>
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
                id={i}
                //id={`${Math.floor(i/9)},${i%9}#${i}`}
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
    this.rowIndexes = Array.from(Array(9).keys(),x=>9*x);
    //[0-8]
    let colIndexes = Array.from(Array(9).keys());
    //[0,3,6,27,30,33,54,57,60]
    let gridIndexes = Array.from(Array(3).keys(),x=>3*x).reduce(function(acc,cur){
      return acc.concat(Array.from(Array(3).keys(),x=>27*x+cur))
    },[])
    this.state = {
      //squares: Array(81).fill("0")
      squares: dummyPuzzleExample(),
    };
    this.handleSquareInput=this.handleSquareInput.bind(this);
    this.puzzleGenerator=this.puzzleGenerator.bind(this);
    this.puzzleGenerator();
  }

  puzzleGenerator(){
    let arr = this.state.squares;
    console.log(indexGenerator(9,"row",42))

  }

  handleSquareInput(evt){
    console.log("setState begin")
    let input = evt.nativeEvent.data;
    let char = (input>="1"&&input<="9"?input:"0");
    this.setState({
      squares: Array(81).fill(char)
    });
    console.log(this.state.squares)
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  indexGenerator(d,t,pos):
 *  Purpose: Create an Array of index numbers correspond to specific index and type.
 *  Argument: d = Dimention of the puzzle. sudoku is a 9x9 puzzle so the default value is 9
 *            t = Type of direction. Either "row", "col", or "grid". Otherwise it returns 
 *                empty array
 *            pos = index of specific square. If pos is not given, it will only print either
 *                  1st row/col or grid ref index depending on type of direction; otherwise 
 *                  it output its corresponding indexes.
 *  Return type: Array(9)[Number]
 *  Example: indexGenerator(9,t):
 *           t="row"  -> [0,9,18,27,36,45,54,63,72]
 *           t="col"  -> [0,1,2,3,4,5,6,7,8]
 *           t="grid" -> [0,3,6,27,30,33,54,57,60]
 * 
 *           indexGenerator(9,t,42):
 *           t="row"  -> [36,37,38,39,40,41,42,43,44]
 *           t="col"  -> [6,15,24,33,42,51,60,69,78]
 *           t="grid" -> [33,34,35,42,43,44,51,52,53]
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function indexGenerator(d=9,t,pos){
  let base = Math.sqrt(d);
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
   * createArray() create a length of {l} array[0..l] and maps to function {func}
   * Example: createArray(9,x=>x*x)
   *          [0..9] -> [0,1,4,9,..,64]
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
  let createArray = function(l,func){
    return Array.from(Array(l).keys(),func);
  }
  if(pos==undefined){
    switch(t){
      case "row": return createArray(d,x=>d*x); //[0,9,18,..,72],d=9
      case "col": return createArray(d); //[0,1,2,..,8],d=9

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       * The first createArray() output [0,27,54],d=9
       * The callback takes each element to create a new array and combine the result of 
       * last callback.
       * Walkthrough:
       * 0  -> [0,3,6]
       * 27 -> [27,30,33]
       * 54 -> [54,57,60]
       * final result: [0,3,6,27,30,33,54,57,60]
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      case "grid": return createArray(base,x=>base*d*x).reduce(function(acc,cur){
        return acc.concat(createArray(base,x=>cur+x*base))
      },[])//[0,3,6,27,30,33,54,57,60],d=9
      default: return [];
    }
  }
  else{
    let rowRef = Math.floor(pos/9); //rowRef=4 => pos=42
    let colRef = pos%d; //colRef=6 => pos=42

    //rowRef=4,colRef=6 => [3,6]
    let [gRowRef,gColRef] = [rowRef,colRef].map(x=>Math.floor(x/base)*base);
    switch(t){
      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       * Example: pos=42,then rowRef=4,colRef=6
       * case "row":  all the indexes in the 4th row [36,37,38,..,43,44]
       * case "col":  all the indexes in the 6th col [6,15,24,..,69,78]
       * case "grid": rowRef=4,colRef=6 belongs to ref index 33 [33,34,35,42,43,44,51,52,53]
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      case "row": return createArray(d,n=>n+9*rowRef); // return the {rowRef}th row
      case "col": return createArray(d,n=>n*9+colRef); // return the {colRef}th col
      case "grid":return createArray(base,x=>x+gRowRef).reduce(function(acc,cur){
          return acc.concat(createArray(base,x=>9*cur+gColRef+x))
        },[])
      default: return [];
    }
  }
}

function dummyPuzzleExample(){
  let str = "435269781"+
             "682571493"+
             "197834562"+
             "826195347"+
             "374682915"+
             "951743628"+
             "519326874"+
             "248957136"+
             "763418259";
  return [...str];
}
function dummyStart(){

}