document.addEventListener('DOMContentLoaded', () => {
    const emptyCart = document.querySelector('.emptyCart');
    const loadCart = document.querySelector('.loadCart');
    const totalCartElement = document.querySelector('.totalCart');
    const countElement = document.querySelector('.count');
    const cartContainer = document.querySelector('.subContain');
    const productTable = document.querySelector('.productTable');
    const tableSubtotal = document.querySelector('.tableSubtotal');
    const tableTotal = document.querySelector('.tableTotal');

    const getCartData = () => JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartDisplay = () => {
        try {
            const cartData = getCartData();
            const total = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
            
            totalCartElement.textContent = total;
            countElement.textContent = cartData.length;

            emptyCart.classList.toggle('emptyCartActive', cartData.length === 0);
            loadCart.classList.toggle('loadCartActive', cartData.length > 0);
        } catch (error) {
            console.error('Error updating cart display:', error);
        }
    };

    const renderCart = () => {
        try {
            let cartData = getCartData();
            cartContainer.innerHTML = '';

            if (cartData.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                totalCartElement.textContent = "0.00";
                return;
            }

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
                        <button class="removeItem" data-index="${index}">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                `;
                cartContainer.appendChild(cartItem);
            });

            totalCartElement.textContent = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
            updateCartDisplay();
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    };

    cartContainer.addEventListener('click', (event) => {
        if (event.target.closest('.removeItem')) {
            let cartData = getCartData();
            const index = event.target.closest('.removeItem').dataset.index;

            cartData.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartData));

            renderCart(); 
        }
    });

    const displayCart = () => {
        try {
            let cartData = getCartData();
            productTable.innerHTML = '';

            if (cartData.length === 0) {
                productTable.innerHTML = "<p>Your cart is empty.</p>";
                tableSubtotal.textContent = "0.00";
                tableTotal.textContent = "0.00";
                return;
            }

            cartData.forEach((item) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('tablet');
                cartItem.innerHTML = `
                    <div class="tabletLeft">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="tabletMid">
                        <h4>${item.name}<span> x </span> <span>${item.quantity}</span></h4>
                        <p>Selected Brand <span> : </span><span> ${item.brand} </span></p>
                        <p>Selected Color <span> : </span><span> ${item.color} </span></p>
                        <p>Selected Size <span> : </span><span> ${item.size} </span></p>
                    </div>
                    <div class="tableRight">
                        <p><span>$</span><span>${item.totalPrice}</span></p>
                    </div>
                `;
                productTable.appendChild(cartItem);
            });

            const total = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
            tableSubtotal.textContent = total;
            tableTotal.textContent = total;
        } catch (error) {
            console.error('Error displaying cart:', error);
        }
    };

    renderCart();
    displayCart();
});


const countryDropdown = document.getElementById("country");

fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then(data => {
        const countries = data.map(country => ({
            code: country.cca2,
            name: country.name.common
        }));

        countries.sort((a, b) => a.name.localeCompare(b.name)); 

        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.code;
            option.textContent = country.name;
            countryDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching countries:", error));
