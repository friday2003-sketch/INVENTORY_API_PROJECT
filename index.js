import express from 'express'
import db from './dataB.js'


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Inventory API');
});
app.get('/products', (req, res) => {
  const products = db.prepare(`SELECT * FROM 
  products`).all()
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({
      message: 'Invalid Product id'
    })
  }
  const product = db.prepare(`
    SELECT * FROM products 
    WHERE id=?`).get(productId)

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price, quantity } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: 'Product name is required'
    })
  }

  if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 0) {
    return res.status(400).json({
      message: 'Product quantity is not valid'
    })
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      message: 'Product price is not valid'
    })
  }

  const result = db.prepare(`INSERT INTO products
    (name, price, quantity) VALUES (?, ?, ?)`
  ).run(name.trim(), price, quantity)

  const newProducts = db.prepare(`SELECT * FROM products
     WHERE  id=?`
  ).get(Number(result.lastInsertRowid))
  res.status(201).json({
    message: 'Product added successfully',
    product: newProducts
  })
})



app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: 'invalid product ID'
    })
  }
  // 1. Find the existing product

  // 2. Read all required fields
  const { name, price, quantity } = req.body;

  // 3. Validate name
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: 'Product name is required'
    });
  }

  // 4. Validate price
  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return res.status(400).json({
      message: 'Product price is not valid'
    });
  }

  // 5. Validate quantity
  if (
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    return res.status(400).json({
      message: 'Product quantity is not valid'
    });
  }
  const result = db.prepare(`
  UPDATE products SET name=?,
   price=?,
    quantity=?
    WHERE id=?
  `).run(name.trim(), price, quantity, id)


  if (result.changes === 0) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }
  // 6. Replace the product's fields
  const updatedProduct = db.prepare(`SELECT * FROM products 
  WHERE id=?`).get(id)
  // 7. Send the updated product
  return res.status(200).json({
    message: 'Product replaced successfully',
    product: updatedProduct
  });
});


app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return  res.status(400).json({
      message: 'Invalid product ID'
    })
  }
  const product = db.prepare(`SELECT * FROM products
     WHERE ID=?`).get(id)
  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }
  // 2. Read the submitted fields
  const { name, price, quantity } = req.body;

  // 3. Ensure at least one field was provided
  if (
    name === undefined &&
    price === undefined &&
    quantity === undefined
  ) {
    return res.status(400).json({
      message: "Provide at least one field to update"
    });
  }

  // 4. Validate name if provided
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "Name must be a non-empty string"
      });
    }
  }

  // 5. Validate price if provided
  if (price !== undefined) {
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        message: "Price must be a valid non-negative number"
      });
    }
  }

  // 6. Validate quantity if provided
  if (quantity !== undefined) {
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a non-negative integer"
      });
    }
  }

  // 7. Update only the fields provided

  let updates = []
  let values = []
  if (name !== undefined) {
    updates.push('name=?')
    values.push(name.trim())
  }

  if (price !== undefined) {
    updates.push('price=?')
    values.push(price)
  }

  if (quantity !== undefined) {
    updates.push('quantity=?')
    values.push(quantity)
  }
  values.push(id)
  db.prepare(`
  UPDATE products SET ${updates.join(', ')}
  WHERE id=?`).run(...values);


  // 8. Return the updated product
  const updatedProduct = db.prepare(`
    SELECT * FROM products WHERE id=?
    `).run(id)

  return res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct
  });
});


app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return  res.status(400).json({
      message: 'Invalid product ID'
    })
  }

  // 1. Find the product's position in the array
const product=db.prepare(`SELECT * FROM products 
  WHERE id=?`).get(id)
  // 2. Check whether the product exists
  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  // 3. Remove one product from the array
db.prepare(` DELETE FROM products
  WHERE id=?`).run(id)
  // 4. Confirm deletion
  return res.status(200).json({
    message: 'Product deleted successfully',
    product: product
  });
});

app.listen(3000, () => {
  console.log('Inventory API is running on port 3000');
});