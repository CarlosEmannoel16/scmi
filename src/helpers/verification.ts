import {removeSpecialCharactersAndConvertToInt} from './formatNumber'

export const priceBuyBigThePriceSale = (priceBuy:number, priceSale:number)=>{
    return priceBuy <=  priceSale ?  true : false 
}

export const checkIfStockIsLow = (quantityInStock:  number, minimumAmountAllowed: number)=>{
  return quantityInStock <= minimumAmountAllowed ? true: false
}

export const checkProfit = (priceBuy: number, priceSale: number)=>{
  
  let profit = removeSpecialCharactersAndConvertToInt(priceSale.toString()) - removeSpecialCharactersAndConvertToInt(priceBuy.toString())
  
  if(profit > 0 ){
    let data = {
      message: `Lucro com cada venda: ${profit.toLocaleString('pt-br', {style: 'currency', currency:'BRL'})}`,
      status: true
    }
    return data
  }else if(profit < 0) {
    let data = {
      message: `Você obterar Projuizo com a venda deste produto: ${profit.toLocaleString('pt-br', {style: 'currency', currency:'BRL'})}`,
      status: false
    }
    return  data
  }else{
    let data = {
      message: `Produto sem lucro`,
      status: true
    }
    return data
  }

}