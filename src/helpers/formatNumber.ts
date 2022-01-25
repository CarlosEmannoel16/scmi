export const removeSpecialCharactersAndConvertToInt = (value: string) => {

  return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'))

}

export const formatMoney = (value: number) => {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}