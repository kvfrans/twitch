var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dlg = require('../dialogs/Dialog');
var intent = require('../dialogs/IntentDialog');
var CommandDialog = (function (_super) {
    __extends(CommandDialog, _super);
    function CommandDialog(serviceUri) {
        _super.call(this);
        console.warn('CommandDialog class is deprecated. Use IntentDialog class instead.');
        this.dialog = new intent.IntentDialog();
    }
    CommandDialog.prototype.begin = function (session, args) {
        this.dialog.begin(session, args);
    };
    CommandDialog.prototype.replyReceived = function (session, recognizeResult) {
        this.dialog.replyReceived(session, recognizeResult);
    };
    CommandDialog.prototype.dialogResumed = function (session, result) {
        this.dialog.dialogResumed(session, result);
    };
    CommandDialog.prototype.recognize = function (context, cb) {
        this.dialog.recognize(context, cb);
    };
    CommandDialog.prototype.onBegin = function (handler) {
        this.dialog.onBegin(handler);
        return this;
    };
    CommandDialog.prototype.matches = function (patterns, dialogId, dialogArgs) {
        var _this = this;
        var list = (!Array.isArray(patterns) ? [patterns] : patterns);
        list.forEach(function (p) {
            _this.dialog.matches(new RegExp(p, 'i'), dialogId, dialogArgs);
        });
        return this;
    };
    CommandDialog.prototype.onDefault = function (dialogId, dialogArgs) {
        this.dialog.onDefault(dialogId, dialogArgs);
        return this;
    };
    return CommandDialog;
})(dlg.Dialog);
exports.CommandDialog = CommandDialog;
