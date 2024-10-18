const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/* POST /api/v1/accounts: menambahkan
akun baru ke user yang sudah
didaftarkan. */
const createAccount = async (req, res) => {
    const { user_id, bank_name, bank_account_number, balance } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    const newAccount = await prisma.bank_accounts.create({
        data: {
            user_id: user.id,
            bank_name,
            bank_account_number,
            balance,
        },
    });
    res.status(201).json({
        message: 'Akun berhasil dibuat',
        account: newAccount,
    });
}


/* 
GET /api/v1/accounts: menampilkan
daftar akun. */

const getAccounts = async (req, res) => {
    const accounts = await prisma.bank_accounts.findMany({
        orderBy: {
            id: 'asc',
        },
    });
    res.status(200).json({
        message: 'Berhasil menampilkan data akun',
        accounts
    });
}

/* GET /api/v1/accounts: menampilkan
detail akun. */
const getAccountById = async (req, res) => {
    const { accountId } = req.params;
    const account = await prisma.bank_accounts.findUnique({
        where: {
            id: Number(accountId),
        },
    });
    if (!account) {
        return res.status(404).json({
            message: 'Account not found',
        });
    }
    res.status(200).json({
        message: 'Berhasil menampilkan detail akun',
        account
    });
}

module.exports = {
    createAccount,
    getAccounts,
    getAccountById,
};