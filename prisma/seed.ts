import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const customerAccount = await prisma.account.create({
        data: {
            fullName: "Customer",
            document: "12345678912",
            email: "customer@email.com",
            password: "customerpass",
            userType: "CUSTOMER"
        }
    });
    const customerWallet = await prisma.wallet.create({
        data: {
            accountId: customerAccount.id
        }
    })

    const merchantAccount = await prisma.account.create({
        data: {
            fullName: "Merchant",
            document: "21987654321",
            email: "merchant@email.com",
            password: "merchantpass",
            userType: "MERCHANT"
        }
    });
    const merchantWallet = await prisma.wallet.create({
        data: {
            accountId: merchantAccount.id
        }
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })