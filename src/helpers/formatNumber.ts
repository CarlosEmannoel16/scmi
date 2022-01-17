export const removeSpecialCharactersAndConvertToInt = (value: string)=>{

  return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'))

}