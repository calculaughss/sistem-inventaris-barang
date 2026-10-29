-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "kondisi" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "sumberDana" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perawatan" (
    "id" SERIAL NOT NULL,
    "barangId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jenis" TEXT NOT NULL,
    "biaya" INTEGER NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Perawatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_key" ON "Barang"("kode");

-- AddForeignKey
ALTER TABLE "Perawatan" ADD CONSTRAINT "Perawatan_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
