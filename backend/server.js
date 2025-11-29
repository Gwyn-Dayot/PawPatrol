import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import auth from './routes/auth.js';

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('PAWdoption Backend is running');
});

app.use('/api/auth', auth);

import { protect } from './middleware/auth.js';
import { authorizeRoles } from './middleware/roles.js';

app.get('/api/admin/only', protect, authorizeRoles('admin'), (req, res) => {
    res.send({message: 'Welcome PAWdoption Admin!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));