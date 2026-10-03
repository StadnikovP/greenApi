import { GreenApiClient } from '../api/greenApi';
import type { ChatModel } from '../types/chat';

export function normalizePhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function validatePhoneNumber(value: string): number {
  const normalized = normalizePhoneNumber(value);

  if (!/^(7\d{10}|375\d{9})$/.test(normalized)) {
    throw new Error(
      'Введите корректный номер телефона РФ или Беларуси.',
    );
  }

  return Number(normalized);
}

export async function createChat(
  client: GreenApiClient,
  phone: string,
  existingChats: ChatModel[] = [],
): Promise<ChatModel> {
  const phoneNumber = validatePhoneNumber(phone);

  const account = await client.checkAccount({phoneNumber});

  if (account.status === false) {
    throw new Error(
      account.reason || 'Не удалось проверить аккаунт MAX.',
    );
  }

  if (!account.exist || !account.chatId) {
    throw new Error(
      'Аккаунт MAX с таким номером не найден.',
    );
  }

  const existingChat = existingChats.find(
    (chat) => chat.chatId === account.chatId,
  );

  if (existingChat) {
    return existingChat;
  }

  let contactName = '';

  try {
    const contact = await client.getContactInfo(account.chatId);

    contactName =
      contact.contactName?.trim() ||
      contact.name?.trim() ||
      '';

  } catch {
    // TODO
  }

  return {
    chatId: account.chatId,
    phoneNumber,
    name: contactName || `+${phoneNumber}`,
  };
}
