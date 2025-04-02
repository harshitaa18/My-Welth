const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function keepDatabaseAlive() {
    try {
        await prisma.$queryRaw`SELECT 1`;  // Simple query to keep the database awake
        console.log("Database is active");
    } catch (error) {
        console.error("Error keeping database alive:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run every 5 minutes
setInterval(keepDatabaseAlive, 5 * 60 * 1000);
