﻿// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Bot Framework: http://botframework.com
// 
// Bot Builder SDK Github:
// https://github.com/Microsoft/BotBuilder
// 
// Copyright (c) Microsoft Corporation
// All rights reserved.
// 
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

interface IMessage {
    address: IAddress;              // Address routing information for the message.
    timestamp: string;              // Timestamp of message given by chat service 
    channelData: any;               // Message in original/native format of the channel, may also contain extra payload added by Bot Framework 
    type: string;                   // Defines type of notification 
    summary: string;                // Text to be displayed by as fall-back and as short description of the message content in e.g. list of recent conversations 
    text: string;                   // Message text  
    local: string;                  // Identified language of the message.
    attachments: IAttachment[];     // This is placeholder for structured objects attached to this message 
    entities: any[];                // This property is intended to keep structured data objects intended for Client application e.g.: Contacts, Reservation, Booking, Tickets. Structure of these object objects should be known to Client application.
    textFormat: string;             // Format of text fields [plain|markdown|xml] default:markdown
    attachmentLayout: string;       // AttachmentLayout - hint for how to deal with multiple attachments Values: [list|carousel] default:list

    // SDK specific fields
    user: IIdentity;                // Normalized user that this message is either from or going to.
}

interface IIsMessage {
    toMessage(): IMessage;
}

interface IIdentity {
    id: string;                     // Channel specific ID for this identity
    name?: string;                  // Friendly name for this identity
    isGroup?: boolean;              // If true the identity is a group.  
}

interface IAddress {
    channelId: string;              // Unique identifier for channel
    user: IIdentity;                // User that sent or should receive the message
    bot?: IIdentity;                // Bot that either received or is sending the message
    conversation?: IIdentity;       // Represents the current conversation and tracks where replies should be routed to. 
}

interface IAttachment {
    contentType: string;            // MIME type string which describes type of attachment 
    content?: any;                  // (Optional) object structure of attachment 
    contentUrl?: string;            // (Optional) reference to location of attachment content
}

interface IIsAttachment {
    toAttachment(): IAttachment;
}

interface ISigninCard {
    text: string;                   // Title of the Card 
    buttons: ICardAction[];         // Sign in action 
}

interface IThumbnailCard {
    title: string;                  // Title of the Card 
    subtitle: string;               // Subtitle appears just below Title field, differs from Title in font styling only 
    text: string;                   // Text field appears just below subtitle, differs from Subtitle in font styling only 
    images: ICardImage[];               // Messaging supports all media formats: audio, video, images and thumbnails as well to optimize content download. 
    tap: ICardAction;                   // This action will be activated when user taps on the section bubble. 
    buttons: ICardAction[];             // Set of actions applicable to the current card. 
}

interface IReceiptCard {
    title: string;                  // Title of the Card 
    items: IReceiptItem[];          // Array of receipt items.
    facts: IFact[];                 // Array of key-value pairs. 
    tap: ICardAction;                   // This action will be activated when user taps on the section bubble. 
    total: string;                  // Total amount of money paid (or should be paid) 
    tax: string;                    // Total amount of TAX paid (or should be paid) 
    vat: string;                    // Total amount of VAT paid (or should be paid) 
    buttons: ICardAction[];             // Set of actions applicable to the current card. 
}

interface IReceiptItem {
    title: string;                  // Title of the Card 
    subtitle: string;               // Subtitle appears just below Title field, differs from Title in font styling only 
    text: string;                   // Text field appears just below subtitle, differs from Subtitle in font styling only 
    image: ICardImage;
    price: string;                  // Amount with currency 
    quantity: string;               // Number of items of given kind 
    tap: ICardAction;                   // This action will be activated when user taps on the Item bubble. 
}

interface IIsReceiptItem {
    toItem(): IReceiptItem;
}

interface ICardAction {
    type: string;                   // Defines the type of action implemented by this button.  
    title: string;                  // Text description which appear on the button. 
    value: string;                  // Parameter for Action. Content of this property depends on Action type. 
    image?: string;                 // (Optional) Picture which will appear on the button, next to text label. 
}

interface IIsCardAction {
    toAction(): ICardAction;
}

interface ICardImage {
    url: string;                    // Thumbnail image for major content property. 
    alt: string;                    // Image description intended for screen readers 
    tap: ICardAction;                   // Action assigned to specific Attachment. E.g. navigate to specific URL or play/open media content 
}

interface IIsCardImage {
    toImage(): ICardImage;
}

interface IFact {
    key: string;                    // Name of parameter 
    value: string;                  // Value of parameter 
}

interface IIsFact {
    toFact(): IFact;
}

interface IRating {
    score: number;                  // Score is a floating point number. 
    max: number;                    // Defines maximum score (e.g. 5, 10 or etc). This is mandatory property. 
    text: string;                   // Text to be displayed next to score. 
}

interface IMessageV2 {
    type?: string;
    id?: string;
    conversationId?: string;
    created?: string;
    sourceText?: string;
    sourceLanguage?: string;
    language?: string;
    text?: string;
    attachments?: IAttachmentV2[];
    from?: IChannelAccountV2;
    to?: IChannelAccountV2;
    userId?: string;
    replyTo?: IChannelAccountV2;
    replyToMessageId?: string;
    participants?: IChannelAccountV2[];
    totalParticipants?: number;
    mentions?: IMentionV2[];
    place?: string;
    channelMessageId?: string;
    channelConversationId?: string;
    channelData?: any;
    location?: ILocationV2;
    hashtags?: string[];
    eTag?: string;
}

interface IBotConnectorMessageV2 extends IMessageV2 {
    botUserData?: any;
    botConversationData?: any;
    botPerUserInConversationData?: any;
}

interface IAttachmentV2 {
    actions?: IActionV2[];
    contentType?: string;
    contentUrl?: string;
    fallbackText?: string;
    title?: string;
    titleLink?: string;
    text?: string;
    thumbnailUrl?: string;
}

interface IActionV2 {
    title?: string;
    message?: string;
    url?: string;
    image?: string;    
}

interface IChannelAccountV2 {
    name?: string;
    channelId: string;
    address: string;
    id?: string;
    isBot?: boolean;
}

interface IMentionV2 {
    mentioned?: IChannelAccountV2;
    text?: string;
}

interface ILocationV2 {
    altitude?: number;
    latitude: number;
    longitude: number;
}

interface IBeginDialogAddress {
    to: IChannelAccountV2;
    from?: IChannelAccountV2;
    language?: string;
    text?: string;
}

interface ILocalizer {
    gettext(language: string, msgid: string): string;
    ngettext(language: string, msgid: string, msgid_plural: string, count: number): string;
}

interface ISession {
    sessionState: ISessionState;
    message: IMessage;
    userData: any;
    dialogData: any;
    error(err: Error): ISession;
    gettext(msgid: string, ...args: any[]): string;
    ngettext(msgid: string, msgid_plural: string, count: number): string;
    send(message: string, ...args: any[]): ISession;
    send(msg: IMessage): ISession;
    getMessageReceived(): any;
    messageSent(): boolean;
    beginDialog<T>(id: string, args?: T): ISession;
    replaceDialog<T>(id: string, args?: T): ISession;
    endDialog(result?: any): ISession;
    reset(id: string): ISession;
    isReset(): boolean;
}

interface ISessionState {
    callstack: IDialogState[];
    lastAccess: number;
    version: number;
}

interface IDialogState {
    id: string;
    state: any;
}

interface IBeginDialogHandler {
    (session: ISession, args: any, next: (handled: boolean) => void): void; 
}

interface IDialogHandler<T> {
    (session: ISession, args?: T): void;
}

interface IIntent {
    intent: string;
    score: number;
}

interface IEntity {
    entity: string;
    type: string;
    startIndex?: number;
    endIndex?: number;
    score?: number;
}
