const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');


app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', bankAccountRoutes);
app.use('/api/v1', transactionRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

