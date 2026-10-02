export interface GreenApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface StateInstanceResponse {
  stateInstance: | 'authorized' | 'notAuthorized' | 'blocked';
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache: boolean;
  status?: boolean;
  reason?: string;
}

export interface checkAccount {
  phoneNumber: number;
  force?: boolean;
}


export interface ContactInfoResponse {
  chatId: string;
  contactName?: string;
  name?: string;
  phoneNumber: number;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: GreenApiNotification;
}

export interface GreenApiNotification {
  typeWebhook: string;
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    chatName: string;
    chatType: string;
    sender: string;
    senderName: string;
    senderType: string;
    senderContactName: string;
    senderPhoneNumber?: number;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export interface DeleteNotificationResponse {
  result: boolean;
  reason: string;
}
