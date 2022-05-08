console.clear()
console.log('Starting functional program demo...\n')

// x2 = function (n) {
//   return n * 2
// }
// console.log(x2, x2(4))

const numbers = [1, 2, 3, 4]

// Mutable code ....
// Iterating over an array (map)
// const arr = []
// for (i = 0; i < numbers.length; i++) {
//   for (j = 0; j < numbers.length; j++) {
//     arr.push(numbers[i][j])
// }
// console.log(arr)

// Iterating over an array (reduce)
// let total = 0
// for (i = 0; i < numbers.length; i++) {
//   total = total + numbers[i]
// }
// console.log(total)

// Functions as variables
const x2 = (n) => n * 2
const isOdd = (n) => n % 2 === 1

console.log({ numbers })

// console.log(numbers.map((n) => n * 2))

// console.log('x2', numbers.map(x2))
// console.log('isOdd', numbers.map(isOdd))
// console.log('filter isOdd', numbers.filter(isOdd))
// console.log('find first isOdd', numbers.find(isOdd))

// map returns an array

// reduce returns a single value
// const reducer = (acc, item, ix) => {
//   acc = acc + item
//   return acc
// }
// let total = numbers.reduce(reducer, 0)
// total = numbers.reduce((acc, item, ix) => {
//   return acc + item
// }, 0)
// console.log({ total })

const result = numbers
  .map(x2)
  .filter((n) => n < 6)
  .map(x2)
  .filter((n) => n > 2)

console.log(result)
