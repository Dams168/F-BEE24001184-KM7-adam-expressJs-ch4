const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* 
POST /api/v1/transactions: mengirimkan
uang dari 1 akun ke akun lain (tentukan
request body nya). */
const createTransaction = async (req, res) => {
    const { source_account_id, destination_account_id, amount } = req.body;

    const sourceAccount = await prisma.bank_accounts.findUnique({
        where: {
            id: source_account_id,
        },
    });
    const dstAccount = await prisma.bank_accounts.findUnique({
        where: {
            id: destination_account_id,
        },
    });
    if (!sourceAccount || !dstAccount) {
        return res.status(404).json({
            message: 'Account not found',
        });
    }
    if (sourceAccount.balance < amount) {
        return res.status(400).json({
            message: 'Saldo Tidak Cukup',
        });
    }
    await prisma.bank_accounts.update({
        where: {
            id: sourceAccount.id,
        },
        data: {
            balance: {
                decrement: amount,
            },
        },
    });
    await prisma.bank_accounts.update({
        where: {
            id: dstAccount.id,
        },
        data: {
            balance: {
                increment: amount,
            },
        },
    });
    await prisma.transactions.create({
        data: {
            source_account_id: sourceAccount.id,
            destination_account_id: dstAccount.id,
            amount,
        },
    });
    res.status(201).json({
        message: 'Transaksi berhasil',
        data: {
            source_account_id: sourceAccount.id,
            destination_account_id: dstAccount.id,
            amount,
        },
    });
}


/* GET /api/v1/transactions: menampilkan
daftar transaksi. */

const getTransactions = async (req, res) => {
    const transactions = await prisma.transactions.findMany({
        orderBy: {
            id: 'asc',
        },
    });
    res.status(200).json({
        message: 'Berhasil menampilkan data transaksi',
        transactions
    });
}


/* GET /api/v1/transactions/:transaction:
menampilkan detail transaksi (tampilkan
juga pengirim dan penerimanya). */

const getTransactionById = async (req, res) => {
    const { transactionId } = req.params;
    const transaction = await prisma.transactions.findUnique({
        where: {
            id: Number(transactionId),
        },
    });
    if (!transaction) {
        return res.status(404).json({
            message: 'Transaction not found',
        });
    }
    res.status(200).json({
        message: 'Berhasil menampilkan detail transaksi',
        transaction
    });
}

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
};