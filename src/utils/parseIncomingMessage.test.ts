import { describe, expect, it } from 'vitest';

import type { GreenApiNotification } from '../api/types';

import { parseIncomingMessage } from './parseIncomingMessage';

describe('parseIncomingMessage', () => {
  it('возвращает входящее текстовое сообщение', () => {
    const notification: GreenApiNotification = {
      typeWebhook: 'incomingMessageReceived',
      instanceData: {
        idInstance: 123,
        wid: '79991234567@c.us',
        typeInstance: 'whatsapp',
      },
      timestamp: 123456789,
      idMessage: 'message-1',
      senderData: {
        chatId: '79991234567@c.us',
        chatName: 'Test',
        chatType: 'personal',
        sender: '79991234567@c.us',
        senderName: 'Test',
        senderType: 'user',
        senderContactName: 'Test',
      },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: {
          textMessage: 'Привет!',
        },
      },
    };

    const result = parseIncomingMessage(
      notification,
      '79991234567@c.us',
    );

    expect(result).toEqual({
      id: 'message-1',
      message: 'Привет!',
      direction: 'incoming',
    });
  });

  it('возвращает null для сообщения из другого чата', () => {
    const notification: GreenApiNotification = {
      typeWebhook: 'incomingMessageReceived',
      instanceData: {
        idInstance: 123,
        wid: '79991234567@c.us',
        typeInstance: 'whatsapp',
      },
      timestamp: 123456789,
      idMessage: 'message-2',
      senderData: {
        chatId: '79991234567@c.us',
        chatName: 'Test',
        chatType: 'personal',
        sender: '79991234567@c.us',
        senderName: 'Test',
        senderType: 'user',
        senderContactName: 'Test',
      },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: {
          textMessage: 'Привет!',
        },
      },
    };

    const result = parseIncomingMessage(
      notification,
      '79990000000@c.us',
    );

    expect(result).toBeNull();
  });

  it('возвращает null для другого типа webhook', () => {
    const notification: GreenApiNotification = {
      typeWebhook: 'outgoingMessageReceived',
      instanceData: {
        idInstance: 123,
        wid: '79991234567@c.us',
        typeInstance: 'whatsapp',
      },
      timestamp: 123456789,
      idMessage: 'message-3',
      senderData: {
        chatId: '79991234567@c.us',
        chatName: 'Test',
        chatType: 'personal',
        sender: '79991234567@c.us',
        senderName: 'Test',
        senderType: 'user',
        senderContactName: 'Test',
      },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: {
          textMessage: 'Привет!',
        },
      },
    };

    const result = parseIncomingMessage(
      notification,
      '79991234567@c.us',
    );

    expect(result).toBeNull();
  });

  it('возвращает null для сообщения не текстового типа', () => {
    const notification: GreenApiNotification = {
      typeWebhook: 'incomingMessageReceived',
      instanceData: {
        idInstance: 123,
        wid: '79991234567@c.us',
        typeInstance: 'whatsapp',
      },
      timestamp: 123456789,
      idMessage: 'message-4',
      senderData: {
        chatId: '79991234567@c.us',
        chatName: 'Test',
        chatType: 'personal',
        sender: '79991234567@c.us',
        senderName: 'Test',
        senderType: 'user',
        senderContactName: 'Test',
      },
      messageData: {
        typeMessage: 'imageMessage',
      },
    };

    const result = parseIncomingMessage(
      notification,
      '79991234567@c.us',
    );

    expect(result).toBeNull();
  });

  it('возвращает null для пустого текста', () => {
    const notification: GreenApiNotification = {
      typeWebhook: 'incomingMessageReceived',
      instanceData: {
        idInstance: 123,
        wid: '79991234567@c.us',
        typeInstance: 'whatsapp',
      },
      timestamp: 123456789,
      idMessage: 'message-5',
      senderData: {
        chatId: '79991234567@c.us',
        chatName: 'Test',
        chatType: 'personal',
        sender: '79991234567@c.us',
        senderName: 'Test',
        senderType: 'user',
        senderContactName: 'Test',
      },
      messageData: {
        typeMessage: 'textMessage',
        textMessageData: {
          textMessage: '   ',
        },
      },
    };

    const result = parseIncomingMessage(
      notification,
      '79991234567@c.us',
    );

    expect(result).toBeNull();
  });
});
