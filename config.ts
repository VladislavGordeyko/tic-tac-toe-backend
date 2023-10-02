import dotenv from 'dotenv';

dotenv.config();

export const botOptions = {
    polling: false,
};

type Env = {
    TOKEN: string,
    PORT: number,
    URL: string,
    WEBHOOK: string,
    WEBAPPURL: string,
    WEBAPPURLTELEGRAM: string
};

export const env: Env = {
    TOKEN: process.env.TOKEN!,
    PORT: Number(process.env.PORT!),
    URL: process.env.URL!,
    WEBHOOK: process.env.WEBHOOK!,
    WEBAPPURL: process.env.WEBAPPURL!,
    WEBAPPURLTELEGRAM: process.env.WEBAPPURLTELEGRAM!,
};

