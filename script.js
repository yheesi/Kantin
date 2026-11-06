
// =====================================
// 1. MENYIMPAN DATA
// =====================================

let daftarMenu = JSON.parse(localStorage.getItem("daftarMenu")) || [];

let daftarPesanan = JSON.parse(localStorage.getItem("daftarPesanan")) || [
    {
        id: 1,
        pelanggan: "Andi",
        menu: "Nasi Goreng",
        jumlah: 1,
        status: "Menunggu"
    },
    {
        id: 2,
        pelanggan: "Sinta",
        menu: "Es Teh",
        jumlah: 2,
        status: "Diproses"
    }
];

// =====================================
// 2. MENYIMPAN DATA KE LOCAL STORAGE
// =====================================

function simpanData() {
    localStorage.setItem("daftarMenu", JSON.stringify(daftarMenu));
    localStorage.setItem("daftarPesanan", JSON.stringify(daftarPesanan));
}

// =====================================
// 3. MENAMPILKAN DAFTAR MENU
// =====================================

function tampilkanMenu() {
    const daftar = document.getElementById("daftar-menu");
    daftar.innerHTML = "";

    daftarMenu.forEach((menu, index) => {
        const baris = document.createElement("tr");

        const nama = document.createElement("td");
        nama.textContent = menu.nama;

        const harga = document.createElement("td");
        harga.textContent = "Rp " + Number(menu.harga).toLocaleString("id-ID");

        const stok = document.createElement("td");
        stok.textContent = menu.stok;

        const aksi = document.createElement("td");

        const tombolEdit = document.createElement("button");
        tombolEdit.textContent = "Edit";
        tombolEdit.type = "button";
        tombolEdit.addEventListener("click", () => editMenu(index));

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.type = "button";
        tombolHapus.style.marginLeft = "5px";
        tombolHapus.addEventListener("click", () => hapusMenu(index));

        aksi.append(tombolEdit, tombolHapus);
        baris.append(nama, harga, stok, aksi);
        daftar.appendChild(baris);
    });

    updateDashboard();
}

// =====================================
// 4. MENAMBAHKAN MENU
// =====================================

document.getElementById("form-menu").addEventListener("submit", function(event) {
    event.preventDefault();

    const nama = document.getElementById("nama-menu").value.trim();
    const harga = Number(document.getElementById("harga-menu").value);
    const stok = Number(document.getElementById("stok-menu").value);

    if (!nama || harga <= 0 || stok < 0 ||
        !Number.isInteger(harga) || !Number.isInteger(stok)) {
        alert("Silakan masukkan data menu dengan benar!");
        return;
    }

    daftarMenu.push({
        nama: nama,
        harga: harga,
        stok: stok
    });

    simpanData();
    tampilkanMenu();

    this.reset();

    alert("Menu berhasil ditambahkan!");
});

// =====================================
// 5. MENGEDIT MENU
// =====================================

function editMenu(index) {
    const menu = daftarMenu[index];

    const namaBaru = prompt("Masukkan nama menu baru:", menu.nama);

    if (namaBaru === null || namaBaru.trim() === "") {
        return;
    }

    const hargaBaru = prompt("Masukkan harga baru:", menu.harga);

    if (hargaBaru === null) return;

    const stokBaru = prompt("Masukkan stok baru:", menu.stok);

    if (stokBaru === null) return;

    const harga = Number(hargaBaru);
    const stok = Number(stokBaru);

    if (!Number.isInteger(harga) || harga <= 0 ||
        !Number.isInteger(stok) || stok < 0) {
        alert("Harga atau stok tidak valid!");
        return;
    }

    daftarMenu[index] = {
        nama: namaBaru.trim(),
        harga: harga,
        stok: stok
    };

    simpanData();
    tampilkanMenu();

    alert("Menu berhasil diperbarui!");
}

// =====================================
// 6. MENGHAPUS MENU
// =====================================

function hapusMenu(index) {
    const konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus menu ini?"
    );

    if (konfirmasi) {
        daftarMenu.splice(index, 1);

        simpanData();
        tampilkanMenu();

        alert("Menu berhasil dihapus!");
    }
}

// =====================================
// 7. MENAMPILKAN DAFTAR PESANAN
// =====================================

function tampilkanPesanan() {
    const daftar = document.getElementById("daftar-pesanan");
    daftar.innerHTML = "";

    daftarPesanan.forEach((pesanan) => {
        const baris = document.createElement("tr");

        const pelanggan = document.createElement("td");
        pelanggan.textContent = pesanan.pelanggan;

        const menu = document.createElement("td");
        menu.textContent = pesanan.menu;

        const jumlah = document.createElement("td");
        jumlah.textContent = pesanan.jumlah;

        const status = document.createElement("td");

        const pilihanStatus = document.createElement("select");

        ["Menunggu", "Diproses", "Selesai"].forEach((pilihan) => {
            const option = document.createElement("option");
            option.value = pilihan;
            option.textContent = pilihan;
            pilihanStatus.appendChild(option);
        });

        pilihanStatus.value = pesanan.status;

        pilihanStatus.addEventListener("change", function() {
            pesanan.status = this.value;
            simpanData();
            updateDashboard();
        });

        status.appendChild(pilihanStatus);

        baris.append(pelanggan, menu, jumlah, status);
        daftar.appendChild(baris);
    });

    updateDashboard();
}

// =====================================
// 8. MEMPERBARUI DASHBOARD
// =====================================

function updateDashboard() {
    document.getElementById("total-menu").textContent =
        daftarMenu.length;

    document.getElementById("total-pesanan").textContent =
        daftarPesanan.length;

    document.getElementById("pesanan-selesai").textContent =
        daftarPesanan.filter(p => p.status === "Selesai").length;
}

// =====================================
// 9. MENJALANKAN WEBSITE
// =====================================

simpanData();
tampilkanMenu();
tampilkanPesanan();
