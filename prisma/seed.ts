import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);  // เข้ารหัส password
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin account created');
  } else {
    console.log('Admin account already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
