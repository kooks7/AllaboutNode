function solution(s) {
  const str = s.split('');
  let res = [];
  for (i = 1; i <= str.length / 2; i++) {
    for (j = 0; j + 2 * i - 1 < str.length; j++) {
      // let temparr1 = str;
      // let temparr2 = str;
      let temp1 = str.slice(j, j + i);
      let temp2 = str.slice(j + i, j + 2 * i);

      // console.log(temp1.toString(), temp2);
      if (temp1.toString() == temp2.toString()) {
        // res = str.splice(j, j + 2 * i - 1, i.toString());
        console.log('1st : ', j, j + i - 1);
        console.log('2nd : ', j + i, j + 2 * i - 1);
      }
    }
  }
  // console.log(res);
  var answer = 0;
  return answer;
}

solution('abababcdcd');

// const arr = [0, 1, 2, 3, 4, 5, 6];
// const temp3 = arr.splice(0, 2);
// console.log(temp3);
