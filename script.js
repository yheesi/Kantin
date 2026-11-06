
// =====================================
// KANTINKU - SISTEM KANTIN KAMPUS
// =====================================

// Data awal menu
const menuAwal = [
    {
        id: 1,
        nama: "Nasi Ayam Geprek",
        stand: "Stand Bu Sari",
        harga: 15000,
        stok: 20,
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600"
    },
    {
        id: 2,
        nama: "Mie Ayam",
        stand: "Stand Pak Budi",
        harga: 12000,
        stok: 15,
        gambar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600"
    },
    {
        id: 3,
        nama: "Nasi Goreng",
        stand: "Stand Bu Sari",
        harga: 13000,
        stok: 18,
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600"
    },
    {
        id: 4,
        nama: "Es Teh",
        stand: "Stand Minuman",
        harga: 5000,
        stok: 30,
        gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600"
    },
    {
        id: 5,
        nama: "Kentang Goreng",
        stand: "Stand Camilan",
        harga: 10000,
        stok: 12,
        gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600"
    },
    {
        id: 6,
        nama: "Bakso",
        stand: "Stand Pak Budi",
        harga: 12000,
        stok: 14,
        gambar: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600"
    }
];

// Mengambil data dari Local Storage
let menu = JSON.parse(localStorage.getItem("kantinku_menu")) || menuAwal;
let pesanan = JSON.parse(localStorage.getItem("kantinku_pesanan")) || [];
let retur = JSON.parse(localStorage.getItem("kantinku_retur")) || [];
let keranjang = [];

// Menyimpan data
function simpanData() {
    localStorage.setItem("kantinku_menu", JSON.stringify(menu));
    localStorage.setItem("kantinku_pesanan", JSON.stringify(pesanan));
    localStorage.setItem("kantinku_retur", JSON.stringify(retur));
}

// Format rupiah
function rupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
}

// Menampilkan notifikasi
function notifikasi(pesan) {
    const toast = document.getElementById("toast");
    toast.textContent = pesan;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// =====================================
// TAMPILAN MENU PELANGGAN
// =====================================

function tampilkanMenu(kataKunci = "", standDipilih = "Semua") {
    const tempat = document.getElementById("customer-menu");

    const hasil = menu.filter(item => {
        const cocokNama = item.nama.toLowerCase().includes(kataKunci.toLowerCase());
        const cocokStand = standDipilih === "Semua" || item.stand === standDipilih;

        return cocokNama && cocokStand;
    });

    tempat.innerHTML = "";

    if (hasil.length === 0) {
        tempat.innerHTML = "<p>Menu tidak ditemukan.</p>";
        return;
    }

    hasil.forEach(item => {
        tempat.innerHTML += `
            <div class="menu-card">
                <img src="${item.gambar || 'https://placehold.co/600x400?text=Menu+Kantin'}"
                     alt="${item.nama}"
                     onerror="this.src='https://placehold.co/600x400?text=Menu+Kantin'">

                <div class="menu-card-content">
                    <h3>${item.nama}</h3>
                    <p>${item.stand}</p>
                    <p>Stok tersedia: ${item.stok}</p>
                    <div class="harga">${rupiah(item.harga)}</div>

                    <button class="btn-primary"
                        onclick="tambahKeranjang(${item.id})"
                        ${item.stok <= 0 ? "disabled" : ""}>
                        ${item.stok <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                    </button>
                </div>
            </div>
        `;
    });
}

// Filter stand
function tampilkanFilterStand() {
    const tempat = document.getElementById("stand-filters");
    const daftarStand = ["Semua", ...new Set(menu.map(item => item.stand))];

    tempat.innerHTML = "";

    daftarStand.forEach(stand => {
        const tombol = document.createElement("button");
        tombol.textContent = stand;

        if (stand === "Semua") {
            tombol.classList.add("active");
        }

        tombol.addEventListener("click", () => {
            document.querySelectorAll("#stand-filters button")
                .forEach(btn => btn.classList.remove("active"));

            tombol.classList.add("active");

            const kataKunci = document.getElementById("search-menu").value;
            tampilkanMenu(kataKunci, stand);
        });

        tempat.appendChild(tombol);
    });
}

// Pencarian menu
document.getElementById("search-menu").addEventListener("input", function () {
    const standAktif = document.querySelector("#stand-filters button.active");
    const stand = standAktif ? standAktif.textContent : "Semua";

    tampilkanMenu(this.value, stand);
});

// =====================================
// KERANJANG BELANJA
// =====================================

function tambahKeranjang(id) {
    const item = menu.find(m => m.id === id);

    if (!item || item.stok <= 0) {
        notifikasi("Stok menu habis!");
        return;
    }

    const sudahAda = keranjang.find(k => k.id === id);

    if (sudahAda) {
        if (sudahAda.jumlah >= item.stok) {
            notifikasi("Jumlah melebihi stok!");
            return;
        }

        sudahAda.jumlah++;
    } else {
        keranjang.push({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: 1
        });
    }

    tampilkanKeranjang();
    notifikasi("Menu berhasil ditambahkan!");
}

function tampilkanKeranjang() {
    const tempat = document.getElementById("cart-items");
    const jumlah = keranjang.reduce((total, item) => total + item.jumlah, 0);

    document.getElementById("cart-count").textContent = jumlah;

    tempat.innerHTML = "";

    if (keranjang.length === 0) {
        tempat.innerHTML = "<p>Keranjang masih kosong.</p>";
    }

    keranjang.forEach(item => {
        tempat.innerHTML += `
            <div class="cart-item">
                <strong>${item.nama}</strong>
                <p>${rupiah(item.harga)} x ${item.jumlah}</p>

                <button onclick="ubahJumlah(${item.id}, -1)">−</button>
                <span>${item.jumlah}</span>
                <button onclick="ubahJumlah(${item.id}, 1)">+</button>
                <button onclick="hapusKeranjang(${item.id})">Hapus</button>
            </div>
        `;
    });

    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah, 0
    );

    document.getElementById("cart-total").textContent = rupiah(total);
}

function ubahJumlah(id, perubahan) {
    const itemKeranjang = keranjang.find(k => k.id === id);
    const itemMenu = menu.find(m => m.id === id);

    if (!itemKeranjang || !itemMenu) return;

    const jumlahBaru = itemKeranjang.jumlah + perubahan;

    if (jumlahBaru > itemMenu.stok) {
        notifikasi("Jumlah melebihi stok!");
        return;
    }

    if (jumlahBaru <= 0) {
        hapusKeranjang(id);
        return;
    }

    itemKeranjang.jumlah = jumlahBaru;
    tampilkanKeranjang();
}

function hapusKeranjang(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    tampilkanKeranjang();
}

// Membuka dan menutup keranjang
document.getElementById("cart-shortcut").addEventListener("click", bukaKeranjang);
document.getElementById("close-cart").addEventListener("click", tutupKeranjang);
document.getElementById("cart-backdrop").addEventListener("click", tutupKeranjang);

function bukaKeranjang() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("cart-backdrop").classList.add("show");
}

function tutupKeranjang() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("cart-backdrop").classList.remove("show");
}

// =====================================
// CHECKOUT / PEMESANAN
// =====================================

document.getElementById("checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();

    if (keranjang.length === 0) {
        notifikasi("Keranjang masih kosong!");
        return;
    }

    const nama = document.getElementById("customer-name").value.trim();

    if (!nama) {
        notifikasi("Masukkan nama pemesan!");
        return;
    }

    // Periksa kembali stok sebelum checkout
    for (const item of keranjang) {
        const dataMenu = menu.find(m => m.id === item.id);

        if (!dataMenu || dataMenu.stok < item.jumlah) {
            notifikasi("Stok salah satu menu tidak mencukupi!");
            return;
        }
    }

    const detail = keranjang.map(item => ({
        ...item
    }));

    const total = detail.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah, 0
    );

    // Kurangi stok
    detail.forEach(item => {
        const dataMenu = menu.find(m => m.id === item.id);
        dataMenu.stok -= item.jumlah;
    });

    const pesananBaru = {
        id: Date.now(),
        nama: nama,
        detail: detail,
        total: total,
        status: "Menunggu",
        tanggal: new Date().toLocaleString("id-ID")
    };

    pesanan.push(pesananBaru);

    keranjang = [];

    simpanData();
    tampilkanSemua();

    this.reset();
    tutupKeranjang();

    notifikasi("Pesanan berhasil dibuat!");
});

// =====================================
// RIWAYAT PESANAN PELANGGAN
// =====================================

document.getElementById("lookup-orders").addEventListener("click", function () {
    const nama = document.getElementById("lookup-name").value.trim();

    if (!nama) {
        notifikasi("Masukkan nama pemesan terlebih dahulu!");
        return;
    }

    const hasil = pesanan.filter(
        item => item.nama.toLowerCase() === nama.toLowerCase()
    );

    const tempat = document.getElementById("customer-orders");
    tempat.innerHTML = "";

    if (hasil.length === 0) {
        tempat.innerHTML = "<p>Pesanan tidak ditemukan.</p>";
        return;
    }

    hasil.forEach(item => {
        const daftarMenu = item.detail.map(menu =>
            `${menu.nama} (${menu.jumlah}x)`
        ).join(", ");

        tempat.innerHTML += `
            <div class="panel">
                <h3>Pesanan #${item.id}</h3>
                <p>Tanggal: ${item.tanggal}</p>
                <p>Menu: ${daftarMenu}</p>
                <p>Total: ${rupiah(item.total)}</p>
                <p>Status: <strong>${item.status}</strong></p>

                ${item.status === "Menunggu" || item.status === "Diproses"
                    ? `<button class="btn-delete" onclick="batalkanPesanan(${item.id})">
                        Batalkan Pesanan
                       </button>`
                    : ""}

                ${item.status === "Selesai"
                    ? `<button class="btn-edit" onclick="ajukanRetur(${item.id})">
                        Ajukan Retur
                       </button>`
                    : ""}
            </div>
        `;
    });
});

// =====================================
// PEMBATALAN PESANAN
// =====================================

function batalkanPesanan(id) {
    const item = pesanan.find(p => p.id === id);

    if (!item) return;

    if (item.status !== "Menunggu" && item.status !== "Diproses") {
        notifikasi("Pesanan tidak dapat dibatalkan!");
        return;
    }

    const yakin = confirm("Yakin ingin membatalkan pesanan ini?");

    if (!yakin) return;

    item.detail.forEach(menuPesanan => {
        const dataMenu = menu.find(m => m.id === menuPesanan.id);

        if (dataMenu) {
            dataMenu.stok += menuPesanan.jumlah;
        }
    });

    item.status = "Dibatalkan";

    simpanData();
    tampilkanSemua();

    notifikasi("Pesanan berhasil dibatalkan!");
}

// =====================================
// PENGAJUAN RETUR
// =====================================

function ajukanRetur(id) {
    const item = pesanan.find(p => p.id === id);

    if (!item || item.status !== "Selesai") {
        notifikasi("Pesanan belum dapat diretur!");
        return;
    }

    const alasan = prompt("Tuliskan alasan pengajuan retur:");

    if (!alasan || alasan.trim() === "") {
        notifikasi("Alasan retur harus diisi!");
        return;
    }

    retur.push({
        id: Date.now(),
        pesananId: item.id,
        nama: item.nama,
        alasan: alasan.trim(),
        status: "Menunggu"
    });

    item.status = "Retur Diajukan";

    simpanData();
    tampilkanSemua();

    notifikasi("Pengajuan retur berhasil dikirim!");
}

// =====================================
// ADMIN - KELOLA MENU
// =====================================

document.getElementById("menu-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("edit-menu-id").value;
    const nama = document.getElementById("menu-name").value.trim();
    const stand = document.getElementById("menu-stand").value.trim();
    const harga = Number(document.getElementById("menu-price").value);
    const stok = Number(document.getElementById("menu-stock").value);
    const gambar = document.getElementById("menu-image").value.trim();

    if (!nama || !stand || harga <= 0 || stok < 0) {
        notifikasi("Periksa kembali data menu!");
        return;
    }

    if (id) {
        const item = menu.find(m => m.id === Number(id));

        if (item) {
            item.nama = nama;
            item.stand = stand;
            item.harga = harga;
            item.stok = stok;
            item.gambar = gambar || item.gambar;
        }

        notifikasi("Menu berhasil diperbarui!");
    } else {
        menu.push({
            id: Date.now(),
            nama,
            stand,
            harga,
            stok,
            gambar: gambar || "https://placehold.co/600x400?text=Menu+Kantin"
        });

        notifikasi("Menu berhasil ditambahkan!");
    }

    this.reset();
    document.getElementById("edit-menu-id").value = "";
    document.getElementById("save-menu-btn").textContent = "Simpan Menu";

    simpanData();
    tampilkanSemua();
});

// Membatalkan proses edit
document.getElementById("cancel-edit").addEventListener("click", function () {
    document.getElementById("menu-form").reset();
    document.getElementById("edit-menu-id").value = "";
    document.getElementById("save-menu-btn").textContent = "Simpan Menu";
});

// Menampilkan daftar menu admin
function tampilkanMenuAdmin(kataKunci = "") {
    const tempat = document.getElementById("admin-menu-table");

    const hasil = menu.filter(item =>
        item.nama.toLowerCase().includes(kataKunci.toLowerCase())
    );

    tempat.innerHTML = "";

    hasil.forEach(item => {
        tempat.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.stand}</td>
                <td>${rupiah(item.harga)}</td>
                <td>${item.stok}</td>
                <td>
                    <button class="btn-edit" onclick="editMenu(${item.id})">Edit</button>
                    <button class="btn-delete" onclick="hapusMenu(${item.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// Edit menu
function editMenu(id) {
    const item = menu.find(m => m.id === id);

    if (!item) return;

    document.getElementById("edit-menu-id").value = item.id;
    document.getElementById("menu-name").value = item.nama;
    document.getElementById("menu-stand").value = item.stand;
    document.getElementById("menu-price").value = item.harga;
    document.getElementById("menu-stock").value = item.stok;
    document.getElementById("menu-image").value = item.gambar || "";

    document.getElementById("save-menu-btn").textContent = "Perbarui Menu";

    document.getElementById("menu-form").scrollIntoView({
        behavior: "smooth"
    });
}

// Hapus menu
function hapusMenu(id) {
    const yakin = confirm("Yakin ingin menghapus menu ini?");

    if (!yakin) return;

    menu = menu.filter(item => item.id !== id);

    simpanData();
    tampilkanSemua();

    notifikasi("Menu berhasil dihapus!");
}

// Pencarian menu admin
document.getElementById("admin-menu-search").addEventListener("input", function () {
    tampilkanMenuAdmin(this.value);
});

// =====================================
// ADMIN - KELOLA PESANAN
// =====================================

function tampilkanPesananAdmin() {
    const tempat = document.getElementById("admin-order-table");

    tempat.innerHTML = "";

    pesanan.forEach(item => {
        tempat.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.detail.map(m => `${m.nama} (${m.jumlah}x)`).join(", ")}</td>
                <td>${rupiah(item.total)}</td>
                <td>${item.status}</td>
                <td>
                    <select onchange="ubahStatusPesanan(${item.id}, this.value)">
                        <option value="">Ubah Status</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

function ubahStatusPesanan(id, statusBaru) {
    if (!statusBaru) return;

    const item = pesanan.find(p => p.id === id);

    if (!item) return;

    if (item.status === "Dibatalkan" || item.status === "Retur Diajukan") {
        notifikasi("Status pesanan ini tidak dapat diubah!");
        tampilkanPesananAdmin();
        return;
    }

    item.status = statusBaru;

    simpanData();
    tampilkanSemua();

    notifikasi("Status pesanan berhasil diperbarui!");
}

// =====================================
// ADMIN - KELOLA RETUR
// =====================================

function tampilkanReturAdmin() {
    const tempat = document.getElementById("admin-return-table");

    tempat.innerHTML = "";

    retur.forEach(item => {
        tempat.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>#${item.pesananId}</td>
                <td>${item.alasan}</td>
                <td>${item.status}</td>
                <td>
                    ${item.status === "Menunggu" ? `
                        <button class="btn-edit" onclick="prosesRetur(${item.id}, 'Disetujui')">
                            Setujui
                        </button>
                        <button class="btn-delete" onclick="prosesRetur(${item.id}, 'Ditolak')">
                            Tolak
                        </button>
                    ` : "-"}
                </td>
            </tr>
        `;
    });
}

function prosesRetur(id, keputusan) {
    const item = retur.find(r => r.id === id);

    if (!item || item.status !== "Menunggu") return;

    item.status = keputusan;

    if (keputusan === "Disetujui") {
        const pesananTerkait = pesanan.find(p => p.id === item.pesananId);

        if (pesananTerkait) {
            pesananTerkait.status = "Retur Disetujui";
        }
    } else {
        const pesananTerkait = pesanan.find(p => p.id === item.pesananId);

        if (pesananTerkait) {
            pesananTerkait.status = "Selesai";
        }
    }

    simpanData();
    tampilkanSemua();

    notifikasi("Pengajuan retur berhasil diproses!");
}

// =====================================
// NAVIGASI ADMIN
// =====================================

document.querySelectorAll("[data-admin-tab]").forEach(tombol => {
    tombol.addEventListener("click", function () {
        document.querySelectorAll("[data-admin-tab]")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".admin-panel")
            .forEach(panel => panel.classList.remove("active"));

        this.classList.add("active");

        const panelTujuan = document.getElementById(
            this.dataset.adminTab
        );

        if (panelTujuan) {
            panelTujuan.classList.add("active");
        }
    });
});

// =====================================
// MEMPERBARUI SELURUH TAMPILAN
// =====================================

function tampilkanSemua() {
    tampilkanFilterStand();
    tampilkanMenu();
    tampilkanKeranjang();
    tampilkanMenuAdmin(
        document.getElementById("admin-menu-search").value
    );
    tampilkanPesananAdmin();
    tampilkanReturAdmin();
}

// Jalankan saat website dibuka
document.addEventListener("DOMContentLoaded", function () {
    simpanData();
    tampilkanSemua();
});
