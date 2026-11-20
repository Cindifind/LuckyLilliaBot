export declare enum EventType {
    META = "meta_event",
    REQUEST = "request",
    NOTICE = "notice",
    MESSAGE = "message",
    MESSAGE_SENT = "message_sent"
}
export declare abstract class OB11BaseEvent {
    [index: string]: any;
    time: number;
    /** The account's number, filled in by the connection sending the event (connect/) */
    self_id: number;
    abstract post_type: EventType;
    getSummaryEventName(): string;
}
