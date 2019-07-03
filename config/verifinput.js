
exports.checkvalue = function(str, option, callback)
{
  if (str == undefined)
    callback(false);
  else {
    if(option == 'NUMERIC')
    {
      str = str.replace(/\s/g,'');
    }
    //console.log(str, "option :", option);
    var expressions = {
      ALPHA: /^[a-zA-Z]+$/,
      NUMERIC: /^[0-9]+$/,
      ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
      SPECIAL: /(?=.*[!@#$%^&*?~-])/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      ALPHANAME: /^[A-Za-z_-ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ]+$/,
      RIBFR: /^(?=.*[0-9])+(?=.*\bFR)/,
      COMPANYNAME: /^(?=.*[;])/
    };
    if (str == undefined)
    str = '';
    if(!expressions[option].test(str)) {
      callback(false);
    }
    else
    {
      callback(true);
    }
  }
}
