import { describe, expect, it, vi } from 'vitest';

import { GreenApiClient } from '../api/greenApi';
import { createChat } from './chatService';

describe('createChat', () => {
  it('создаёт новый чат', async () => {
    const client = new GreenApiClient({
      apiUrl: 'https://example.com',
      idInstance: '123',
      apiTokenInstance: 'token',
    });

    vi.spyOn(client, 'checkAccount').mockResolvedValue({
      exist: true,
      chatId: '79991234567@c.us',
      fromCache: false,
      status: true,
    });

    vi.spyOn(client, 'getContactInfo').mockResolvedValue({
      chatId: '79991234567@c.us',
      phoneNumber: 79991234567,
      contactName: 'Иван',
    });

    const result = await createChat(
      client,
      '+7 (999) 123-45-67',
    );

    expect(result).toEqual({
      chatId: '79991234567@c.us',
      phoneNumber: 79991234567,
      name: 'Иван',
    });

    expect(client.checkAccount).toHaveBeenCalledWith({
      phoneNumber: 79991234567,
    });

    expect(client.getContactInfo).toHaveBeenCalledWith(
      '79991234567@c.us',
    );
  });

  it('выбрасывает ошибку, если аккаунт не найден', async () => {
    const client = new GreenApiClient({
      apiUrl: 'https://example.com',
      idInstance: '123',
      apiTokenInstance: 'token',
    });

    vi.spyOn(client, 'checkAccount').mockResolvedValue({
      exist: false,
      chatId: '',
      fromCache: false,
      status: true,
    });

    await expect(
      createChat(client, '79991234567'),
    ).rejects.toThrow(
      'Аккаунт MAX с таким номером не найден.',
    );

    expect(client.checkAccount).toHaveBeenCalledWith({
      phoneNumber: 79991234567,
    });
  });

  it('выбрасывает ошибку, если проверка аккаунта завершилась с ошибкой', async () => {
    const client = new GreenApiClient({
      apiUrl: 'https://example.com',
      idInstance: '123',
      apiTokenInstance: 'token',
    });

    vi.spyOn(client, 'checkAccount').mockResolvedValue({
      exist: false,
      chatId: '',
      fromCache: false,
      status: false,
      reason: 'Ошибка проверки аккаунта',
    });

    await expect(
      createChat(client, '79991234567'),
    ).rejects.toThrow(
      'Ошибка проверки аккаунта',
    );
  });

  it('возвращает существующий чат, если он уже есть', async () => {
    const client = new GreenApiClient({
      apiUrl: 'https://example.com',
      idInstance: '123',
      apiTokenInstance: 'token',
    });

    vi.spyOn(client, 'checkAccount').mockResolvedValue({
      exist: true,
      chatId: '79991234567@c.us',
      fromCache: false,
      status: true,
    });

    const getContactInfo = vi.spyOn(
      client,
      'getContactInfo',
    );

    const existingChat = {
      chatId: '79991234567@c.us',
      phoneNumber: 79991234567,
      name: 'Существующий чат',
    };

    const result = await createChat(
      client,
      '79991234567',
      [existingChat],
    );

    expect(result).toBe(existingChat);
    expect(getContactInfo).not.toHaveBeenCalled();
  });

  it('создаёт чат без имени, если не удалось получить данные контакта', async () => {
    const client = new GreenApiClient({
      apiUrl: 'https://example.com',
      idInstance: '123',
      apiTokenInstance: 'token',
    });

    vi.spyOn(client, 'checkAccount').mockResolvedValue({
      exist: true,
      chatId: '79991234567@c.us',
      fromCache: false,
      status: true,
    });

    vi.spyOn(client, 'getContactInfo').mockRejectedValue(
      new Error('Ошибка получения контакта'),
    );

    const result = await createChat(
      client,
      '79991234567',
    );

    expect(result).toEqual({
      chatId: '79991234567@c.us',
      phoneNumber: 79991234567,
      name: '+79991234567',
    });
  });
});
