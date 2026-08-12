function calcPoints(rank, grade, category) {
  let rankPts = 0;
  if (category === 'General') {
    if (rank == 1) rankPts = 10;
    else if (rank == 2) rankPts = 8;
    else if (rank == 3) rankPts = 6;
  } else {
    if (rank == 1) rankPts = 5;
    else if (rank == 2) rankPts = 3;
    else if (rank == 3) rankPts = 1;
  }
  let gradePts = 0;
  if (grade === 'A') gradePts = 5;
  else if (grade === 'B') gradePts = 3;
  else if (grade === 'C') gradePts = 1;
  return rankPts + gradePts;
}
console.log(calcPoints(1, 'A', 'Senior')); // 5+5=10
console.log(calcPoints(1, 'A', 'General')); // 10+5=15
console.log(calcPoints(3, 'C', 'General')); // 6+1=7
console.log(calcPoints(0, 'C', 'Senior')); // 1
console.log(calcPoints(2, 'No Grade', 'Senior')); // 3
