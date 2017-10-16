(function(){
  const FILENAME_DISTRICTS = './data/districts.bin'
  const FILENAME_INDEX = './data/data.json'
  const partial = require('lodash.partial') //use `{}` as placeholder
  const assign = require('lodash.assign')
  const {importWithPromisify, chunk} = require('./utils')
  const {isLeapYear, isValidDate} = require('./dateValidator')

  const INDEX = require(FILENAME_INDEX)
  const LOCATION_CODES = Object.keys(INDEX)

  exports.isValidDate = isValidDate
  exports.isLeapYear = isLeapYear

  exports.generateIDNumber = generateIDNumber
  /**
   * generate a valid ID number
   * @param {*} idNumber 
   * @param {*} option 
   */
  function generateIDNumber(option){
    const {random, floor} = Math

    let opt = {
      startOfDate: new Date(0),
      endOfDate: new Date(),
      startofMonth: 1,
      endofMonth: 0,
      sex: 2
    }
    assign(opt, option)
    if(opt.sex >= 2) opt.sex = floor(random() * 2)

    //地区代码
    let id_number = LOCATION_CODES[floor(random() * 3137)]
    //出生日期
    let start = opt.startOfDate.getTime()
    let range = opt.endOfDate.getTime() - start
    let birthday = new Date(start + floor(random() * range))
    
    id_number += birthday.getFullYear()
    let month = birthday.getMonth()
    id_number += month > 9 ? month : '0' + month
    let day = birthday.getDate()
    id_number += day > 9 ? day : '0' + day
    //循序码
    let seq = floor(random() * 500) * 2 + opt.sex //奇数为男性，偶数为女性
    if(seq < 10) id_number += '00' + seq
    else if(seq < 100) id_number += '0' + seq
    else id_number += seq  
    //校验码
    id_number += __getExceptedCRC(id_number) 

    return id_number
  }

  exports.parseIDNumber = parseIDNumber
  /**
   * parse id Number
   * if its a valid id number, return infos
   * else return null
   * @param {string} idNumber - idNumber
   * @return {Object|null} - info in idNumber
   */
  function parseIDNumber(idNumber){
    let result = {}
    
    let codes = idNumber.match(/^(\d{6})(\d{4})(\d\d)(\d\d)(\d\d(\d))(\d)$/)
    if(codes === null) return null
    let [, locationCode, year, month, day, seq, sex, crc] = codes 
    
    let location = parseLocationCode(locationCode)
    if(location.length === 0) return null
    result.province = location[0]
    result.city = location[1]
    result.district = location[2]
    
    result.year = parseInt(year)
    result.month = parseInt(month)
    result.day = parseInt(day)
    if(!isValidDate(result.year, result.month, result.day)) return null
    
    result.seq = parseInt(seq)
    result.sex = parseInt(sex) % 2 // 1 = male, 2 = female
    result.crc = crc
    if(result.crc !== __getExceptedCRC(idNumber)) return null
    
    return result
  }
  
  exports.parseLocationCode = parseLocationCode
  /**
   * check is it a vaild location code (GB/T 2260-2007)
   * if true return location splited with space
   * else return `undefined`
   * @param {string} cityCode - province + city code (4 chars)
   * @param {string} districtCode - district Code (2 chars)
   * @return {string[]} - result
   */
  function parseLocationCode(locationCode){
    let locationInfo = INDEX[locationCode]
    if(typeof(locationInfo) === 'undefined') return []
    else return locationInfo.split(' ')
  }

  exports.getExpectedCRC = getExpectedCRC
  /**
   * get excepted CRC from id number with length checking
   * if length != 18 return empty string
   * @param {string} districtCode - district Code (2 chars)
   * @return {string} - expected CRC
   */
  function getExpectedCRC(idNumber){
    if(idNumber.length != 18) return ''
    else return __getExceptedCRC(idNumber)
  }
  
  /**
   * get excepted CRC from id number without checking
   * @param {string} districtCode - district Code (2 chars)
   * @return {string} - expected CRC
   */
  function __getExceptedCRC(idNumber){
    const k = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const dict = '10X98765432'
    let CRC = 0
    for(let i = 0; i < 17; ++i)
      CRC += parseInt(idNumber[i]) * k[i]
    return dict[CRC % 11]
  }
})()
