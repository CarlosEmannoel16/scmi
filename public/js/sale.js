

let checkStock = (stock, checker) => {
  return stock < checker ? true : false

}

getProductSessionStorage = () => {

  let productsSelectedForSale = []

  if ((sessionStorage.getItem('productsSelectedForSale'))) {
    productsSelectedForSale = JSON.parse(sessionStorage.getItem('productsSelectedForSale'))


  }
  return productsSelectedForSale
}


const sumValuesProducts = () => {

  let dataProduct = getProductSessionStorage()
  if (dataProduct.length > 1) {

    let priceSale = dataProduct.map(product => parseFloat(product.price_sale.replace('R$', '').replace('.', '').replace(',', '.')))
      .reduce((accumulator, element) => { return accumulator += element })

    return priceSale.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
  }

  return dataProduct.price_sale
}

const addLine = (product) => {
  let tr = document.createElement('tr')


  let tdId = document.createElement('td')
  let tdName = document.createElement('td')
  let tdQuantity = document.createElement('td')
  let tdValue = document.createElement('td')

  tdId.innerHTML = `${product.codProduto}`
  tdName.innerHTML = `${product.description}`
  tdQuantity.innerHTML = `${1}`
  tdValue.innerHTML = `${product.price_sale}`

  tr.insertAdjacentElement('beforeend', tdId)
  tr.insertAdjacentElement('beforeend', tdName)
  tr.insertAdjacentElement('beforeend', tdQuantity)
  tr.insertAdjacentElement('beforeend', tdValue)

  const areaInforProducts = document.querySelector('.pdv-infor-products-table')
  areaInforProducts.appendChild(tr);

}


const addLineFormSession = (DataSessionStorage) => {
  DataSessionStorage.forEach((item) => {
    addLine(item)
  })

  const areaAmount = document.querySelector('.amountSale')

  let amountValue = sumValuesProducts()
  areaAmount.innerHTML = `${amountValue}`

}


const clearSession = () => {

  sessionStorage.removeItem('productsSelectedForSale')
}

const insertInSessionStrorage = (dataProduct) => {

  let inputButton = document.querySelector('.inputQuantitySale')

  if (inputButton) {
    if (inputButton.value) {
      let quantity = inputButton.value
      if (quantity && checkStock(dataProduct.quantity, quantity)) {
          alert('Quantidade exede o estoque deste produto')
          document.location.reload(true)
          
      }
        let priceSale = parseFloat(dataProduct.price_sale.replace('R$', '').replace('.', '').replace(',', '.'))
        dataProduct.price_sale = (priceSale * parseInt(quantity)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

        let DataSessionStorage = getProductSessionStorage()
        DataSessionStorage.unshift(dataProduct)

        DataSessionStorage.forEach((item, index) => { item.codProduto = item.id + index })
        sessionStorage.setItem('productsSelectedForSale', JSON.stringify(DataSessionStorage))
      }

    } else {

      let DataSessionStorage = getProductSessionStorage()
      DataSessionStorage.unshift(dataProduct)

      DataSessionStorage.forEach((item, index) => { item.codProduto = item.id + index })
      sessionStorage.setItem('productsSelectedForSale', JSON.stringify(DataSessionStorage))
    }

  }



  document.querySelector('#btnQuantityProductSale').addEventListener('click', () => {

    let inputQuantity = document.createElement('input')
    inputQuantity.setAttribute('type', 'text')
    inputQuantity.setAttribute('class', 'inputQuantitySale')


    var buttonQuantity = document.querySelector('#btnQuantityProductSale')
    let columnQuantity = document.querySelector('#columnQuantity')
    columnQuantity.removeChild(buttonQuantity)
    columnQuantity.appendChild(inputQuantity)



    inputQuantity.addEventListener('blur', function () {
      columnQuantity.removeChild(inputQuantity)
      columnQuantity.appendChild(buttonQuantity)
    })
  })




  if (getProductSessionStorage().length > 0) {
    addLineFormSession(getProductSessionStorage())
  }

  document.getElementById('inpuCodProduct').focus()

  window.addEventListener('keypress', async (event) => {

    const inputProduct = document.getElementById('inpuCodProduct')

    if (inputProduct.value && event.key) {
      document.querySelector('.input-add-code').classList.add('loading')
    } else {
      document.querySelector('.input-add-code').classList.remove('loading')
    }




    if (inputProduct.value && event.key == 'Enter') {

      data = inputProduct.value

      const response = await fetch(`/sale/${data}`, {
        method: 'GET',
      })

      const dataProduct = await response.json()

      if (dataProduct) {
        insertInSessionStrorage(dataProduct.product)
        document.location.reload(true)
      }
    }
  })

