const products = [
    {
        id: 1,
        image: 'https://via.placeholder.com/150',
        description: 'Product 1 Description',
        price: 10,
        quantity: 1
    },
    {
        id: 2,
        image: 'https://via.placeholder.com/150',
        description: 'Product 2 Description',
        price: 15,
        quantity: 1
    }
];

let cart = [];

function renderProducts() {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 product-card';
        productCard.innerHTML = `
            <img src="${product.image}" class="product-img" alt="${product.description}">
            <div class="product-details">
                <h5>${product.description}</h5>
                <p>$${product.price}</p>
                <input type="number" min="1" value="${product.quantity}" id="quantity-${product.id}" class="form-control mb-2">
                <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

function renderCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        cartItem.innerHTML = `
            ${item.description} - $${item.price} x 
            <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-index="${index}" onchange="updateQuantity(${index}, this.value)">
            <div class="cart-actions">
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);

        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').innerText = `$${totalPrice}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    const cartProduct = cart.find(item => item.id === productId);

    if (cartProduct) {
        cartProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    renderCart();
}

function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

document.getElementById('checkout').addEventListener('click', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'order.html';
});

document.addEventListener('DOMContentLoaded', renderProducts);

$(document).ready(function(){
    // Set interval for carousel
    $('#carouselExampleIndicators').carousel({
        interval: 2000 // milliseconds
    });
});



