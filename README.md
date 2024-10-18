# API Basic Banking System

Challenge 3 - Membuat REST API sederhana dengan Menggunakan expressJs dan PostgreSQL - MSIB (Binar Academy) - BACK END JAVASCRIPT - With AI Literacy & Global

## Teknologi Yang digunakan

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (Database)
- Bcrypt (Hashing Password)

## How To install

1. Clone this repository

```bash
  git clone https://github.com/Dams168/F-BEE24001184-KM7-adam-expressJs-ch4.git
```

2. Navigate to project directory

```bash
cd F-BEE24001184-KM7-adam-expressJs-ch4
```

3. Install dependencies

```bash
npm install
```

3. Setup Database

   Buat database baru di PostgreSQL dan sesuaikan dengan konfigurasi database di file `.env`. Contoh File `.env` :

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/nama-database?schema=public"
```

4. Migration Prisma

```bash
npx prisma migrate dev --name init
```

5. Run The Server

```bash
npm run start
```

## API DOCUMENTATION

- ` POST` `/api/v1/users ` : Untuk membuat user baru.
- `GET` `/api/v1/users` : Untuk menampilkan data user.
- `GET` `/api/v1/users/:userId` : Untuk menampilkan daetail user berdasarkan id.

- `POST` `/api/v1/accounts` : Untuk menambahkan akun baru ke user yang sudah didaftarkan.
- `GET` `/api/v1/accounts` : Untuk menampilkan daftar account.
- `GET` `/api/v1/accounts/:accountId` : Untuk menampilkan detail account berdasarkan id.

- `POST` `/api/v1/transactions` : mengirimkan uang dari 1 akun ke akun lain (tentukan request body nya).
- `GET` `/api/v1/transactions` : Untuk menampilkan daftar transaction.
- `GET` `/api/v1/transactions/:transactionId` : Untuk menampilkan detail transaction berdasarkan id.

## Database

![databases](assets/db.png)
