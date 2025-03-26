const emptyCart = document.querySelector('.emptyCart');
const loadCart = document.querySelector('.loadCart');
const totalCartElement = document.querySelector('.totalCart');
const countElement = document.querySelector('.count');
const closeHover = document.querySelector('.closeHover');
const hoverContain = document.querySelector('.hoverContain');
const cartShow = document.querySelector('.cartShow');

cartShow. addEventListener('click',()=> hoverContain.style.display = "block");
closeHover.addEventListener('click',()=> hoverContain.style.display = "none");


const updateCartDisplay = () => {
    try {
        const cartData = JSON.parse(localStorage.getItem( 'cart') || '[]');
        console.log('Cart Data:', cartData);

        const total = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);

        if (totalCartElement) totalCartElement.textContent = total;
        if (countElement) countElement.textContent = cartData.length;
        
        if (emptyCart) emptyCart.classList.toggle("emptyCartActive", cartData.length === 0);
        if (loadCart) loadCart.classList.toggle("loadCartActive", cartData.length > 0);
    } catch (error) {
        console.error('Error updating cart display:', error);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.subContain');
    const cartTotal = document.querySelector('.totalCart');

    console.log('Cart Container:', cartContainer);
    console.log('Total Cart Element:', cartTotal);

    const renderCart = () => {
        try {
            let cartData = JSON.parse(localStorage.getItem('cart') || '[]');
            console.log('Rendering Cart Data:', cartData);
            cartContainer.innerHTML = '';

            if (cartData.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                if (cartTotal) cartTotal.textContent = "0.00";
                return;
            }

            let total = 0;
            cartData.forEach((item, index) => {
                total += parseFloat(item.totalPrice);

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
                        <button class="removeItem" data-index="${index}">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                `;
                cartContainer.appendChild(cartItem);
            });

            if (cartTotal) cartTotal.textContent = total.toFixed(2);
            updateCartDisplay();
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    };

    cartContainer.addEventListener('click', (event) => {
        if (event.target.closest('.removeItem')) {
            let cartData = JSON.parse(localStorage.getItem('cart') || '[]');
            const index = parseInt(event.target.closest('.removeItem').dataset.index, 10);
            
            console.log('Removing item at index:', index);
            cartData.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartData));

            renderCart(); 
        }
    });

    renderCart();
});


let position = 0;
const container = document.querySelector('.featured_goods');
const children = document.querySelectorAll('.fea_goods');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

function getVisibleCount() {
    const wrapperWidth = document.querySelector('.wrapper').clientWidth;
    const childWidth = Math.max(children[0].clientWidth, 200); 
    return Math.floor(wrapperWidth / childWidth); 
}

function nextSlide() {
    const visibleChildren = getVisibleCount();
    const totalChildren = children.length;

    if (position + visibleChildren < totalChildren) {
        position += visibleChildren;
        updateTransform();
    }
}

function prevSlide() {
    const visibleChildren = getVisibleCount();
    if (position - visibleChildren >= 0) {
        position -= visibleChildren;
        updateTransform();
    } else {
        position = 0; 
        updateTransform();
    }
}

function updateTransform() {
    const childWidth = Math.max(children[0].clientWidth, 300); // Min width 300px
    container.style.transform = `translateX(-${position * childWidth}px)`;
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
window.addEventListener('resize', () => {
    position = 0; 
    updateTransform();
});
