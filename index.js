const titleInp = document.querySelector("#title");
const searchInput = document.getElementById("searchInput");
const descriptionInp = document.querySelector("#description");
const priceInp = document.querySelector("#price");
const form = document.querySelector(".form");
const updateBtn = document.querySelector("#update");
const products = document.querySelector(".products");
const categorySelect = document.querySelector("#categorySelect");
const categories = document.querySelectorAll("#category");
const filterSelect = document.querySelector("#filter");

let allProducts = [];

async function getData(category, sortType) {
  const response = await fetch(
    `http://localhost:3000/products${category ? "?" + `category=${category}` : ""}`,
  );
  const data = await response.json();
  allProducts = data;
  displayData(data, sortType);
}

function sortProducts(products, sortType) {
  return products.sort((a, b) => {
    if (sortType === "cheaper") {
      return Number(a.price) - Number(+b.price);
    } else {
      return Number(a.price) + Number(+b.price);
    }
  });
}

async function displayFilteredData(filteredData) {
  products.innerHTML = "";
  filteredData.forEach((item, i) => {
    products.innerHTML += `
                <div class="product">
                    <img src='${item.image}' />
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <b>${item.price}</b>
                    <button id="${item.id}" class="btn">Edit</button>
                </div>
            `;
  });
}

function displayData(data, sortType) {
  products.innerHTML = "";
  sortProducts(data, sortType)
    .slice(5, 10)
    .forEach((item, i) => {
      products.innerHTML += `
            <div class="product">
              <img src='${item.image}' />
              <h2>${item.title}</h2>
              <p>${item.description}</p>
              <b>${item.price}</b>
              <button id="${item.id}" class="btn">Edit</button>
            </div>
          `;
    });
  const btns = document.querySelectorAll(".btn");
  btns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(button.id);
      const existingItem = data?.find((item) => +item.id === +button.id);
      editProduct(existingItem);
    });
  });
  console.log(btns);
}
getData();

searchInput.addEventListener("input", function (event) {
  const searchString = event.target.value.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchString),
  );
  displayFilteredData(filteredProducts);
});

categorySelect.addEventListener("change", (e) => {
  e.preventDefault();
  getData(e.target.value);
});

filterSelect.addEventListener("change", (e) => {
  e.preventDefault();
  getData("", e.target.value);
});

function editProduct(item) {
  console.log(item);
  titleInp.value = item?.title;
  descriptionInp.value = item?.description;
  priceInp.value = item?.price;

  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateProduct(item.id);
  });
}

function updateProduct(id) {
  const obj = {
    id: id,
    title: titleInp.value,
    price: +priceInp.value,
    description: descriptionInp.value,
  };
  fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
  getData();
}
