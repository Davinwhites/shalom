const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Update Admin
    await prisma.admin.upsert({
        where: { id: 1 },
        update: { username: 'shalom', password: '9484' },
        create: { id: 1, username: 'shalom', password: '9484' },
    });

    // Update HomePage
    await prisma.homePage.upsert({
        where: { id: 1 },
        update: {
            heroTitle: 'Shalom Kindergarten & Primary School',
            heroSub: 'Nurturing Excellence, Inspiring Futures.',
            aboutShort: 'Founded on the principles of love and integrity, we provide a holistic education that prepares children for a lifetime of success.',
        },
        create: {
            id: 1,
            heroTitle: 'Shalom Kindergarten & Primary School',
            heroSub: 'Nurturing Excellence, Inspiring Futures.',
            aboutShort: 'Founded on the principles of love and integrity, we provide a holistic education that prepares children for a lifetime of success.',
        },
    });

    // Update AboutPage
    await prisma.aboutPage.upsert({
        where: { id: 1 },
        update: {
            bio: 'Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners.',
            mission: 'To empower every child with the knowledge, skills, and values they need to thrive in a changing world.',
            experience: 'Years of dedicated service in nurturing young minds and fostering academic excellence.',
        },
        create: {
            id: 1,
            bio: 'Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners.',
            mission: 'To empower every child with the knowledge, skills, and values they need to thrive in a changing world.',
            experience: 'Years of dedicated service in nurturing young minds and fostering academic excellence.',
        },
    });

    // Update ContactInfo
    await prisma.contactInfo.upsert({
        where: { id: 1 },
        update: {
            email: 'info@shalomschool.com',
            phone: '+123 456 7890',
            address: 'Shalom Campus, Education St, City',
        },
        create: {
            id: 1,
            email: 'info@shalomschool.com',
            phone: '+123 456 7890',
            address: 'Shalom Campus, Education St, City',
        },
    });

    console.log('Database updated successfully for Shalom School');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
