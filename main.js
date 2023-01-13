let openModalBtn = document.getElementById("openProductModal");
let modal = document.querySelector(".modal");
let allInputs = document.querySelectorAll(".modal-content input");
let productTitle = document.getElementById("title");
let productPrice = document.getElementById("price");
let productTaxes = document.getElementById("taxes");
let productAds = document.getElementById("ads");
let productDiscount = document.getElementById("discount");
let finalPrice = document.getElementById("total");
let productTotalNumber = document.getElementById("proTotalNum");
let productCount = document.getElementById("count");
let productCategory = document.getElementById("category");
let ProductDate = document.getElementById("date");
let createBtn = document.getElementById("create");
let saveBtn = document.getElementById("save");
let cancelModalBtn = document.getElementById("cancel");
let clearAllData = document.getElementById("dropDataBase");
let tbody = document.querySelector("tbody");
let searchWith = document.getElementById("searchWith");
let searchBox = document.getElementById("search");
let searchedDate = document.getElementById("searchedDate");
let searchP = document.getElementById("searchP");
let searchResults = document.getElementById("NumberOfSearchResults");

let productsList = [];
let itemClickedId;

window.onload = function () {
  if (window.localStorage.getItem("data")) {
    productsList = JSON.parse(window.localStorage.getItem("data"))
  }
  createProduct(productsList);
}

// This function for empty all fields
function empty() {
  allInputs.forEach((input) => {
    input.value = "";
    input.parentNode.classList.remove("danger");
  });
  finalPrice.innerHTML = "";
}

clearAllData.onclick = function () {
  tbody.innerHTML = "";
  productsList = [];
  window.localStorage.removeItem("data");
};

openModalBtn.onclick = function () {
  saveBtn.style.display = "none";
  productCount.disabled = false;
  createBtn.style.display = "inline-block";
  modal.classList.add("fade-in");
  empty();
}

cancelModalBtn.onclick = function () {
  modal.classList.remove("fade-in");
  empty();
};

document.querySelectorAll(".prices input").forEach((input) => {
  input.addEventListener("keyup", function () {
    total = 
    (+productPrice.value > 0 ? +productPrice.value : -productPrice.value) + 
    (productTaxes.value > 0 ? +productTaxes.value : -productTaxes.value) + 
    (+productAds.value > 0 ? +productAds.value : -productAds.value) -
    (+productDiscount.value > 0 ? +productDiscount.value : -productDiscount.value)
    
    if (total < 0) {
      finalPrice.innerHTML = `${total} it must be positive number`;
      finalPrice.style.color = "red";
    } else {
      finalPrice.innerHTML = total;
      finalPrice.style.color = "white";
    }
  });
});

allInputs.forEach(input => {
  input.addEventListener("blur", function () {
    if (input.value !== "") {
      if (input.value < 0) {
        input.value = -input.value;
      } else {
        input.value = input.value;
      }
      input.parentNode.classList.remove("danger");
    } else {
      input.parentNode.classList.add("danger");
    }
  });
});


function check() {
  let fieldsNums = allInputs.length;
  allInputs.forEach((input) => {
    if (input.value === "") {
      input.parentNode.classList.add("danger");
      fieldsNums--;
    } else if (isNaN(finalPrice.innerHTML)) {
      fieldsNums--;
    }
  });
  if (fieldsNums === allInputs.length) {
    return true
  } else {
    return false
  }
}

createBtn.onclick = function () {
  if (check()) {
    let count = +productCount.value < 1 ? 1 : +productCount.value;
    for (let i = 1; i <= count; i++) {
      const proObject = {
        id: generateRandomId(),
        title: productTitle.value.trim().toLowerCase(),
        price: productPrice.value,
        taxes: productTaxes.value,
        ads: productAds.value,
        discount: productDiscount.value,
        total: finalPrice.innerHTML.trim(),
        proNums: +productTotalNumber.value,
        date: ProductDate.value,
        category: productCategory.value.trim().toLowerCase(),
      };
      productsList.push(proObject);
    }
    saveToLocalStorage(productsList);
    createProduct(productsList);
    cancelModalBtn.click();
  }
};

function createProduct(list) {
  if (list.length > 0) {
    tbody.innerHTML = "";
  }
  list.forEach(pro => {
    let tr = document.createElement("tr");
    tr.id = pro.id;
    let proId = document.createElement("td");
    proId.innerHTML = list.indexOf(pro) + 1;
    let proTitle = document.createElement("td");
    proTitle.innerHTML = pro.title;
    let proPrice = document.createElement("td");
    proPrice.innerHTML = pro.price;
    let proTaxes = document.createElement("td");
    proTaxes.innerHTML = pro.taxes;
    let proAds = document.createElement("td");
    proAds.innerHTML = pro.ads; 
    let proDiscount = document.createElement("td");
    proDiscount.innerHTML = pro.discount;
    let proTotal = document.createElement("td");
    proTotal.innerHTML = pro.total;
    let proTotalNumber = document.createElement("td");
    proTotalNumber.innerHTML = pro.proNums;
    let proDate = document.createElement("td");
    proDate.innerHTML = pro.date; 
    let proCategoey = document.createElement("td");
    proCategoey.innerHTML = pro.category; 
    let editBtn = document.createElement("td");
    let editTextNode = document.createTextNode("edit");
    editBtn.append(editTextNode); 
    let delBtn = document.createElement("td");
    let delTextNode = document.createTextNode("del")
    delBtn.append(delTextNode);

    tr.appendChild(proId); tr.appendChild(proTitle); tr.appendChild(proPrice); tr.appendChild(proTaxes);
    tr.appendChild(proAds); tr.appendChild(proDiscount); tr.appendChild(proTotal); tr.appendChild(proTotalNumber);
    tr.appendChild(proDate); tr.appendChild(proCategoey); tr.appendChild(editBtn); tr.appendChild(delBtn);
    tbody.appendChild(tr);

    editBtn.onclick = function (e) {
      listOfItemData = Array.from(e.target.parentNode.children);
      editItem(listOfItemData);
      let editedItemId = e.target.parentNode.id;
      itemClickedId = editedItemId;
    };
    delBtn.onclick = function (e) {
      tbody.removeChild(e.target.parentNode);
      let dataList = JSON.parse(window.localStorage.getItem("data"));
      dataList = dataList.filter((pro) => pro.id != e.target.parentNode.id);
      createProduct(dataList);
      saveToLocalStorage(dataList)
    }
  });
}

// This function used to fill the form with the old data of the edited Item
function editItem(list) {
  document.getElementById("modal-title").innerHTML = "Edit";
  saveBtn.style.display = "inline-block";
  createBtn.style.display = "none";
  productCount.disabled = true;

  productTitle.value = list[1].innerHTML.trim();
  productPrice.value = +list[2].innerHTML;
  productTaxes.value = +list[3].innerHTML;
  productAds.value = +list[4].innerHTML;
  productDiscount.value = +list[5].innerHTML;
  finalPrice.innerHTML = list[6].innerHTML.trim();
  productTotalNumber.value = list[7].innerHTML.trim();
  productCount.value = "0";
  ProductDate.value = list[8].innerHTML;
  productCategory.value = list[9].innerHTML.trim();

  modal.classList.add("fade-in");
}

function saveNewItemData(newProObject) {
  let editedItemObject = productsList.filter((item) => item.id === newProObject.id);
  let indexOfEditedItemObject = productsList.indexOf(editedItemObject[0]);
  productsList.splice(indexOfEditedItemObject, 1, newProObject);
  createProduct(productsList);
  saveToLocalStorage(productsList);
}

saveBtn.onclick = function () {
  if (check()) {
    const newProObject = {
      id: itemClickedId,
      title: productTitle.value.trim().toLowerCase(),
      price: productPrice.value,
      taxes: productTaxes.value,
      ads: productAds.value,
      discount: productDiscount.value,
      total: finalPrice.innerHTML.trim(),
      proNums: productTotalNumber.value,
      date: ProductDate.value,
      category: productCategory.value.trim().toLowerCase(),
    };
    saveNewItemData(newProObject);
    modal.classList.remove("fade-in");
  }
};

function generateRandomId() {
  let chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < 4; i++){
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function saveToLocalStorage(dataList) {
  window.localStorage.setItem("data", JSON.stringify(dataList));
}

let timer;
const waitTime = 500;

const search = (filterKey, filterDataWith) => {
  let filteredDataList; 
  if (filterDataWith === "title") {
    filteredDataList = productsList.filter((pro) => pro.title.includes(filterKey));
  } else if (filterDataWith === "category")  {
    filteredDataList = productsList.filter((pro) => pro.category.includes(filterKey));
  } else {
    filteredDataList = productsList.filter((pro) => pro.date.includes(filterKey));
  }
  searchP.style.display = "block";
  searchResults.innerHTML = filteredDataList.length;
  filteredDataList.length > 0
    ? createProduct(filteredDataList)
    : createProduct(productsList);
};

searchWith.addEventListener("change", function () {
  searchP.style.display = "none";
  if (searchWith.value === "title" || searchWith.value === "category") {
    searchBox.style.display = "block";
    searchBox.focus();
    searchBox.value = "";
    searchedDate.style.display = "none";
    createProduct(productsList);
    
    searchBox.addEventListener("keyup", function () {
      if (searchBox.value.trim() !== "") {
        const filterKey = searchBox.value.trim().toLowerCase();
        clearTimeout(timer);
        
        timer = setTimeout(() => {
          search(filterKey, searchWith.value);
        }, waitTime);
      } else {
        createProduct(productsList);
        searchP.style.display = "none";
      }
    });
  } else if (searchWith.value === "date") {
    searchedDate.style.display = "block";
    searchedDate.focus();
    searchedDate.value = "";
    searchBox.style.display = "none";
    createProduct(productsList);

    searchedDate.addEventListener("change", function () {
      if (searchedDate.value !== "") {
        const filterKey = searchedDate.value;
        clearTimeout(timer);

        timer = setTimeout(() => {
          search(filterKey, searchedDate.value).toLowerCase();
        }, waitTime);
      } else {
        createProduct(productsList);
      }
    });
  }
});