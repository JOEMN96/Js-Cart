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
            <button class="bag-btn" data-id="${product.id}"> <i class="fas fa-shopping-cart"></i>Add To Cart </button>
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
    bagBtns.forEach((btn) => {
      let id = btn.dataset.id;
      let incart = cart.find((item) => item.id === id); // Future use
      if (incart) {
        btn.innerText = "InCart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (e) => {
        e.target.innerText = " InCart"; // adding clicking funcnality to cart
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
        // Show cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {  // updating cart icon value & toal price inside the cart
    let priceTotal = 0;
    let cartVal = 0;

    cart.map((item) => {
      priceTotal += item.price * item.amount;
      cartVal += item.amount;
    });

    cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
    cartItems.innerText = cartVal;

    console.log(priceTotal);
  }

  updateCart(cart) {
    let div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `   <img src="${cart.image}">
                        <div>
                          <h4>${cart.title}</h4>
                          <h5>$${cart.price}</h5>
                          <span class="remove-item" data-id="${cart.id}">Remove</span>
                        </div>
                        <div>
                          <i class="fas fa-chevron-up" data-id="${cart.id}"></i>
                          <p class="item-amount">${cart.amount}</p>
                          <i class="fas fa-chevron-down" data-id="${cart.id}"></i>
                        </div> `;

    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  // Dom load agrapo cart valu ah set panara method 👇🏻
  appSetup() {
    // getting cart values from local storage
    cart = Storage.getCart();
    // setting up the cart total (antha chinna cart icon la iruka value)
    this.setCartValues(cart);
    // Populating the cart
    this.populateCart(cart);

    // cart action for open & close button ⬇
    cartBtn.addEventListener("click", () => {
      this.showCart();
    });

    closeCartBtn.addEventListener("click", () => {
      this.hideCart();
    });
  }

  populateCart(cart) {
    cart.forEach((cartItem) => {
      this.updateCart(cartItem);
    });
  }

  operationsInCart() {
    // clearing cart by pressing clear cart btn
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // Manupulating individual item from the cart (⬆⬇ & REmove btns Functionality)

    cartContent.addEventListener('click', (e) => {  // Event bubbling ah utilize panrom

      if (e.target.classList.contains('remove-item')) {
        // For remove btn in cart
        let removeItem = e.target;
        let id = removeItem.dataset.id;
        removeItem.parentElement.parentElement;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);

      } else if (e.target.classList.contains('fa-chevron-up')) {
        // for increse values in cart
        let updateItem = e.target;
        let id = updateItem.dataset.id;
        let temp = cart.find(item => item.id == id);
        temp.amount = temp.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        updateItem.nextElementSibling.innerText = temp.amount;

      } else if (e.target.classList.contains('fa-chevron-down')) {
        // for decrese value from cart
        let lowerAmountItem = e.target;
        let id = lowerAmountItem.dataset.id;
        let temp = cart.find(item => item.id == id); // local storage la irunthu data va edukurom
        temp.amount = temp.amount - 1;
        if (temp.amount > 0) {
          Storage.saveCart(cart); // local storage ah update panrom
          this.setCartValues(cart); // cart icon val ah set panrom
          lowerAmountItem.previousElementSibling.innerText = temp.amount;
        } else {
          // value 0 ku kela pona cart Item ah remove panrom
          cartContent.removeChild(lowerAmountItem.parentElement.parentElement)
          this.removeItem(id);
        }
      }


    })

  }

  // removing item from cart
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((eachid) => this.removeItem(eachid));
    // removing item from cart ui
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    // update cart icon value
    this.setCartValues(cart);
    // updating storage
    Storage.saveCart(cart);
    // quering btns to change the  text when item is removed from cart
    let btn = this.getSingleBtn(id);
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Bag`;
  }

  getSingleBtn(id) {
    return buttonsDOM.find((btn) => btn.dataset.id === id); // namma click pannna btn ah thedi edukurom
  }
}

// Local storage

class Storage {
  static setLocalStorage(productArr) {
    localStorage.setItem("products", JSON.stringify(productArr)); // Saving product to Local Storage (initial storage from server)
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((products) => products.id === id);  // getting a Specific product from storage using ID
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));  // updating cart value 
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
}

// <----- Event Lisners --->

document.addEventListener("DOMContentLoaded", () => {
  // instances
  const ui = new UI();
  const product = new Product();

  // App Setup

  ui.appSetup();

  //get all products for server
  product
    .getProducts()
    .then((products) => {
      ui.displayProduct(products);
      Storage.setLocalStorage(products);
    })
    .then(() => {
      ui.getbagBtn();
      ui.operationsInCart();
    });
});
