
const product = {
  name: "Laptop",
  price: 390000,
  quantity: 10
};

// 1. CREATE — Add a new product
async function addProduct() {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();
  console.log(data);
}

// 2. READ — Get all products
async function getProducts() {
  const response = await fetch("http://localhost:3000/products");

  const data = await response.json();
  console.log(data);
}

// 3. READ — Get one product by ID
async function getProduct(id) {
  const response = await fetch(`http://localhost:3000/products/${id}`);

  const data = await response.json();
  console.log(data);
}

// 4. UPDATE — Replace all editable fields using PUT
async function replaceProduct(id) {
  const updatedProduct = {
    name: "Wireless Keyboard",
    price: 75000,
    quantity: 20
  };

  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedProduct)
  });

  const data = await response.json();
  console.log(data);
}

// 5. UPDATE — Change selected fields using PATCH
async function updateProduct(id) {
  const changes = {
    quantity: 15
  };

  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(changes)
  });

  const data = await response.json();
  console.log(data);
}

// 6. DELETE — Remove a product by ID
async function deleteProduct(id) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();
  console.log(data);
}


// Choose ONE operation to run at a time:
//getProducts();
 //addProduct();
 //getProduct(1);
//replaceProduct(1);
 //updateProduct(1);
 //deleteProduct(3);
