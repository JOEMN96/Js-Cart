// Variables From DOm

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const carttotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");

//  <----- Cart --->

let cart = [];

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
            <button class="bag-btn" data-id="${product.id}"> <i class="fas fa-shopping-cart">Add To Bag</i> </button>
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
    console.log(bagBtns);
  }
}

// Local storage

class Storage {
  static setLocalStorage(productArr) {
    localStorage.setItem("products", JSON.stringify(productArr)); // Saving product to Local Storage
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
