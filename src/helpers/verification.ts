export const priceBuyBigThePriceSale = (priceBuy:number, priceSale:number)=>{

    if(priceBuy > priceSale) return false 
    return true
}

export const checkIfStockIsLow = (quantityInStock:  number, minimumAmountAllowed: number)=>{
  return quantityInStock <= minimumAmountAllowed ? true: false

}