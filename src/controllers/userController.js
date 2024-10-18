const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

/* POST /api/v1/users: menambahkan user
baru beserta dengan profilnya. */
const createUser = async (req, res) => {
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
}


/* 
GET /api/v1/users: menampilkan daftar
users. 
*/


const getUsers = async (req, res) => {
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
}

/* GET /api/v1/users/:userId: menampilkan
detail informasi user (tampilkan juga
profilnya). */

const getUserById = async (req, res) => {
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
        res.status(404).json({
            status: 404,
            message: 'User not found',
        });
    }
    res.status(200).json({
        status: 200,
        message: 'Berhasil Menampilkan Data User',
        data: user,
    });
}

module.exports = {
    createUser,
    getUsers,
    getUserById
};