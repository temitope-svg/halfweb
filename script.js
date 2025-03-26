let dclicks = document.querySelectorAll('.drop_top');
let drop = document.querySelectorAll('.drop');
let close_butt = document.querySelectorAll('.close_butt');
let open_butt = document.querySelectorAll('.open_butt');
let op_view = document.querySelector('.op_view');
let optionName = document.querySelectorAll('.optionName');
let options = document.querySelector('.options');
let optionDrop = document.querySelector('.optionDrop');
let searchInput = document.querySelector('.in_search');
let searchButton = document.querySelector('.click_search');
let rangeValue = document.querySelector('.rangeValue');
let  rangeInput = document.querySelector('.rangeInput');
let rangeClick = document.querySelector('.rangeClick');
rangeValue.textContent =  rangeInput.value;

if(dclicks.length == drop.length){
    for (let i = 0; i < dclicks.length; i++) {
      dclicks[i].addEventListener('click',()=>{
        drop[i].classList.toggle('active');
       if(drop[i].classList.contains("active")){
        close_butt[i].style.display ="none";
        open_butt[i].style.display ="block";
       }else{
        close_butt[i].style.display ="block";
        open_butt[i].style.display ="none";
       }
      }) 
    }
}else{
    console.log("your brain lock ?");
}
 
optionDrop.addEventListener('click',()=>options.classList.toggle('opBlock'));

for (let i = 0; i < optionName.length ; i++) {
    optionName[i].addEventListener('click',()=>{
        op_view.innerHTML = optionName[i].innerHTML;
        options.classList.remove('opBlock');
    })
}

const displayProducts = (goods) => {
    let goodsContainer = document.querySelector('.goodsContainer');
    goodsContainer.innerHTML = ''; 

    if (!goods.length) {
        goodsContainer.innerHTML = "<p>No products available</p>";
        return;
    }

    const goodsHTML = goods.map(good => `
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
    `).join("");

    goodsContainer.innerHTML = goodsHTML;
};

const setupCategories = (goods) => {
    let categoryContainer = document.querySelector('.categodrp');
    let categories = new Set();
    let categoryCounts = {}; 

    goods.forEach(good => {
        good.categories.forEach(category => {
            categories.add(category);
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
    });

    categoryContainer.innerHTML = [...categories].map(category => `
        <div class="categor" data-category="${category}">
            <input type="checkbox">
            <h4>${category}</h4>
            <p>(<span>${categoryCounts[category]}</span>)</p>
        </div>
    `).join("");

    document.querySelectorAll('.categor').forEach(button => {
        button.addEventListener('click', (e) => {
            let selectedCategory = e.target.closest('.categor')?.dataset.category;
            if (!selectedCategory) return;

            let filteredGoods = goods.filter(good => good.categories.includes(selectedCategory));
            displayProducts(filteredGoods);
        });
    });
};

const setupBrands = (goods) => {
    let brandContainer = document.querySelector('.branddrp');
    let brands = new Set();
    let brandCounts = {}; 

    goods.forEach(good => {
        if (good.brands && Array.isArray(good.brands)) { 
            good.brands.forEach(brand => {
                brands.add(brand);
                brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            });
        }
    });

    brandContainer.innerHTML = [...brands].map(brand => `
        <div class="categor" data-brand="${brand}">
            <input type="checkbox">
            <h4>${brand}</h4>
            <p>(<span>${brandCounts[brand]}</span>)</p>
        </div>
    `).join("");

    document.querySelectorAll('.categor').forEach(button => {
        button.addEventListener('click', (e) => {
            let selectedBrand = e.target.closest('.categor')?.dataset.brand;
            if (!selectedBrand) return;

            let filteredGoods = goods.filter(good => good.brands.includes(selectedBrand));
            displayProducts(filteredGoods);
        });
    });
};

const setupSearch = (goods) => {
    searchButton.addEventListener('click', () => {
        let searchIn = searchInput.value.toLowerCase().trim();
        if (!searchIn) {
            displayProducts(goods); 
            return;
        }

        let filteredGoods = goods.filter(good => good.name.toLowerCase().includes(searchIn));
        displayProducts(filteredGoods);
    });
};

const setupRange = (goods) =>{
   rangeClick.addEventListener('click', () => {
    let maxPrice = parseFloat(rangeInput.value);
    rangeValue.textContent =  maxPrice;
    if (isNaN(maxPrice)) return;

    let filteredGoods = goods.filter(good => parseFloat(good.price) <= maxPrice);
    displayProducts(filteredGoods);
});
}


const emptyCart = document.querySelector('.emptyCart');
const loadCart = document.querySelector('.loadCart');
const totalCartElement = document.querySelector('.totalCart');
const countElement = document.querySelector('.count');

const updateCartDisplay = () => {
    try {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cartData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);

        totalCartElement.textContent = total;
        countElement.textContent = cartData.length;

        emptyCart.classList.toggle("emptyCartActive", cartData.length === 0);
        loadCart.classList.toggle("loadCartActive", cartData.length > 0);
    } catch (error) {
        console.error('Error updating cart display:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.subContain');
    const cartTotal = document.querySelector('.totalCart');

    const renderCart = () => {
        try {
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];
            cartContainer.innerHTML = '';

            if (cartData.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                cartTotal.textContent = "0.00";
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

            cartTotal.textContent = total.toFixed(2);
            updateCartDisplay();
        } catch (error) {
            console.error('Error rendering cart:', error);
        }
    };

    cartContainer.addEventListener('click', (event) => {
        if (event.target.closest('.removeItem')) {
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];
            const index = event.target.closest('.removeItem').dataset.index;

            cartData.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartData));

            renderCart(); 
        }
    });

    renderCart();
});


const initializeFuntions = async () => {
    const goods = await fetchProducts();
    displayProducts(goods);
    setupCategories(goods);
    setupBrands(goods);
    setupSearch(goods); 
    setupRange(goods);
};

initializeFuntions();

const hoverContain = document.querySelector('.hoverContain');
const cartShow = document.querySelector('.cartShow');
const closeHover = document.querySelector('.closeHover');

cartShow. addEventListener('click',()=> hoverContain.style.display = "block");
closeHover.addEventListener('click',()=> hoverContain.style.display = "none");

