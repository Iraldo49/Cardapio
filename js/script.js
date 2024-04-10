const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o modal do pedido
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display ="none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) 
        addToCart(name, price)
    }
})

//Funcao para adicionar no pedido
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    //se o item ja existe, aumenta apenas a quantidade + 1
    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
       })  
    }
    updateCartModal()
  
}
//Atualiza o pedido
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mt-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                   <p class="font-medium">${item.name}</p> 
                   <p> Qtd: ${item.quantity}</p> 
                   <p class="font-medium mt-2">MTN ${item.price.toFixed(2)}</p> 
                </div> 
                
                    <button class="remove-form-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `
        total += item.price * item.quantity;
        
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-PT", {
            style: "currency",
           currency: "MZN"
        });
    cartCounter.innerHTML = cart.length;
}

//funcao para remover o item do pedido
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-form-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//validacao do input
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
//finalizar Pedido
checkoutBtn.addEventListener("click", function(){

    // const isOpen = checkRestaurantOpen();
    // if(!isOpen){
    //     alert("TAKE AWAY FECHADO NO MOMENTO!")
    //     return;
    // }
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o restaurante esta fechado!",
            duration: 3000,
            
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido do api whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preco: MZN${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "822937027"

    window.open(`https://wa.me/${phone}?text=${message} Endereco: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

// Função para verificar se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();

    // Retorna true se o restaurante estiver aberto, false caso contrário
    return hora >= 18 && hora < 22;
}

// Função para atualizar a interface do usuário com base no status do restaurante
function updateRestaurantStatus() {
    const spanItem = document.getElementById("date-span");
    const isOpen = checkRestaurantOpen(); // Chama a função para verificar se está aberto

    if (isOpen) {
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    } else {
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
    }
}

// Chamar a função para atualizar o status do restaurante na interface do usuário
updateRestaurantStatus();
