-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'MERCHANT');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_type" "UserType" NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "ammount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payer_id" INTEGER NOT NULL,
    "payee_id" INTEGER NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_history" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "details" JSONB,

    CONSTRAINT "transaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_document_email_key" ON "accounts"("document", "email");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_account_id_key" ON "wallets"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_transaction_id_key" ON "transaction_history"("transaction_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payer_id_fkey" FOREIGN KEY ("payer_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payee_id_fkey" FOREIGN KEY ("payee_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
