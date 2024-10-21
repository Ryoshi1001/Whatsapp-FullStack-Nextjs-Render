// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            email: 'testextra@example.com',
            name: 'Test User',
            profilePicture: '',
            about: 'This is a test user',
        },
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });