const urlParams = new URLSearchParams(window.location.search);
const goodsId = urlParams.get('productId');

const loadProduct = async () => {
    try {
        if (!goodsId) return;
        const product = await fetchProductById(goodsId);
        if (!product) return;

        document.querySelector('.goodsName').textContent = product.name;
        document.querySelector('.goodsPrice').textContent = product.price;
        document.querySelector('.goodsPrice2').textContent = product.price2;
        document.querySelector('.proImg').src = product.img;
    } catch (error) {
        console.error('Error loading product:', error);
    }
};
loadProduct();

const addValue = document.querySelector('.addValue');
const minusValue = document.querySelector('.minusValue');
const valueField = document.querySelector('.qualityValue');
let quantity = parseInt(valueField.value) || 1;

const updateQuantity = (change) => {
    quantity = Math.max(1, quantity + change);
    valueField.value = quantity;
};

addValue.addEventListener('click', () => updateQuantity(1));
minusValue.addEventListener('click', () => updateQuantity(-1));

const addToCartButton = document.querySelector('.AddTocart');
const cartContainer = document.querySelector('.subContain');
const emptyCart = document.querySelector('.emptyCart');
const loadCart = document.querySelector('.loadCart');
const totalCartElement = document.querySelector('.totalCart');
const countElement = document.querySelector('.count');

const updateCartDisplay = () => {
    try {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        totalCartElement.textContent = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
        countElement.textContent = cartData.length;

        emptyCart.classList.toggle("emptyCartActive", cartData.length === 0);
        loadCart.classList.toggle("loadCartActive", cartData.length > 0);
    } catch (error) {
        console.error('Error updating cart display:', error);
    }
};

const goodsOptions = () => {
    document.querySelectorAll('.orderB').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.orderB').forEach(i => i.classList.remove("brandActive"));
            item.classList.add("brandActive");
        });
    });

    document.querySelectorAll('.color-option').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(i => i.classList.remove("colorActive"));
            item.classList.add("colorActive");
        });
    });

    document.querySelectorAll('.size-option').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(i => i.classList.remove("sizeActive"));
            item.classList.add("sizeActive");
        });
    });
};

goodsOptions();

const validateSelection = () => {
    return document.querySelector('.orderB.brandActive') &&
           document.querySelector('.color-option.colorActive') &&
           document.querySelector('.size-option.sizeActive');
};

const loadCartFromStorage = () => {
    try {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';

        cartData.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('lCTop');
            cartItem.innerHTML = `
                <div class="lctopRight">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="lctopLeft">
                    <h3>${item.name}</h3>
                    <h4>
                        <span>$</span><span class="price">${item.price}</span>
                        <span> x ${item.quantity} = </span>
                        <span>$</span><span class="price2">${item.totalPrice}</span>
                    </h4>
                </div>
                <div class="lctLast">
                    <button class="removeItem" data-index="${index}"><span class="material-symbols-outlined">close</span></button>
                </div>
            `;

            cartItem.querySelector('.removeItem').addEventListener('click', () => {
                cartData.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cartData));
                loadCartFromStorage();
            });

            cartContainer.appendChild(cartItem);
        });

        updateCartDisplay();
    } catch (error) {
        console.error('Error loading cart from storage:', error);
    }
};

addToCartButton.addEventListener('click', async () => {
    if (!validateSelection()) {
        alert("Please select a brand, color, and size before adding to cart.");
        return;
    }

    try {
        const product = await fetchProductById(goodsId);
        if (!product) return;

        const selectedBrand = document.querySelector('.orderB.brandActive').getAttribute('data-brand');
        const selectedColor = document.querySelector('.color-option.colorActive').getAttribute('data-color');
        const selectedSize = document.querySelector('.size-option.sizeActive').getAttribute('data-size');

        let cartData = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cartData.find(item =>
            item.name === product.name &&
            item.brand === selectedBrand &&
            item.color === selectedColor &&
            item.size === selectedSize
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2);
        } else {
            cartData.push({
                name: product.name,
                img: product.img,
                price: product.price,
                quantity: quantity,
                totalPrice: (product.price * quantity).toFixed(2),
                brand: selectedBrand,
                color: selectedColor,
                size: selectedSize
            });
        }

        localStorage.setItem('cart', JSON.stringify(cartData));
        loadCartFromStorage();
        alert("Goods Added to cart.");
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
});

loadCartFromStorage();

document.querySelectorAll('.mdHeader').forEach((header, index) => {
    header.addEventListener('click', () => {
        document.querySelectorAll('.mdeatilsBar').forEach(detail => detail.classList.remove('mdbarActive'));
        document.querySelectorAll('.mdeatilsBar')[index].classList.add('mdbarActive');
    });
});

const displayRandomProducts = (goods) => {
    const randomGoodsContainer = document.querySelector('.randomGoodsContainer');
    randomGoodsContainer.innerHTML = '';

    const shuffledGoods = goods.sort(() => Math.random() - 0.5).slice(0, 4);
    shuffledGoods.forEach(good => {
        randomGoodsContainer.innerHTML += `
             <a class="product" href="./goodsDetail.html?productId=${good.id}">
            <div class="goods">
                <img src="${good.img}" alt="${good.name}">
                <h3>${good.name}</h3>
                <h2>
                    <span>$</span>${good.price} 
                    <span class="secondPrice">$<span>${good.price2}</span></span>
                </h2>
                <button>Add to Cart</button>
            </div>
        </a>
        `;
    });
};

const initialize = async () => {
    const goods = await fetchProducts();
    displayRandomProducts(goods);
};
initialize();


const closeHover = document.querySelector('.closeHover');
const hoverContain = document.querySelector('.hoverContain');
const cartShow = document.querySelector('.cartShow');

cartShow. addEventListener('click',()=> hoverContain.style.display = "block");
closeHover.addEventListener('click',()=> hoverContain.style.display = "none");

