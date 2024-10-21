// // prisma/seed.js
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     await prisma.user.create({
//         data: {
//             email: 'testextra@example.com',
//             name: 'Test User',
//             profilePicture: '',
//             about: 'This is a test user',
//         },
//     });
// }

// main()
//     .catch(e => console.error(e))
//     .finally(async () => {
//         await prisma.$disconnect();
//     });



//sending to render db and checking with pgAdmin
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create users
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            name: 'User One',
            profilePicture: '',
            about: 'This is User One',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            name: 'User Two',
            profilePicture: '',
            about: 'This is User Two',
        },
    });

    // Create messages
    await prisma.messages.create({
        data: {
            senderId: user1.id,
            receiverId: user2.id,
            type: 'text',
            message: 'Hello User Two!',
        },
    });

    await prisma.messages.create({
        data: {
            senderId: user2.id,
            receiverId: user1.id,
            type: 'text',
            message: 'Hello User One!',
        },
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });