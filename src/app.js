const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/* POST /api/v1/users: menambahkan user
baru beserta dengan profilnya. */
app.post('/api/v1/users', async (req, res) => {
    const { name, email, password, identity_type, identity_number, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
        data: {
            email,
            name,
            password: hashedPassword,
            profile: {
                create: {
                    identity_type,
                    identity_number,
                    address
                }
            }
        },
        include: {
            profile: true
        }
    });
    res.status(201).json({
        status: 200,
        message: 'User created successfully',
        user: newUser
    });
});
/* 
GET /api/v1/users: menampilkan daftar
users. 
*/

app.get('/api/v1/users', async (req, res) => {
    const users = await prisma.users.findMany({
        orderBy: {
            id: 'asc',
        },
        include: {
            profile: true,
        },
    });
    res.status(200).json({
        message: 'Berhasil Menampilkan Data User',
        data: users,
    });
});

/* GET /api/v1/users/:userId: menampilkan
detail informasi user (tampilkan juga
profilnya). */

app.get('/api/v1/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await prisma.users.findUnique({
        where: {
            id: Number(userId),
        },
        include: {
            profile: true,
        },
    });
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    res.status(200).json(user);
});

/* POST /api/v1/accounts: menambahkan
akun baru ke user yang sudah
didaftarkan. */

app.post('/api/v1/accounts', async (req, res) => {
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
        message: 'Account created successfully',
        account: newAccount,
    });
});

/* 
GET /api/v1/accounts: menampilkan
daftar akun. */

app.get('/api/v1/accounts', async (req, res) => {
    const accounts = await prisma.bank_accounts.findMany({
        orderBy: {
            id: 'asc',
        },
    });
    res.status(200).json(accounts);
});

/* GET /api/v1/accounts: menampilkan
detail akun. */

app.get('/api/v1/accounts/:accountId', async (req, res) => {
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
    res.status(200).json(account);
});

/* 
POST /api/v1/transactions: mengirimkan
uang dari 1 akun ke akun lain (tentukan
request body nya). */

app.post('/api/v1/transactions', async (req, res) => {
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
    res.status(200).json({
        message: 'Transaction success',
        transaction: {
            source_account: sourceAccount,
            destination_account: dstAccount,
            amount,
        },
    });
});


/* GET /api/v1/transactions: menampilkan
daftar transaksi. */

app.get('/api/v1/transactions', async (req, res) => {
    const transactions = await prisma.transactions.findMany({
        orderBy: {
            id: 'asc',
        },
    });
    res.status(200).json(transactions);
});

/* GET /api/v1/transactions/:transaction:
menampilkan detail transaksi (tampilkan
juga pengirim dan penerimanya). */

app.get('/api/v1/transactions/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    const transaction = await prisma.transactions.findUnique({
        where: {
            id: Number(transactionId)
        },
        include: {
            sender: true,
            receiver: true
        }
    });
    if (!transaction) {
        return res.status(404).json({
            message: 'Transaction not found',
        });
    }
    res.status(200).json(transaction);
});
