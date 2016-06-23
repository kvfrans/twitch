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

import ses = require('../Session');
import msg = require('../Message');

export class ThumbnailCard implements IIsAttachment {
    protected data = {
        contentType: 'application/vnd.microsoft.card.thumbnail',
        content: <IThumbnailCard>{}
    };
    
    constructor(protected session?: ses.Session) {
        
    }
    
    public title(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.content.title = msg.fmtText(this.session, text, args);
        }
        return this;
    }

    public subtitle(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.content.subtitle = msg.fmtText(this.session, text, args);
        }
        return this;
    }
    
    public text(text: string|string[], ...args: any[]): this {
        if (text) {
            this.data.content.text = msg.fmtText(this.session, text, args);
        }
        return this;
    }
    
    public images(list: ICardImage[]|IIsCardImage[]): this {
        this.data.content.images = [];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var image = list[i];
                this.data.content.images.push((<IIsCardImage>image).toImage ? (<IIsCardImage>image).toImage() : <ICardImage>image);    
            }
        }
        return this;
    }

    public buttons(list: ICardAction[]|IIsCardAction[]): this {
        this.data.content.buttons = [];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var action = list[i];
                this.data.content.buttons.push((<IIsCardAction>action).toAction ? (<IIsCardAction>action).toAction() : <ICardAction>action);    
            }
        }
        return this;
    }
    
    public tap(action: ICardAction|IIsCardAction): this {
        if (action) {
            this.data.content.tap = (<IIsCardAction>action).toAction ? (<IIsCardAction>action).toAction() : <ICardAction>action;
        }
        return this;
    }

    public toAttachment(): IAttachment {
        return this.data;
    }
}