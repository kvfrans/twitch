// 
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

import ub = require('../bots/UniversalBot');


export interface IDialogVersionOptions {
    version: number;
    message?: string|string[]|IMessage|IIsMessage;
    resetCommand?: RegExp;
}

export class Middleware {

    static dialogVersion(options: IDialogVersionOptions): ub.IMiddlewareMap {
        return {
            dialog: (session, next) => {
                var cur = session.sessionState.version || 0.0;
                var curMajor = Math.floor(cur);
                var major = Math.floor(options.version);
                if (session.sessionState.callstack.length && curMajor !== major) {
                    session.endConversation(options.message || "Sorry. The service was upgraded and we need to start over.");
                } else if (options.resetCommand && session.message.text && options.resetCommand.test(session.message.text)) {
                    session.endConversation(options.message || "Sorry. The service was upgraded and we need to start over.");
                } else {
                    session.sessionState.version = options.version;
                    next(); 
                }
            }
        };
    }
}