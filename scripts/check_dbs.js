const { PrismaClient } = require('@prisma/client');

async function checkDb(url, label) {
    console.log(`Checking ${label} (${url})...`);
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });
    try {
        const home = await prisma.homePage.findUnique({ where: { id: 1 } });
        console.log(`${label} heroTitle:`, home ? home.heroTitle : 'NOT FOUND');
    } catch (e) {
        console.log(`${label} Error:`, e.message);
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    await checkDb('file:./dev.db', 'ROOT_DB');
    await checkDb('file:./prisma/dev.db', 'PRISMA_DIR_DB');
}

main();
