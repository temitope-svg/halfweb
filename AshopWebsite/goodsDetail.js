const urlParams = new URLSearchParams(window.location.search);
const goodsId = urlParams.get('productId')

const loadProduct = async () =>{
    const product = await fetchProductById(goodsId);
    console.log(product)
    document.querySelector('.goodsName').innerHTML=product.name;
    document.querySelector('.goodsPrice').innerHTML=product.price;
    document.querySelector('.goodsPrice2').innerHTML=product.price2;
    document.querySelector('.proImg').src =product.img;
  }
loadProduct();


let Header = document.querySelectorAll('.mdHeader');
let Details = document.querySelectorAll('.mdeatilsBar');

Header.forEach((header, index) => {
    header.addEventListener('click', () => {
      Details.forEach(detail => detail.classList.remove('mdbarActive'));
      Details[index].classList.add('mdbarActive');
      
    });
  });

  
  let addValue = document.querySelector('.addValue');
  let minusValue = document.querySelector('.minusValue');
  let valueField = document.querySelector('.qualityValue');
  let value = parseInt(valueField.value) || 0;
  addValue.addEventListener('click', () => {
      value++; 
      valueField.value = value; 
  });

  minusValue.addEventListener('click', () => {
      if (value > 0) { 
          value--; 
          valueField.value = value; 
      }
  });


let AddTocart = document.querySelector('.AddTocart');
let loadCart = document.querySelector('.loadCart');
AddTocart.addEventListener('click',()=>{
  let goodsCart = document.createElement('div');
  goodsCart.classList.add('lCTop');
  goodsCart.innerHTML =`
                <div class="lctopRight">
                 <img src="./images/goodsimg/goods1.jpg">
                 </div>
                 <div class="lctopLeft">
                    <h3>gooodsName</h3>
                    <h4>
                      <span>$</span><span class="price">990</span>
                      <span> 2</span> <span>x</span>
                      <span>$</span><span class="price2">990</span>
                    </h4>
                 </div>
                 <div class="lctLast">
                  <button><span class="material-symbols-outlined">close</span></button>
                 </div>
               </div>
  `
  loadCart.appendChild(goodsCart);
})


  const displayRandomProducts = (goods) => {
    let randomGoodsContainer = document.querySelector('.randomGoodsContainer');
    randomGoodsContainer.innerHTML = ''; 
    if (!goods.length) {
      randomGoodsContainer.innerHTML = "<p>No products available</p>";
        return;
    }
    let shuffledGoods = goods.sort(() => 0.5 - Math.random());
    let selectedGoods = shuffledGoods.slice(0, 5);
    const goodsHTML = selectedGoods.map(good => `
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

    randomGoodsContainer.innerHTML = goodsHTML;
};

const initialize = async () => {
  const goods = await fetchProducts();
  displayRandomProducts(goods)
};
initialize();