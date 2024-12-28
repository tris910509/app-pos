// Helper Functions
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const generateId = (prefix) => `${prefix}-${Date.now()}`;
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => (section.style.display = 'none'));
    document.getElementById(sectionId).style.display = 'block';
};

// Customers
function addCustomer() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const id = generateId('CUST');

    if (!name || !phone || !address || !email) {
        alert('Semua field wajib diisi!');
        return;
    }

    const customers = getFromLocalStorage('customers');
    customers.push({ id, name, phone, address, email });
    saveToLocalStorage('customers', customers);
    displayCustomers();
    document.getElementById('customerForm').reset();
}

function displayCustomers() {
    const customers = getFromLocalStorage('customers');
    const list = document.getElementById('customerList');
    list.innerHTML = customers.map(c => `<p>${c.id} - ${c.name} (${c.phone}, ${c.email}, ${c.address})</p>`).join('');
}

// Kategori
function addCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const id = generateId('CAT');

    if (!name) {
        alert('Nama Kategori wajib diisi!');
        return;
    }

    const categories = getFromLocalStorage('categories');
    categories.push({ id, name });
    saveToLocalStorage('categories', categories);
    displayCategories();
    document.getElementById('categoryForm').reset();
}

function displayCategories() {
    const categories = getFromLocalStorage('categories');
    const dropdown = document.getElementById('productCategory');
    dropdown.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Supplier
function addSupplier() {
    const name = document.getElementById('supplierName').value.trim();
    const company = document.getElementById('supplierCompany').value.trim();
    const phone = document.getElementById('supplierPhone').value.trim();
    const address = document.getElementById('supplierAddress').value.trim();
    const id = generateId('SUPP');

    if (!name || !company || !phone || !address) {
        alert('Semua field wajib diisi!');
        return;
    }

    const suppliers = getFromLocalStorage('suppliers');
    suppliers.push({ id, name, company, phone, address });
    saveToLocalStorage('suppliers', suppliers);
    displaySuppliers();
    document.getElementById('supplierForm').reset();
}

function displaySuppliers() {
    const suppliers = getFromLocalStorage('suppliers');
    const dropdown = document.getElementById('productSupplier');
    dropdown.innerHTML = suppliers.map(supp => `<option value="${supp.id}">${supp.name} (${supp.company})</option>`).join('');
}

// Produk
function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const item = document.getElementById('productItem').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const supplier = document.getElementById('productSupplier').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value.trim());
    const stock = parseInt(document.getElementById('productStock').value.trim());
    const id = generateId('PROD');

    if (!name || !item || !category || !supplier || isNaN(price) || isNaN(stock)) {
        alert('Semua field wajib diisi!');
        return;
    }

    const products = getFromLocalStorage('products');
    products.push({ id, name, item, category, supplier, price, stock });
    saveToLocalStorage('products', products);
    displayProducts();
    document.getElementById('productForm').reset();
}

function displayProducts() {
    const products = getFromLocalStorage('products');
    const list = document.getElementById('productList');
    const dropdown = document.getElementById('transactionProduct');

    list.innerHTML = products.map(
        p => `<p>${p.id} - ${p.name} (${p.item}, ${p.price}, Stok: ${p.stock})</p>`
    ).join('');
    dropdown.innerHTML = products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

// Transaksi
function addTransaction() {
    const productId = document.getElementById('transactionProduct').value;
    const quantity = parseInt(document.getElementById('transactionQuantity').value.trim());
    const payment = parseFloat(document.getElementById('transactionPayment').value.trim());
    const discount = parseFloat(document.getElementById('transactionDiscount').value.trim()) || 0;
    const method = document.getElementById('transactionMethod').value;
    const id = generateId('TRX');
    const date = new Date().toLocaleString();

    if (!productId || isNaN(quantity) || isNaN(payment)) {
        alert('Semua field wajib diisi!');
        return;
    }

    const products = getFromLocalStorage('products');
    const product = products.find(p => p.id === productId);

    if (!product || product.stock < quantity) {
        alert('Stok tidak cukup!');
        return;
    }

    const total = product.price * quantity;
    const discountedTotal = total - (total * discount / 100);
    const change = payment - discountedTotal;
    const status = change >= 0 ? 'Lunas' : 'Belum Bayar';

    const transactions = getFromLocalStorage('transactions');
    transactions.push({ id, product: product.name, quantity, total, payment, change, discount, status, method, date });
    saveToLocalStorage('transactions', transactions);

    // Kurangi stok
    product.stock -= quantity;
    saveToLocalStorage('products', products);

    displayTransactions();
    displayProducts();
    document.getElementById('transactionForm').reset();
}

function displayTransactions() {
    const transactions = getFromLocalStorage('transactions');
    const list = document.getElementById('transactionList');
    list.innerHTML = transactions.map(
        t => `<p>${t.date} - ${t.product} x ${t.quantity} = ${t.total} (Diskon: ${t.discount}%, Bayar: ${t.payment}, Kembalian: ${t.change}, Status: ${t.status}, Metode: ${t.method})</p>`
    ).join('');
}

// Laporan
function generateReport() {
    const transactions = getFromLocalStorage('transactions');
    const list = document.getElementById('reportList');
    list.innerHTML = transactions.map(
        t => `<p>${t.date} - ${t.product} x ${t.quantity} = ${t.total} (Status: ${t.status})</p>`
    ).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCustomers();
    displayCategories();
    displaySuppliers();
    displayProducts();
    displayTransactions();
    showSection('customers');
});
