
$(document).ready(function(){
  $('#price_buy').money('000.000.000')
})


let btnReturnAllProducts = document.getElementById('btnReturnAllProducts')

if(btnReturnAllProducts){
  btnReturnAllProducts.addEventListener('click', (event)=>{
    event.preventDefault()
    window.location.href="/product"
  })
}


function redirectAllCustomers(){
  window.location.href="/customers"
}

function redirectAllProducts(){
  window.location.href="/product"
}

function redirectSale(){
  window.location.href="/sale"
}

function submitModalEdit(){
  document.getElementById("formEdit").submit()
}

function DeeletProductAction(){
 document.getElementById('deleteButtonProduct').submit()
}


function submitProductSale(event){
 console.log(event.which)
}










