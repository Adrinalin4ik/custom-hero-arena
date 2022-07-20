module.exports =
{
  env : {
    browser : true,
    es6     : true,
    node    : true
  },
  plugins :
  [
    'import',
    'react'
  ],
  extends :
  [
    'eslint:recommended',
    'react-app'
  ],
  rules :
  {
    'indent'                    : [ 'error', 2 ],
    'linebreak-style'           : [ 2, 'unix' ],
    'lines-around-comment'      : [ 2,
      {
        allowBlockStart    : true,
        allowObjectStart   : true,
        beforeBlockComment : true,
        beforeLineComment  : false
      } ],
    'max-len' : [ 2, 94,
      {
        tabWidth               : 2,
        comments               : 110,
        ignoreUrls             : true,
        ignoreStrings          : true,
        ignoreTemplateLiterals : true,
        ignoreRegExpLiterals   : true
      } ],
    'strictPropertyInitialization' : 0
  }
};
