import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import dotenv from 'dotenv';
import routes from './routes/routes.js';


dotenv.config();
const app = express();

// middleware 
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api',routes);

//cron exmaples 
cron.schedule('0 0 * * *', () => {
    console.log('cron job running every min');
    });

    // start server 

    const PORT = process.env.PORT || 3000;
    app.listen(PORT,()=>{
        console.log('server is running on port ${PORT}');
    });