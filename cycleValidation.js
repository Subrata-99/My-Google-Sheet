//Storage -> 2D matrix
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     //why array ? -> More than one child relation
//     row.push([]);
//   }
//   graphComponentMatrix.push(row);
// }

/*----------------------Use to check cyclic nature of cells------------------------*/
function isGraphCyclic(graphComponentMatrix) {
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = []; //Node visited trace
    let dfsVisitedRow = []; //Stack visited trace
    for (let j = 0; j < cols; j++) {
      //Initially all the array elements are set to false.
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] == false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        //When found cycle return true immediately
        if (response == true) return [i, j];
      }
    }
  }
  return null;
}

// Start -> visited(TRUE) dfsVisited(TRUE)
// End -> dfsVisited(FALSE)
// If visited[i][j] -> already explored path -> Go back.
// Cycle detection condition -> if(visited[i][j] == true && dfsVisited[i][j] == true) visited
// Return -> True/False
function dfsCycleDetection(
  graphComponentMatrix,
  srcRow,
  srcCol,
  visited,
  dfsVisited
) {
  visited[srcRow][srcCol] = true;
  dfsVisited[srcRow][srcCol] = true;

  //for eg: A1 --> [ [0,1], [1,0], [2,1], [3,10], ...] ]
  for (
    let children = 0;
    children < graphComponentMatrix[srcRow][srcCol].length;
    children++
  ) {
    let [nbrRow, nbrCol] = graphComponentMatrix[srcRow][srcCol][children];
    if (visited[nbrRow][nbrCol] == false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        nbrRow,
        nbrCol,
        visited,
        dfsVisited
      );
      if (response == true) return true; //When found cycle return true immediately
    } else if (
      visited[nbrRow][nbrCol] == true &&
      dfsVisited[nbrRow][nbrCol] == true
    ) {
      //When found cycle return true immediately
      return true;
    }
  }

  dfsVisited[srcRow][srcCol] = false;
  return false;
}
