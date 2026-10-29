import { PrismaClient } from "@prisma/client";
const g = globalThis;
export default g.prisma || (g.prisma = new PrismaClient());
