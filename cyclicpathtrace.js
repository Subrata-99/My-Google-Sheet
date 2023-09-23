//For delaying promise to change color correctly
function colorDelayPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
  let [srcr, srcc] = cycleResponse;
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

  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < cols; j++) {
  //       if (visited[i][j] == false) {
  //         let response = dfsCycleDetectionTracePath(
  //           graphComponentMatrix,
  //           i,
  //           j,
  //           visited,
  //           dfsVisited
  //         );
  //         //When found cycle return true immediately
  //         if (response == true) return true;
  //       }
  //     }
  //   }

  let response = await dfsCycleDetectionTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );
  if (response === true) return Promise.resolve(true);
  return Promise.resolve(false);
}

//Coloring cells while tracing
async function dfsCycleDetectionTracePath(
  graphComponentMatrix,
  srcRow,
  srcCol,
  visited,
  dfsVisited
) {
  visited[srcRow][srcCol] = true;
  dfsVisited[srcRow][srcCol] = true;

  let cell = document.querySelector(`.cell[rid="${srcRow}"][cid="${srcCol}"]`);

  cell.style.backgroundColor = "lightblue"; // While tracing cycle make each cells lightblue.
  await colorDelayPromise(); // 1 second delay

  for (
    let children = 0;
    children < graphComponentMatrix[srcRow][srcCol].length;
    children++
  ) {
    let [nbrRow, nbrCol] = graphComponentMatrix[srcRow][srcCol][children];
    if (visited[nbrRow][nbrCol] == false) {
      let response = await dfsCycleDetectionTracePath(
        graphComponentMatrix,
        nbrRow,
        nbrCol,
        visited,
        dfsVisited
      );
      if (response == true) {
        cell.style.backgroundColor = "transparent"; // While returning make the cell again back to normal transparent.
        await colorDelayPromise(); // 1 second delay
        return Promise.resolve(true);
      }
    } else if (
      visited[nbrRow][nbrCol] == true &&
      dfsVisited[nbrRow][nbrCol] == true
    ) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${nbrRow}"][cid="${nbrCol}"]`
      );
      cyclicCell.style.backgroundColor = "lightsalmon"; // When cyclic cell detected, make the cell color salmon
      await colorDelayPromise(); // 1 second delay

      cyclicCell.style.backgroundColor = "transparent"; // Now after that while returning make the cell again back to normal transparent.

      cell.style.backgroundColor = "transparent";
      await colorDelayPromise(); // 1 second delay
      return Promise.resolve(true);
    }
  }

  dfsVisited[srcRow][srcCol] = false;
  return Promise.resolve(false);
}
