import { PrismaClient } from "@prisma/client"

if (!global.__prisma) {
  global.__prisma = new PrismaClient()
}
global.__prisma.$connect()
const db = global.__prisma

export default db