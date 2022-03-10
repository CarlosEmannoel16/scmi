

let btnReturnAllProducts = document.getElementById('btnReturnAllProducts')


if (btnReturnAllProducts) {
  btnReturnAllProducts.addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = "/product"
  })
}

function redirectAllCustomers() {
  window.location.href = "/customers"
}

function redirectAllProducts() {
  window.location.href = "/product"
}

function redirectSale() {
  window.location.href = "/sale"
}

function submitModalEdit() {
  document.getElementById("formEdit").submit()
}

function DeeletProductAction() {
  document.getElementById('deleteButtonProduct').submit()
}


function submitProductSale(event) {
  console.log(event.which)
}

function redirectFinalizingSale(){
 window.location.href = '/finalizing-Sale'
}


function formatMoney(input){
  let valueInput = input.value
  if (valueInput) {
    valueInput = parseInt(valueInput.replace(/[^0-9]/g, ''))
    valueInput = (valueInput / 100).toFixed(2) + ''
    valueInput = valueInput.replace('.', ',')
    valueInput = valueInput.replace(/(\d)(\d{3})(\d{3}),/g, '$1. $2. $3,')
    valueInput = valueInput.replace(/(\d)(\d{3}),/g, '$1.$2,')
    input.value = 'R$ ' + valueInput
  }
}



function effectIconMenu(element){
  $(element)
  .transition('jiggle')
  
;
}

