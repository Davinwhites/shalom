const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding school settings...");

    const settings = await prisma.schoolSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Shalom Kindergarten & Primary School",
            logoUrl: "/logo.jpeg",
        },
    });

    console.log("Settings seeded:", settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
