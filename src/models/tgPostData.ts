export type PostData = {
    sessionId: string;
};

export type SendMessageChatData = {
    message: string,
    chatId: string,
    sessionId: string,
}