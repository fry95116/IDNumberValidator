(function(){
  /**
   * check is year of `y` a leap year
   * @param {number} y - year
   * @return {boolean} - is it a leap year
   */
   function isLeapYear(y){
    return y % 100 === 0 ? y % 400 === 0 : y % 4 === 0
  }
  exports.isLeapYear = isLeapYear

  /**
   * check if date `y-m-d` is exist
   * @param {number} y - year
   * @param {number} m - mouth
   * @param {number} d - day
   * is it a existing date
   */
  function isValidDate(y, m, d){
    const DAYOFMONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if(y <= 0) return false
    else if(m < 1 || m > 12) return false
    else if(m === 2 && isLeapYear(y)) return d > 0 && d <= 29
    else return d > 0 && d <= DAYOFMONTH[m - 1]
  }
  exports.isValidDate = isValidDate
})()