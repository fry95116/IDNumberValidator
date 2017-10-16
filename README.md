# IDNumberValidator

A validator for ID number in RPC (GB 11643-1999) with IDNumber validator, Date invalidator and IDNumber generator

## installation
```shell
npm install --save idNumberValidator
```

## Usage(ES7)
```javascript
const validator = require('idnumbervalidator')

// parseIDNumber
let infos = validator.parseIDNumber('360825200905061959')
console.log(infos)
/* { 
  province: '江西省',
  city: '吉安市',
  district: '永丰县',
  year: 2009,
  month: 5,
  day: 6,
  seq: 195,
  sex: 1,
  crc: '9'
} */

// generateIDNumber
let idNumber = validator.generateIDNumber() //get a random valid IDNumber
```

## API
- [parseIDNumber()](#parseidnumberidnumber)
- [generateIDNumber()](#generateidnumber)
- [isLeapYear()](#isleapyearyear)
- [isValidDate()](#isvaliddateyear-month-day)
- [getExceptedCRC()](#getexceptedcrcidnumber)

### `parseIDNumber(idNumber)`
Parse `idNumber` with GB11643-1999.

#### `idNumber`
Type: `string`

idNumber needs to be parsed

#### `returns`
Type: `Object|null`

if it is a valid ID number. return the info parsed from `idNumber`. else return `null`.
about return's struction, See [below](#infos)
#### `infos` structure
```javascript
{
  province: '江西省', // string, name of province
  city: '吉安市', // string, name of city
  district: '永丰县', // string, name of fistrict
  year: 2009, // integer, birth year
  month: 5, // integer, birth month
  day: 6, // integer, birth day
  seq: 195, // integer, seq number
  sex: 1, // integer, sex code (0=female, 1=male)
  crc: '9' // string, CRC code (10 is represented as 'X')
}
```

### `generateIDNumber()`
generate a valid ID number, only for test.

#### returns

Type: `string`

ID number generated

### `isLeapYear(year)`

judge is `year` is a leap year

#### `year`

Type: `number`

#### returns

Type: `boolean`

is it a leap year.

### `isValidDate(year, month, day)`
judge is date of `year`/`month`/`day` a existing day

#### `year`

Type: `number`

#### `month`

Type: `number`

#### `day` 

Type: `number`

#### returns

Type: `boolean`

is it a existing date

### getexceptedCRC(idNumber)
return CRC calculated from `idNumber`  
> notes: 10 is repersented as 'X'(upper case)

#### idNumber 

Type: `string`

#### returns

Type: `string`

CRC code calculated from `idNumber`