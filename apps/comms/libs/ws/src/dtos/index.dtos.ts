export class RedisSocketEventSendDto {
  public readonly userId: string;
  public readonly socketId: string;
  public readonly event: string;
  public readonly data: unknown;
}

export class ResponseAndPublishDto {
  data: any;
  channel: string;
}
