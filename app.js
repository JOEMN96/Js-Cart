// Variables From DOm

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");

//  <----- Cart --->

let cart = [];

let buttonsDOM = [];
//  <----- Classes --->

// Getting product

class Product {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();

      let products = data.items; // Array la irunthu value Ah seprate panrom

      products = products.map((item) => {
        let { title, price } = item.fields; // Destructuring
        let id = item.sys.id;
        let image = item.fields.image.fields.file.url;
        let ar = { title, price, id, image };
        return { title, price, id, image }; // Returning Value (a object of Destructure values) from this ExecutionContext
      });

      return products; // returning Value to .then & Catch
    } catch (error) {
      console.log(error);
    }
  }
}

// ui class

class UI {
  // method to Display items in DoM
  displayProduct(products) {
    let result = "";
    products.forEach((product) => {
      // looping through the array of products
      result += `
            
            <article class="product">
            <div  class="img-container">
            <img src="${product.image}"  alt="Product1" class="product-img">
            <button class="bag-btn" data-id="${product.id}"> <i class="fas fa-shopping-cart"></i>Add To Bag </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
            </article> 
            `;
    });
    productDOM.innerHTML = result; // Populating the Dom
  }

  // Getting Bag Btns

  getbagBtn() {
    const bagBtns = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = bagBtns;
    bagBtns.forEach(btn => {
      let id = btn.dataset.id;
      let incart = cart.find(item => item.id === id); // Future use
      if (incart) {

        btn.innerText = "InCart";
        btn.disabled = true;
      }

      btn.addEventListener('click', e => {
        e.target.innerText = " InCart"      // adding clicking funcnality to cart
        e.target.disabled = true;
        // Getting Product from local storage
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        // Seting up cart array in global scope
        cart = [...cart, cartItem]; // Already iruka cartitems + newAdded Items
        // Saving cart to local storage
        Storage.saveCart(cart);
        // Setting up UI CartValues
        this.setCartValues(cart);
        // Update Ui of Actual CART
        this.updateCart(cartItem);
      })
    })
  }

  setCartValues(cart) {
    let priceTotal = 0;
    let cartVal = 0;

    cart.map((item) => {

      priceTotal += item.price * item.amount;
      cartVal += item.amount;
    })

    cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
    cartItems.innerText = cartVal;
  }

  updateCart(cart) {
    let div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
            <img src="${cart.image}">
            <div>
              <h4>${cart.title}</h4>
              <h5>$${cart.price}</h5>
              <span class="remove-item" data-id="${cart.id}">Remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id="${cart.id}></i>
              <p class="item-amount">${cart.amount}</p>
              <i class="fas fa-chevron-down">data-id="${cart.id}</i>
            </div> `;

    cartContent.appendChild(div);
    console.log(cartContent);
  }

}

// Local storage

class Storage {
  static setLocalStorage(productArr) {
    localStorage.setItem("products", JSON.stringify(productArr)); // Saving product to Local Storage
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(products => products.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}

// <----- Event Lisners --->

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const product = new Product();
  //get all products
  product
    .getProducts()
    .then((products) => {
      ui.displayProduct(products);
      Storage.setLocalStorage(products);
    })
    .then(() => {
      ui.getbagBtn();
    });
});
