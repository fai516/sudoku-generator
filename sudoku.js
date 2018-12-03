'use strict';
const version = "v1.0a";
class Square extends React.Component {
  render() {
      return (
      <div className="square">
        <input type="text" 
               id={this.props.id}
               maxLength="2"
               value={this.props.value}
               //defaultValue={this.props.id}
               onChange = {this.props.handleInput}
               readOnly/>
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
    var tmp = dummyPuzzleExample();
    /* under construction */
    this.possibleValuesOfIndexes = Array.from({length:81},
      ()=>Array.from({length:9},(x,i)=>i+1));
    this.possibleValuesOfIndexes.reset = function(){
      this.possibleValuesOfIndexes = Array.from({length:81},
      ()=>Array.from({length:9},(x,i)=>i+1));
    }
    /* under construction */

    this.state = {
      version: version,
      squares: Array(81).fill("0"),
      //squares: tmp,
      message: ""
    };
    this.handleSquareInput=this.handleSquareInput.bind(this);
    this.puzzleGenerator=this.puzzleGenerator.bind(this);
    this.checkValid=this.checkValid.bind(this);
    this.getValueByIndex=this.getValueByIndex.bind(this);
    this.setMessage=this.setMessage.bind(this);
  }
  setMessage(type,input){
    var output;
    switch(type){
      case "Validation":output=`Puzzle is ${(input?"Valid":"NOT Valid")}`;break;
      case "Generation":output=`Time elapsed: ${input.toString()}ms`;break;
      default:output=""
    }
    this.setState({message: output});
  }
  checkValid(){
    console.log("checkValid()");
    const parameterContainer = ["row","col","grid"];
    const cRefs = { //corresponding references
      "row": "col",
      "col": "row",
      "grid": "grid"
    };
    for(let argu of parameterContainer){
      const cIndexes = indexGenerator(9,cRefs[argu]);
      for(let cIndex of cIndexes){
        let indexes = indexGenerator(9,argu,cIndex)
        const values = this.getValueByIndex(indexes)
        if(hasRedundancy(values)) return false;
      }
    }
    return true;
  }

  getValueByIndex(indexes){
    return Array.from(indexes,x=>this.state.squares[x]);
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * puzzleGenerator() randomizes puzzle configuration.
   * Return type: Array(81)[string]
   * Explantion:
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  puzzleGenerator(){
    var tBegin = performance.now();
    let out = Array(81); //output array initialization.
    /* possibleValue records all possible values of the squares.
       Initially, all 81 squares have possible value of [1-9] */
    let possibleValuesOfIndexes=Array.from({length:81},
                                  ()=>Array.from({length:9},(x,i)=>i+1));



    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * randomPick(index):
     * Purpose: draw a value inside possibleValue[] with selected index 
     * Parameter: index=selected index of square.
     * Return: Number between 1 to 9
     * Algorithm:
     *  1. Get the array A of possible value with input index
     *  2. If the array A contains only one value, return the only value
     *  3. Accquire the index of the array randomly (rIndex)
     *  4. Return array[rIndex]
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    let randomPick = function(index){
      let A = possibleValuesOfIndexes[index];
      if(A.length==1) return A[0];
      let rIndex = Math.floor(Math.random()*A.length);
      return A[rIndex];
    }
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cleanUpPossibleValue(index,pick)
     * Purpose: eliminate possible value {pick} of related indexes. 
     *          Related indexes refers to all indexes of corresponding row, col, 
     *          and grid. This function is always utilized along with 
     *          randomPick().
     * Return: Nothing Return.
     * Algorithm:
     *  1. Collect all index arrays of row,col,grid
     *  2. Combine these arrays as {A} and trim out the irrelevant 
     *     (we don't need smaller index because the generator iterate from low
     *      to high)
     *  3. Iterate array {A} with following:
     *      i)   Get the index that contains a number {pick}
     *      ii)  If it's not found, ignore all the following below and 
     *           continue the loop
     *      iii) If it's found, name as index {x}, replace {p[A[x]]} with the final
     *           value {p[A[-1]]}
     *      iv)  Pop the last element of array {A}.
     *          
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    let cleanUpPossibleValue = function(index,pick){
      //console.log(`cleanUp()\nindex=${index} pick=${pick}`)
      let row = indexGenerator(9,"row",index);
      let col = indexGenerator(9,"col",index);
      let grid = indexGenerator(9,"grid",index);
      let related = filterIndexes([row,col,grid],index);
      let l = related.length;
      //console.log(related);
      for(var i=0;i<l;i++){
        let PVarray = possibleValuesOfIndexes[related[i]];
        let targetValueIndex = PVarray.indexOf(pick);
        if(targetValueIndex==-1)continue;
        PVarray[targetValueIndex] = PVarray[PVarray.length-1];
        PVarray.pop();
      }
    }
    let length = out.length;
    let again = true;
    let maxLoop = 5000;
    while(again&&maxLoop--){
      possibleValuesOfIndexes=Array.from({length:81},
        ()=>Array.from({length:9},(x,i)=>i+1));
      for(var i=0;i<81;i++){
        let selectedValue = randomPick(i);
        if(selectedValue==undefined) break;
        cleanUpPossibleValue(i,selectedValue);
        out[i] = selectedValue;
        if(i==80) again = false;
      }
    }

    out = out.map(x=>x.toString());
    this.setState({
      squares: out
    });
    var tEnd = performance.now();
    return (tEnd-tBegin).toFixed(2);
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
        <div id="function">
          <div id="message">{this.state.message}</div>
          <input type="button" defaultValue="Check Correctness" onClick={()=>this.setMessage("Validation",this.checkValid())}></input>
          <input type="button" defaultValue="Generare Puzzle" onClick={()=>this.setMessage("Generation",this.puzzleGenerator())}></input>
          <div id="version">{this.state.version}</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
  * hasRedundancy() check if there is repeat in the input array
  * Parameter: arr: Array of numbers
  * Return type: Boolean. True if the array contains redundant number; otherwise, false.
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
function hasRedundancy(arr){
  let exist = new Set;
  var length = arr.length;
  for(var i=0;i<length;i++){
    if(exist.has(arr[i])){
      return true;
    }
    exist.add(arr[i]);
  }
  return false;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  indexGenerator(d,t,pos):
 *  Purpose: Create an Array of index numbers correspond to specific index and type.
 *  Parameter: d = Dimention of the puzzle. sudoku is a 9x9 puzzle so the default value is 9. It has to be square number.
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
 * 
 * Note: This function is very useful and essential. It can be massively
 *       reused in checkValid() and puzzleGenerator(), in order to mininize
 *       the scale of the source code.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function indexGenerator(d=9,t="row",pos){
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
      case "row": return createArray(d); //[0,1,2,..,8],d=9
      case "col": return createArray(d,x=>d*x); //[0,9,18,..,72],d=9

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
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * filterIndexes(target=[],minIndex):
 * Purpose: Remove redundency and filter any index is larger than minIndex
 * Parameter: p= The puzzle array itself. A 9 by 9 puzzle contains 81 elements/value
 *           targrt= An array of array of index. It contains a series of position you want to convert
 *           minIndex = Minimum of the index that is required. If the element of the 
 *                      target is less than or equal to minIndex, the element would not
 *                      be considered in the result array.
 * Return: Array of index which is combined from the input indexes without redundency and its 
 *         are all greater than minIndex.
 * Example: 1.target=[[3,4,5,11,12]] 
 *          -> result=[3,4,5,11,12]
 *          2.target=[[3,4,5,11,12],[1,2,3,4,5,12,100]] 
 *          -> result=[3,4,5,11,12,1,2,100]
 *          3.target=[[3,4,5,11,12],[1,2,3,4,5,12,100]],minIndex=11 
 *          -> result=[12,100]
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function filterIndexes(target=[[]],minIndex){
  if(minIndex==undefined) minIndex=-1;
  let out = [];
  let exist = new Set;
  for(var i=0;i<target.length;i++){
    let l = target[i].length;
    for(var j=0;j<l;j++){
      let n = target[i][j];
      if(!exist.has(n)&&n>minIndex){
        exist.add(n);
        out.push(n);
      }
    }
  }
  return out;
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