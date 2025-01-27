import express from 'express';
import cors from 'cors';
import {TatumSDK, Network, Ethereum} from '@tatumio/tatum';
import * as dotenv from 'dotenv';
import {pino, type Logger} from 'pino'

export const logger: Logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    level: process.env.LOG_LEVEL || 'info',
    redact: [],
});

dotenv.config();

const app = express();
const port = process.env.PORT;

const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

const tatum = await TatumSDK.init<Ethereum>({
    network: Network.ETHEREUM,
    apiKey: { v4: process.env.TATUM_API_KEY || '' },
    verbose: true,
});

app.get('/api/eth-balance', async (req, res) => {
    const address = req.query.address;

    if (!address) {
        logger.warn('Request missing address field');
        return res.status(400).json({
            data: null,
            status: 'ERROR',
            error: {
                message: ['Address is required'],
                code: 'validation.failed',
                dashboardLog: null,
            },
        });
    }

    try {
        const balance = await tatum.address.getBalance({
            addresses: [address as any],
        });

        const balanceData = balance.data.find(
            (asset) => asset.asset === 'ETH'
        );

        if (!balanceData) {
            logger.info(`No ETH balance found for address: ${address}`);
            return res.status(404).json({
                data: null,
                status: 'ERROR',
                error: {
                    message: ['No ETH balance found for the provided address'],
                    code: 'balance.not_found',
                    dashboardLog: null,
                },
            });
        }

        logger.info(`ETH balance retrieved for address: ${address}`);
        return res.json({
            data: balanceData.balance,
            status: 'SUCCESS',
        });
    } catch (error: any) {
        logger.error('Error fetching balance:', error);

        const errorMessage = error.response?.data || {
            message: ['An unexpected error occurred'],
            code: 'internal.server_error',
            dashboardLog: null,
        };

        res.status(500).json({
            data: null,
            status: 'ERROR',
            error: errorMessage,
        });
    }
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
