const products = [
    {
        id: 1,
        image: 'images/5m.jpg',
        description: 'Mắc áo 5 móc INOX 304',
        price: 300000,
        quantity: 1
    },
    {
        id: 2,
        image: 'images/7m.jpg',
        description: 'Mắc áo 7 móc INOX 304',
        price: 350000,
        quantity: 1
    }
];

let cart = [];

function formatVND(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function renderProducts() {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 product-card';
        productCard.innerHTML = `
            <img src="${product.image}" class="product-img" alt="${product.description}">
            <div class="product-details">
                <p class="prod">${product.description}</p>
                <p class="colorMM">${formatVND(product.price)}</p>
                <div class="soluong-container">
                <input type="number" min="1" value="${product.quantity}" id="quantity-${product.id}" class="form-control soluong">
                </div>
                <button class="btn btn-success" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
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
            ${item.description} - ${formatVND(item.price)} x 
            <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-index="${index}" onchange="updateQuantity(${index}, this.value)">
            <div class="cart-actions">
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Thao tác</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);

        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').innerText = formatVND(totalPrice);   
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
