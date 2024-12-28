// Helper Function
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// CRUD Functions
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

// Add Customer
function addCustomer() {
    const id = document.getElementById('customerId').value.trim();
    const name = document.getElementById('customerName').value.trim();
    const notes = document.getElementById('customerNotes').value.trim();

    if (!id || !name) {
        alert("ID dan Nama Pelanggan wajib diisi!");
        return;
    }

    const customers = getFromLocalStorage('customers');
    customers.push({ id, name, notes });
    saveToLocalStorage('customers', customers);
    displayCustomers();
    document.getElementById('customerForm').reset();
}

// Add Product
function addProduct() {
    const id = document.getElementById('productId').value.trim();
    const name = document.getElementById('productName').value.trim();
    const notes = document.getElementById('productNotes').value.trim();

    if (!id || !name) {
        alert("ID dan Nama Produk wajib diisi!");
        return;
    }

    const products = getFromLocalStorage('products');
    products.push({ id, name, notes });
    saveToLocalStorage('products', products);
    displayProducts();
    document.getElementById('productForm').reset();
}

// Add Transaction
function addTransaction() {
    const id = document.getElementById('transactionId').value.trim();
    const customerId = document.getElementById('customerForTransaction').value.trim();
    const productId = document.getElementById('productForTransaction').value.trim();

    if (!id || !customerId || !productId) {
        alert("Semua field wajib diisi!");
        return;
    }

    const transactions = getFromLocalStorage('transactions');
    transactions.push({ id, customerId, productId });
    saveToLocalStorage('transactions', transactions);
    displayTransactions();
    document.getElementById('transactionForm').reset();
}

// Display Data
function displayCustomers() {
    const customers = getFromLocalStorage('customers');
    const list = document.getElementById('customerList');
    list.innerHTML = customers.map(c => `<p>${c.id} - ${c.name} (${c.notes || 'Tidak ada keterangan'})</p>`).join('');
}

function displayProducts() {
    const products = getFromLocalStorage('products');
    const list = document.getElementById('productList');
    list.innerHTML = products.map(p => `<p>${p.id} - ${p.name} (${p.notes || 'Tidak ada keterangan'})</p>`).join('');
}

function displayTransactions() {
    const transactions = getFromLocalStorage('transactions');
    const list = document.getElementById('transactionList');
    list.innerHTML = transactions.map(t => `<p>${t.id} - Pelanggan ${t.customerId} membeli produk ${t.productId}</p>`).join('');
}

// Generate Report
function generateReport() {
    const transactions = getFromLocalStorage('transactions');
    const customers = getFromLocalStorage('customers');
    const products = getFromLocalStorage('products');

    const report = transactions.map(t => {
        const customer = customers.find(c => c.id === t.customerId) || { name: 'Tidak ditemukan' };
        const product = products.find(p => p.id === t.productId) || { name: 'Tidak ditemukan' };
        return `<p>Transaksi ${t.id}: ${customer.name} membeli ${product.name}</p>`;
    });

    const list = document.getElementById('reportList');
    list.innerHTML = report.join('');
}

// Initialize
showSection('customers');
displayCustomers();
displayProducts();
displayTransactions();
