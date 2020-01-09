var chars='1234567890-qwertyuiopasdfghjklzxcvbnm'
module.exports = class general
{
  static randomString(len)
  {
    var str=''
    for(var a=0;a<len;a++)
    {
      var rand=Math.floor(Math.random()*chars.length)
      str+= chars[rand]
    }
    return str
  }
  static randomNumber(min,max)
  {
    return Math.floor(Math.random()*(max-min)+min)
  }
}