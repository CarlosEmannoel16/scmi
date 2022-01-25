document.getElementById('inpuCodProduct').focus()
const inpuCodProduct = document.querySelector('#inpuCodProduct')
const inputAddCodeArea = document.querySelector('.input-add-code')
window.onload = async () => {
  let products = await requestGetAllProduct()
  let session = products.session
  if (session.length > 0) {
    await loadAllProducts()
  }

}


//Funções 

const productsInSession = () => {
  let freeBoxMessage = document.querySelector('.freeBoxMessage').style.display='none'
 
}

const loadAllProducts = async () => {
  productsInSession()
  let products = await requestGetAllProduct()
  addProductsOnViewOnload(products.session)
  document.querySelector('.amountSale').innerHTML = products.amountSale

}

const requestGetAllProduct = async () => {
  try {
    const response = await fetch(`/sale-product-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cod: true })
    })

    let dataFetchProduct = await response.json()
    if (dataFetchProduct.status) {
      return dataFetchProduct
    } else {
      alert('produto não encontrado')
    }



  } catch (err) {
    console.log(err)
  }
}

const requestSessionSale = async (cod, quantity) => {
  try {
    const response = await fetch(`/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cod: cod,
        quantity: quantity
      })
    })

    let dataFetchProduct = await response.json()
    let statusRequest = dataFetchProduct.statusAdd
    if (statusRequest) {
      return dataFetchProduct
    } else {
      alert('Produto não encontrado')
    }

  } catch (err) {

    console.log(err)
  }
}

const getCodeAndRequest = async (event, inputProduct, inputDelete) => {
  if (inputProduct.value && event.key == 'Enter' && inputDelete == undefined) {
    let cod = inputProduct.value
    let quantity = getQuantity()
    let dataFetchProduct = await requestSessionSale(cod, quantity)
    cleanLine()
    loadAllProducts()
    document.querySelector('.amountSale').innerHTML = dataFetchProduct.amountSale

  }
}


const createLine = async (product) => {

  let tr = document.createElement('tr')

  let tdId = document.createElement('td')
  let tdName = document.createElement('td')
  let tdQuantity = document.createElement('td')
  let tdValueUni = document.createElement('td')
  let tdValueAmount = document.createElement('td')

  tdId.innerHTML = `${product.id}`
  tdName.innerHTML = `${product.description}`
  tdQuantity.innerHTML = `${product.quantity}`
  tdValueUni.innerHTML = `${product.price_sale}`
  tdValueAmount.innerHTML = `${product.amount}`

  tr.insertAdjacentElement('beforeend', tdId)
  tr.insertAdjacentElement('beforeend', tdName)
  tr.insertAdjacentElement('beforeend', tdQuantity)
  tr.insertAdjacentElement('beforeend', tdValueUni)
  tr.insertAdjacentElement('beforeend', tdValueAmount)

  const areaInforProducts = document.querySelector('.pdv-infor-products-table')
  areaInforProducts.appendChild(tr);

}

const cleanLine = () => {
  const areaInforProducts = document.querySelector('.pdv-infor-products-table')
  while (areaInforProducts.firstChild) {
    areaInforProducts.removeChild(areaInforProducts.lastChild)
  }



}

const addProductsOnViewOnload = (products) => {
  products.forEach((item) => {
    createLine(item)

  })
}

const deleteProductSale = async (event, cod, inputDelete, inputProduct) => {
  if (inputDelete && inputDelete.value && event.key == 'Enter' && inputProduct.value == '') {
    const response = await fetch(`/sale-product-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cod: cod,
      })
    })

    let res = await response.json()
    if (res.statusSale) {
      cleanLine()
      await loadAllProducts()
      return
    } else {
      alert('Produto não encontrado')
    }
  }
}


const requestCancelSale = async () => {
  const response = await fetch('cancel-sale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cod: true
    })
  }

  )
  document.location.reload(true)
}


let getQuantity = () => {
  let quantity = document.querySelector('.inputQuantitySale')
  if (quantity && quantity.value) {
    return quantity.value
  } else {
    return '1'
  }
}


let closeSale = () => {

}

//Eventos de click

document.querySelector('#closingSale').addEventListener('click', async () => {


  inputAddCodeArea.innerHTML= ''
})

document.querySelector('#btnQuantityProductSale').addEventListener('click', () => {

  let inputQuantity = document.createElement('input')
  inputQuantity.setAttribute('type', 'text')
  inputQuantity.setAttribute('class', 'inputQuantitySale')

  var buttonQuantity = document.querySelector('#btnQuantityProductSale')
  let columnQuantity = document.querySelector('#columnQuantity')
  columnQuantity.removeChild(buttonQuantity)
  columnQuantity.appendChild(inputQuantity)
  inputQuantity.focus()
  document.getElementById('inpuCodProduct')


  inputQuantity.addEventListener('blur', function () {
    columnQuantity.removeChild(inputQuantity)
    columnQuantity.appendChild(buttonQuantity)
    document.getElementById('inpuCodProduct').focus()
  })
})



document.querySelector('#cancelSale').addEventListener('click', () => {
  clearSession()
  document.location.reload(true)
})


document.querySelector('#cancelSale').addEventListener('click', async () => {
  await requestCancelSale()
  cleanLine()

})

window.addEventListener('keypress', async (event) => {

  const inputDelete = document.querySelector('.inputDeleteSale')
  const inputProduct = document.getElementById('inpuCodProduct')

  if (inputProduct.value && event.key) {
    document.querySelector('.input-add-code').classList.add('loading')
  } else {
    document.querySelector('.input-add-code').classList.remove('loading')
  }

  await getCodeAndRequest(event, inputProduct, inputDelete)
  if (inputDelete) {
    await deleteProductSale(event, inputDelete.value, inputDelete, inputProduct)
  }



})

document.querySelector('#btnDeleteProductSale').addEventListener('click', () => {

  let inputDelete = document.createElement('input')
  inputDelete.setAttribute('type', 'text')
  inputDelete.setAttribute('class', 'inputDeleteSale')

  var buttonDeleteProduct = document.querySelector('#btnDeleteProductSale')
  let columnDeleteProduct = document.querySelector('#columnDeleteProduct')
  columnDeleteProduct.removeChild(buttonDeleteProduct)
  columnDeleteProduct.appendChild(inputDelete)
  inputDelete.focus()
  document.getElementById('inpuCodProduct').value = ''


  inputDelete.addEventListener('blur', function () {
    columnDeleteProduct.removeChild(inputDelete)
    columnDeleteProduct.appendChild(buttonDeleteProduct)
    document.getElementById('inpuCodProduct').focus()
  })
})