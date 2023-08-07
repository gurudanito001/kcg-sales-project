const clipLongText = (text) =>{
  let result = text.substring(0, 40)
  if(text.length > 40){
    return `${result} ...`
  }
  return text
}

export default clipLongText;