export const removeSpecialCharactersAndConvertToFloat = (value: string ): number => {

  return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'))

}

export const formatMoney = (value: number) => {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}