const { PrismaClient } = require("@prisma/client");
const { barang, perawatan } = require("./data");
const prisma = new PrismaClient();
(async () => {
  await prisma.perawatan.deleteMany();
  await prisma.barang.deleteMany();
  await prisma.barang.createMany({ data: barang });
  const rows = await prisma.barang.findMany({ select: { id: true, kode: true } });
  const id = Object.fromEntries(rows.map((r) => [r.kode, r.id]));
  await prisma.perawatan.createMany({ data: perawatan.map(({ kode, ...p }) => ({ ...p, barangId: id[kode] })) });
  console.log(`Seed selesai: ${barang.length} barang, ${perawatan.length} perawatan`);
})().finally(() => prisma.$disconnect());
