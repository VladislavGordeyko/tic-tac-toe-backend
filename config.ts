import dotenv from 'dotenv';

dotenv.config();

export const botOptions = {
    polling: true
};

type Env = {
    TOKEN: string;
    PORT: number;
    URL: string;
};

export const env: Env = {
    TOKEN: process.env.TOKEN!,
    PORT: Number(process.env.PORT!),
    URL: process.env.URL!,
};

