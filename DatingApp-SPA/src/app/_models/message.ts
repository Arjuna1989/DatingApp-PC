export interface Message {
    id:number;
    senderId:number;
    senderKnownAs:string;
    senderPhotoUrl:string;
    recipientId:number;
    recipientKnownAs:string;
    recipientPhotoUrl:string;
    noContent:string;
    isRead:boolean;
    dateRead:Date;
    messageSent:Date;
}
