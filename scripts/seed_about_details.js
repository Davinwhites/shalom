const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding staff and environment...");

    // Seed Staff
    const staff = [
        { name: "Director One", title: "Managing Director", phone: "+123 456 7891", order: 1 },
        { name: "Director Two", title: "Executive Director", phone: "+123 456 7892", order: 2 },
        { name: "Head Teacher", title: "Academic Head", phone: "+123 456 7893", order: 3 },
        { name: "Deputy Head", title: "Operations Head", phone: "+123 456 7894", order: 4 },
    ];

    for (const member of staff) {
        await prisma.staffMember.create({ data: member });
    }

    // Seed Environment/Facilities
    const env = [
        { title: "Primary Building", subLabel: "Campus Infrastructure", description: "Modern, safe, and spacious school blocks built to inspire learning.", icon: "🏫", order: 1 },
        { title: "Vibrant Classes", subLabel: "Learning Spaces", description: "Interactive classrooms designed for creativity and engagement.", icon: "🎨", order: 2 },
        { title: "Active Learning", subLabel: "Holistic Growth", description: "Safe spaces where students explore, play, and grow every day.", icon: "🌟", order: 3 },
    ];

    for (const item of env) {
        await prisma.schoolEnvironment.create({ data: item });
    }

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
