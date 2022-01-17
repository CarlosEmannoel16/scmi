

export const getProductSessionStorage = ()=>{

  let productsSelectedForSale = []

  if((sessionStorage.getItem('productsSelectedForSale'))){
    productsSelectedForSale = sessionStorage.getItem('productsSelectedForSale')

  }
  return JSON.parse(productsSelectedForSale)
}