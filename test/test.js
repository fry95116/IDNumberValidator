let index = require('../index')

function assert(testVal, result, except){
  if(except instanceof Function) ({except, result} = except(testVal, result))
  else result = result === except

  if(result)
    console.log(`${testVal}(${except}) -> pass`)
  else
    console.error(`${testVal}(${except}) -> not pass`)
}

let DATASET = [
  '370921199108155860',
  '411121198403240967',
  '370634197602278977',
  '350823198612187721',
  '610528197808304728',
  '34020019851011950X',
  '321323198207265974',
  '341503198505245276',
  '421281198906301788',
]
console.log('[function] isLeapYear:')
assert(2001, index.isLeapYear(2001), false)
assert(2004, index.isLeapYear(2004), true)
assert(1900, index.isLeapYear(1900), false)
assert(2000, index.isLeapYear(2000), true)

console.log('\n[function] isValidDate:')
assert('2000/2/28', index.isValidDate(2000, 2, 28), true)
assert('2000/2/29', index.isValidDate(2000, 2, 29), true)

assert('2000/3/31', index.isValidDate(2000, 3, 31), true)
assert('2000/3/30', index.isValidDate(2000, 3, 30), true)

assert('2000/4/31', index.isValidDate(2000, 4, 31), false)
assert('2000/4/30', index.isValidDate(2000, 4, 30), true)

assert('2001/2/28', index.isValidDate(2001, 2, 28), true)
assert('2001/2/29', index.isValidDate(2001, 2, 29), false)

assert('2001/3/31', index.isValidDate(2001, 3, 31), true)
assert('2001/3/30', index.isValidDate(2001, 3, 30), true)

assert('2001/4/31', index.isValidDate(2001, 4, 31), false)
assert('2001/4/30', index.isValidDate(2001, 4, 30), true)

console.log('\n[function] parseLocationCode')

assert('130109', index.parseLocationCode('130109'), (testVal, result)=>{
  except = 'not empty string'
  result = result instanceof Array && result.length !== 0
  return {except, result}
})
assert('130112', index.parseLocationCode('130112'), (testVal, result)=>{
  result = result instanceof Array && result.length === 0
  except = 'empty string'
  return {except, result}
})

console.log('\n[function] parseIDNumber')
for(idNumber of DATASET){
  assert(idNumber, index.parseIDNumber(idNumber), (testVal, result) => {
    except = 'not null'
    result = testVal !== result
    return {except, result}
  })
}

console.log('\n[function] generateIDNumber')
for(let i = 0; i < 10; ++i){
  idNumber = index.generateIDNumber()
  assert('get: ' + idNumber, index.parseIDNumber(idNumber), (testVal, result) => {
    except = 'can be parsed'
    result = testVal !== result
    return {except, result}
  })
}