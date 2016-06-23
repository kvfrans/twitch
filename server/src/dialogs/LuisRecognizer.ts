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

import dlg = require('./Dialog');
import intent = require('./IntentDialog');
import utils = require('../utils');
import request = require('request');

export interface ILuisModelMap {
    [local: string]: string;
}

export class LuisRecognizer implements intent.IIntentRecognizer {
    private models: ILuisModelMap;

    constructor(models: string|ILuisModelMap) {
        if (typeof models == 'string') {
            this.models = { '*': <string>models };
        } else {
            this.models = <ILuisModelMap>(models || {});
        }
    }

    public recognize(context: dlg.IRecognizeContext, cb: (err: Error, result: intent.IIntentRecognizerResult) => void): void {
        var result: intent.IIntentRecognizerResult = { score: 0.0, intent: null };
        if (context && context.message && context.message.text) {
            var utterance = context.message.text;
            var local = context.message.local || '*';
            var model = this.models.hasOwnProperty(local) ? this.models[local] : this.models['*'];
            if (model) {
                LuisRecognizer.recognize(utterance, model, (err, intents, entities) => {
                    if (!err) {
                        result.intents = intents;
                        result.entities = entities;

                        // Return top intent
                        var top: IIntent;
                        intents.forEach((intent) => {
                            if (top) {
                                if (intent.score > top.score) {
                                    top = intent;
                                }
                            } else {
                                top = intent;
                            }
                        });
                        if (top) {
                            // Ignore 'none' intent
                            switch (top.intent.toLowerCase()) {
                                case 'builtin.intent.none':
                                case 'none':
                                    // Ignore intent
                                    break;
                                default:
                                    result.score = top.score;
                                    result.intent = top.intent;
                                    break;
                            }
                        }
                        cb(null, result);
                    } else {
                        cb(err, null);
                    }
                });
            } else {
                cb(new Error("LUIS model not found for local '" + local + "'."), null);
            }
        } else {
            cb(null, result);
        }
    }

    static recognize(utterance: string, modelUrl: string, callback: (err: Error, intents?: IIntent[], entities?: IEntity[]) => void): void {
        try {
            var uri = modelUrl.trim();
            if (uri.lastIndexOf('&q=') != uri.length - 3) {
                uri += '&q=';
            }
            uri += encodeURIComponent(utterance || '');
            request.get(uri, (err: Error, res: any, body: string) => {
                // Parse result
                var result: ILuisResults;
                try {
                    if (!err) {
                        result = JSON.parse(body);
                        result.intents = result.intents || [];
                        result.entities = result.entities || [];
                        if (result.intents.length == 1 && typeof result.intents[0].score !== 'number') {
                            // Intents for the builtin Cortana app don't return a score.
                            result.intents[0].score = 1.0;
                        }
                    }
                } catch (e) {
                    err = e;
                }

                // Return result
                try {
                    if (!err) {
                        callback(null, result.intents, result.entities);
                    } else {
                        callback(err instanceof Error ? err : new Error(err.toString()));
                    }
                } catch (e) {
                    console.error(e.toString());
                }
            });
        } catch (err) {
            callback(err instanceof Error ? err : new Error(err.toString()));
        }
    }
}

interface ILuisResults {
    query: string;
    intents: IIntent[];
    entities: IEntity[];
}
