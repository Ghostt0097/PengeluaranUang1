// ==================================================================
// EXPENSE TRACKER APPLICATION
// Aplikasi pencatatan pengeluaran sederhana menggunakan localStorage
// ==================================================================

// CONFIGURATION
const STORAGE_KEY = 'expenseTrackerData';

// DOM ELEMENTS
const expenseForm = document.getElementById('expenseForm');
const expenseDate = document.getElementById('expenseDate');
const expenseName = document.getElementById('expenseName');
const expenseCategory = document.getElementById('expenseCategory');
const expenseAmount = document.getElementById('expenseAmount');
const expenseNote = document.getElementById('expenseNote');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formError = document.getElementById('formError');
const amountPreview = document.getElementById('amountPreview');

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const dateFromFilter = document.getElementById('dateFromFilter');
const dateToFilter = document.getElementById('dateToFilter');
const minAmountFilter = document.getElementById('minAmountFilter');
const maxAmountFilter = document.getElementById('maxAmountFilter');
const sortBy = document.getElementById('sortBy');
const resetFilterBtn = document.getElementById('resetFilterBtn');

const totalExpense = document.getElementById('totalExpense');
const transactionCount = document.getElementById('transactionCount');
const maxExpense = document.getElementById('maxExpense');
const avgExpense = document.getElementById('avgExpense');

const expenseTableBody = document.getElementById('expenseTableBody');
const emptyState = document.getElementById('emptyState');
const tableContainer = document.getElementById('tableContainer');

const exportExcelBtn = document.getElementById('exportExcelBtn');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const restoreFileInput = document.getElementById('restoreFileInput');
const fillSampleBtn = document.getElementById('fillSampleBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// STATE
let expenses = [];
let editingId = null;

// ==================================================================
// INITIALIZE APPLICATION
// ==================================================================

function initializeApp() {
    // Set tanggal default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    expenseDate.value = today;

    // Load data dari localStorage
    loadExpenses();

    // Render data awal
    renderExpenses();

    // Event Listeners
    setupEventListeners();
}

function setupEventListeners() {
    expenseForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    expenseAmount.addEventListener('input', handleAmountPreview);

    searchInput.addEventListener('input', debounce(renderExpenses, 300));
    categoryFilter.addEventListener('change', renderExpenses);
    dateFromFilter.addEventListener('change', renderExpenses);
    dateToFilter.addEventListener('change', renderExpenses);
    minAmountFilter.addEventListener('input', debounce(renderExpenses, 300));
    maxAmountFilter.addEventListener('input', debounce(renderExpenses, 300));
    sortBy.addEventListener('change', renderExpenses);
    resetFilterBtn.addEventListener('click', handleResetFilter);

    exportExcelBtn.addEventListener('click', handleExportExcel);
    backupBtn.addEventListener('click', handleBackup);
    restoreBtn.addEventListener('click', () => restoreFileInput.click());
    restoreFileInput.addEventListener('change', handleRestore);
    fillSampleBtn.addEventListener('click', handleFillSample);
    deleteAllBtn.addEventListener('click', handleDeleteAll);
}

// ==================================================================
// UTILITY FUNCTIONS
// ==================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'Rp0';
    }
    return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

function parseDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
}

function showError(message) {
    formError.textContent = message;
    formError.style.display = 'block';
    setTimeout(() => {
        formError.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.maxWidth = '500px';
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function confirmDialog(title, message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">${message}</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary btn-modal-cancel">Batal</button>
                    <button class="btn btn-danger btn-modal-confirm">Lanjutkan</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const cancelBtn = modal.querySelector('.btn-modal-cancel');
        const confirmBtn = modal.querySelector('.btn-modal-confirm');

        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });

        confirmBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
    });
}

// ==================================================================
// FORM HANDLERS
// ==================================================================

function handleAmountPreview(e) {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount > 0) {
        amountPreview.textContent = formatCurrency(amount);
    } else {
        amountPreview.textContent = '';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    formError.style.display = 'none';

    // Validasi
    const date = expenseDate.value.trim();
    const name = expenseName.value.trim();
    const category = expenseCategory.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const note = expenseNote.value.trim();

    if (!date) {
        showError('Tanggal wajib diisi.');
        return;
    }

    if (!name) {
        showError('Nama pengeluaran wajib diisi.');
        return;
    }

    if (!category) {
        showError('Kategori harus dipilih.');
        return;
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
        showError('Jumlah harus berupa angka lebih besar dari 0.');
        return;
    }

    if (editingId) {
        // UPDATE
        updateExpense(editingId, { date, name, category, amount, note });
        showSuccess('Pengeluaran berhasil diperbarui!');
    } else {
        // CREATE
        addExpense({ date, name, category, amount, note });
        showSuccess('Pengeluaran berhasil ditambahkan!');
    }

    resetForm();
    renderExpenses();
}

function handleCancel() {
    resetForm();
}

function handleResetFilter() {
    searchInput.value = '';
    categoryFilter.value = '';
    dateFromFilter.value = '';
    dateToFilter.value = '';
    minAmountFilter.value = '';
    maxAmountFilter.value = '';
    sortBy.value = 'terbaru';
    renderExpenses();
}

// ==================================================================
// FORM UTILITIES
// ==================================================================

function resetForm() {
    editingId = null;
    expenseForm.reset();
    const today = new Date().toISOString().split('T')[0];
    expenseDate.value = today;
    amountPreview.textContent = '';
    submitBtn.textContent = '+ Tambah Pengeluaran';
    submitBtn.style.display = '';
    cancelBtn.style.display = 'none';
    formError.style.display = 'none';
}

function fillFormForEdit(expense) {
    editingId = expense.id;
    expenseDate.value = expense.date;
    expenseName.value = expense.name;
    expenseCategory.value = expense.category;
    expenseAmount.value = expense.amount;
    amountPreview.textContent = formatCurrency(expense.amount);
    expenseNote.value = expense.note;
    submitBtn.textContent = '✓ Simpan Perubahan';
    cancelBtn.style.display = '';
    
    // Scroll ke form
    expenseForm.scrollIntoView({ behavior: 'smooth' });
}

// ==================================================================
// CRUD OPERATIONS
// ==================================================================

function addExpense(data) {
    const expense = {
        id: generateUniqueId(),
        date: data.date,
        name: data.name,
        category: data.category,
        amount: parseFloat(data.amount),
        note: data.note || '',
        createdAt: new Date().toISOString()
    };

    expenses.unshift(expense);
    saveExpenses();
}

function updateExpense(id, data) {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
        expense.date = data.date;
        expense.name = data.name;
        expense.category = data.category;
        expense.amount = parseFloat(data.amount);
        expense.note = data.note || '';
        saveExpenses();
    }
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
}

function loadExpenses() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            expenses = JSON.parse(data);
            // Validasi data
            if (!Array.isArray(expenses)) {
                expenses = [];
            }
        } else {
            expenses = [];
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        expenses = [];
    }
}

function saveExpenses() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
        showError('Gagal menyimpan data. Periksa ruang penyimpanan browser Anda.');
        console.error('Error saving expenses:', error);
    }
}

// ==================================================================
// FILTERING & SORTING
// ==================================================================

function getFilteredExpenses() {
    let filtered = [...expenses];

    // Search filter
    const search = searchInput.value.toLowerCase();
    if (search) {
        filtered = filtered.filter(e => 
            e.name.toLowerCase().includes(search) ||
            e.category.toLowerCase().includes(search) ||
            e.note.toLowerCase().includes(search)
        );
    }

    // Category filter
    const category = categoryFilter.value;
    if (category) {
        filtered = filtered.filter(e => e.category === category);
    }

    // Date range filter
    const dateFrom = dateFromFilter.value;
    const dateTo = dateToFilter.value;
    if (dateFrom) {
        filtered = filtered.filter(e => e.date >= dateFrom);
    }
    if (dateTo) {
        filtered = filtered.filter(e => e.date <= dateTo);
    }

    // Amount range filter
    const minAmount = minAmountFilter.value ? parseFloat(minAmountFilter.value) : null;
    const maxAmount = maxAmountFilter.value ? parseFloat(maxAmountFilter.value) : null;
    if (minAmount !== null) {
        filtered = filtered.filter(e => e.amount >= minAmount);
    }
    if (maxAmount !== null) {
        filtered = filtered.filter(e => e.amount <= maxAmount);
    }

    // Sorting
    const sort = sortBy.value;
    switch (sort) {
        case 'terbaru':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'terlama':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'terbesar':
            filtered.sort((a, b) => b.amount - a.amount);
            break;
        case 'terkecil':
            filtered.sort((a, b) => a.amount - b.amount);
            break;
        case 'nama-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nama-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    return filtered;
}

function calculateSummary(filteredExpenses) {
    if (filteredExpenses.length === 0) {
        return {
            total: 0,
            count: 0,
            max: 0,
            avg: 0
        };
    }

    const amounts = filteredExpenses.map(e => e.amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const count = filteredExpenses.length;
    const max = Math.max(...amounts);
    const avg = total / count;

    return { total, count, max, avg };
}

// ==================================================================
// RENDERING
// ==================================================================

function renderExpenses() {
    const filtered = getFilteredExpenses();
    const summary = calculateSummary(filtered);

    // Update summary cards
    totalExpense.textContent = formatCurrency(summary.total);
    transactionCount.textContent = summary.count;
    maxExpense.textContent = formatCurrency(summary.max);
    avgExpense.textContent = formatCurrency(summary.avg);

    // Render table
    if (filtered.length === 0) {
        tableContainer.innerHTML = `
            <div class="empty-state">
                <p>Belum ada pengeluaran.</p>
                <p>Tambahkan pengeluaran pertama Anda menggunakan form di atas.</p>
            </div>
        `;
        return;
    }

    let html = '<table class="expense-table"><thead><tr><th>Tanggal</th><th>Pengeluaran</th><th>Kategori</th><th>Jumlah</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody>';

    filtered.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        html += `
            <tr>
                <td>${date}</td>
                <td><strong>${expense.name}</strong></td>
                <td><span style="background-color: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${expense.category}</span></td>
                <td><strong>${formatCurrency(expense.amount)}</strong></td>
                <td>${expense.note || '-'}</td>
                <td>
                    <div class="table-actions-cell">
                        <button class="btn btn-edit btn-sm" onclick="handleEdit('${expense.id}')">✎ Edit</button>
                        <button class="btn btn-delete btn-sm" onclick="handleDelete('${expense.id}')">🗑️ Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

// ==================================================================
// TABLE ACTIONS
// ==================================================================

async function handleEdit(id) {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
        fillFormForEdit(expense);
    }
}

async function handleDelete(id) {
    const confirmed = await confirmDialog('Hapus Pengeluaran', 'Apakah Anda yakin ingin menghapus pengeluaran ini?');
    if (confirmed) {
        deleteExpense(id);
        showSuccess('Pengeluaran berhasil dihapus!');
        renderExpenses();
    }
}

// ==================================================================
// EXPORT EXCEL
// ==================================================================

function handleExportExcel() {
    const filtered = getFilteredExpenses();

    if (filtered.length === 0) {
        showError('Tidak ada data untuk diekspor.');
        return;
    }

    try {
        // Check if XLSX library is loaded
        if (typeof XLSX === 'undefined') {
            showError('Library Excel belum ter-load. Refresh halaman dan coba lagi.');
            console.error('XLSX library not loaded');
            return;
        }

        const summary = calculateSummary(filtered);

        // Prepare data sheet
        const dataSheet = filtered.map(e => ({
            'Tanggal': new Date(e.date).toLocaleDateString('id-ID'),
            'Pengeluaran': e.name,
            'Kategori': e.category,
            'Jumlah': e.amount,
            'Catatan': e.note || '-'
        }));

        // Prepare summary sheet
        const summarySheet = [
            { 'Keterangan': 'Total Pengeluaran (Rp)', 'Nilai': summary.total },
            { 'Keterangan': 'Jumlah Transaksi', 'Nilai': summary.count },
            { 'Keterangan': 'Rata-rata Pengeluaran (Rp)', 'Nilai': Math.round(summary.avg) },
            { 'Keterangan': 'Pengeluaran Terbesar (Rp)', 'Nilai': summary.max },
            { 'Keterangan': 'Tanggal Export', 'Nilai': new Date().toLocaleDateString('id-ID') },
            { 'Keterangan': 'Filter Aktif', 'Nilai': getActiveFiltersDescription() }
        ];

        // Create workbook
        const wb = XLSX.utils.book_new();
        const dataWs = XLSX.utils.json_to_sheet(dataSheet);
        const summaryWs = XLSX.utils.json_to_sheet(summarySheet);

        // Set column widths for Data sheet
        dataWs['!cols'] = [
            { wch: 15 },  // Tanggal
            { wch: 25 },  // Pengeluaran
            { wch: 15 },  // Kategori
            { wch: 15 },  // Jumlah
            { wch: 20 }   // Catatan
        ];

        // Set column widths for Summary sheet
        summaryWs['!cols'] = [
            { wch: 30 },  // Keterangan
            { wch: 20 }   // Nilai
        ];

        // Add sheets to workbook
        XLSX.utils.book_append_sheet(wb, dataWs, 'Data');
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan');

        // Generate filename
        const today = new Date().toISOString().split('T')[0];
        const filename = `pengeluaran-${today}.xlsx`;

        // Download file
        XLSX.writeFile(wb, filename);
        showSuccess(`File ${filename} berhasil diunduh!`);
    } catch (error) {
        console.error('Error exporting Excel:', error);
        showError(`Gagal mengekspor file Excel: ${error.message}`);
    }
}

function getActiveFiltersDescription() {
    const filters = [];
    
    if (searchInput.value) filters.push(`Cari: ${searchInput.value}`);
    if (categoryFilter.value) filters.push(`Kategori: ${categoryFilter.value}`);
    if (dateFromFilter.value) filters.push(`Dari: ${dateFromFilter.value}`);
    if (dateToFilter.value) filters.push(`Sampai: ${dateToFilter.value}`);
    if (minAmountFilter.value) filters.push(`Min: Rp${minAmountFilter.value}`);
    if (maxAmountFilter.value) filters.push(`Max: Rp${maxAmountFilter.value}`);
    
    return filters.length > 0 ? filters.join('; ') : 'Tidak ada filter';
}

// ==================================================================
// BACKUP & RESTORE
// ==================================================================

function handleBackup() {
    if (expenses.length === 0) {
        showError('Tidak ada data untuk di-backup.');
        return;
    }

    try {
        const dataStr = JSON.stringify(expenses, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        
        const today = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `pengeluaran-backup-${today}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showSuccess('Data berhasil di-backup!');
    } catch (error) {
        console.error('Error backup:', error);
        showError('Gagal membuat backup data.');
    }
}

async function handleRestore(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validasi data
        if (!Array.isArray(data)) {
            throw new Error('Format data tidak valid. Harus berupa array.');
        }

        // Validasi setiap item
        for (const item of data) {
            if (!item.id || !item.date || !item.name || !item.category || typeof item.amount !== 'number') {
                throw new Error('Data backup tidak lengkap atau tidak valid.');
            }
        }

        // Confirm restore
        const confirmed = await confirmDialog(
            'Restore Data',
            `Anda akan memulihkan ${data.length} transaksi dari backup. Data lama akan diganti. Lanjutkan?`
        );

        if (confirmed) {
            expenses = data;
            saveExpenses();
            resetForm();
            renderExpenses();
            showSuccess('Data berhasil dipulihkan!');
        }
    } catch (error) {
        console.error('Error restore:', error);
        showError(`Gagal memulihkan backup: ${error.message}`);
    }

    // Reset file input
    restoreFileInput.value = '';
}

// ==================================================================
// SAMPLE DATA
// ==================================================================

function handleFillSample() {
    const sampleData = [
        {
            id: generateUniqueId(),
            date: '2026-09-10',
            name: 'Makan siang',
            category: 'Makanan',
            amount: 35000,
            note: 'Nasi ayam di kantin',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-10',
            name: 'Bensin',
            category: 'Transportasi',
            amount: 50000,
            note: 'Isi bensin motor',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-09',
            name: 'Belanja groceries',
            category: 'Belanja',
            amount: 120000,
            note: 'Belanja kebutuhan dapur',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-09',
            name: 'Tagihan listrik',
            category: 'Tagihan',
            amount: 150000,
            note: 'Pembayaran tagihan bulanan',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-08',
            name: 'Tiket bioskop',
            category: 'Hiburan',
            amount: 60000,
            note: 'Nonton film baru',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-08',
            name: 'Obat-obatan',
            category: 'Kesehatan',
            amount: 85000,
            note: 'Beli obat di apotek',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-07',
            name: 'Buku pelajaran',
            category: 'Pendidikan',
            amount: 125000,
            note: 'Buku untuk kelas',
            createdAt: new Date().toISOString()
        },
        {
            id: generateUniqueId(),
            date: '2026-09-07',
            name: 'Kopi pagi',
            category: 'Makanan',
            amount: 25000,
            note: 'Kopi di café dekat rumah',
            createdAt: new Date().toISOString()
        }
    ];

    expenses = sampleData;
    saveExpenses();
    resetForm();
    renderExpenses();
    showSuccess('Data contoh berhasil ditambahkan!');
}

// ==================================================================
// DELETE ALL DATA
// ==================================================================

async function handleDeleteAll() {
    const confirmed = await confirmDialog(
        'PERINGATAN',
        'Semua data pengeluaran akan dihapus dari browser ini. Pastikan Anda sudah melakukan backup. Lanjutkan?'
    );

    if (confirmed) {
        expenses = [];
        saveExpenses();
        resetForm();
        renderExpenses();
        showSuccess('Semua data berhasil dihapus!');
    }
}

// ==================================================================
// START APPLICATION
// ==================================================================

document.addEventListener('DOMContentLoaded', initializeApp);
