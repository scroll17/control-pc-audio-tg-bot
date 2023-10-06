export interface ISendNotificationFileBuffer {
  content: Buffer;
  name: string;
}

export interface ISendNotification {
  to: string;
  title: string;
  replyToMessage?: number;
  photo?: string;
  fileBuffer?: ISendNotificationFileBuffer;
  jsonObject?: Record<string, unknown>;
  details?: Array<[string, string | number]>;
  buttons?: Array<[string, string]>;
}
