


// Functional programming

const x = [1,2,3]
const y = [3,4,5]
let count = 0
for(let i=0;i< x.length;i++){
  for(let j=0;j< y.length;j++){
  count = count + 1
  console.log(x[j])
}

console.log('There are '+count+' items in your array')

// Let's do it without variables

const x = [1,2,3]
const y = [3,4,5]

// forEach
let count = 0
x.forEach(value => {
  count = count +1
})

// reduce
let count = x.reduce((acc,value) =>{
  return acc + 1
},0)
// 3

// filter - find values >1
const newArray = x.filter(value => value >1) // [2,3]

const newArray = x.filter(value => value >1) // [2,3]
.map(value => value * 2) // [4,6]
.filter(value => value < 6) // [4]

const 