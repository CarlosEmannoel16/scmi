document.getElementById('btnReturnAllProducts').addEventListener('click', (event)=>{
  event.preventDefault()
  window.location.href="/product"
}, true)

function redirectAllCustomers(){
  window.location.href="/customers"
}

function submitModalEdit(){
  document.getElementById("formEdit").submit()
}


function DeeletProductAction(){
 document.getElementById('deleteButtonProduct').submit()
}





