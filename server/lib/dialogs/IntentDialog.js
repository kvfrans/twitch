var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dlg = require('./Dialog');
var actions = require('./DialogAction');
var consts = require('../consts');
var async = require('async');
(function (RecognizeOrder) {
    RecognizeOrder[RecognizeOrder["parallel"] = 0] = "parallel";
    RecognizeOrder[RecognizeOrder["series"] = 1] = "series";
})(exports.RecognizeOrder || (exports.RecognizeOrder = {}));
var RecognizeOrder = exports.RecognizeOrder;
var IntentDialog = (function (_super) {
    __extends(IntentDialog, _super);
    function IntentDialog(options) {
        if (options === void 0) { options = {}; }
        _super.call(this);
        this.options = options;
        this.handlers = {};
        this.expressions = [];
        if (typeof this.options.intentThreshold !== 'number') {
            this.options.intentThreshold = 0.1;
        }
        if (!this.options.hasOwnProperty('recognizeOrder')) {
            this.options.recognizeOrder = RecognizeOrder.parallel;
        }
        if (!this.options.recognizers) {
            this.options.recognizers = [];
        }
        if (!this.options.processLimit) {
            this.options.processLimit = 4;
        }
    }
    IntentDialog.prototype.begin = function (session, args) {
        var _this = this;
        if (this.beginDialog) {
            try {
                this.beginDialog(session, args, function () {
                    _super.prototype.begin.call(_this, session, args);
                });
            }
            catch (e) {
                this.emitError(session, e);
            }
        }
        else {
            _super.prototype.begin.call(this, session, args);
        }
    };
    IntentDialog.prototype.replyReceived = function (session, recognizeResult) {
        var _this = this;
        if (!recognizeResult) {
            this.recognize({ message: session.message, activeDialog: true }, function (err, result) {
                if (!err) {
                    _this.invokeIntent(session, result);
                }
                else {
                    _this.emitError(session, err);
                }
            });
        }
        else {
            this.invokeIntent(session, recognizeResult);
        }
    };
    IntentDialog.prototype.dialogResumed = function (session, result) {
        var activeIntent = session.dialogData[consts.Data.Intent];
        if (activeIntent && this.handlers.hasOwnProperty(activeIntent)) {
            try {
                this.handlers[activeIntent](session, result);
            }
            catch (e) {
                this.emitError(session, e);
            }
        }
        else {
            _super.prototype.dialogResumed.call(this, session, result);
        }
    };
    IntentDialog.prototype.recognize = function (context, cb) {
        function done(err, r) {
            if (!err) {
                if (r.score > result.score) {
                    cb(null, r);
                }
                else {
                    cb(null, result);
                }
            }
            else {
                cb(err, null);
            }
        }
        var result = { score: 0.0, intent: null };
        if (context.message && context.message.text) {
            if (this.expressions) {
                for (var i = 0; i < this.expressions.length; i++) {
                    var exp = this.expressions[i];
                    var matches = exp.exec(context.message.text);
                    if (matches && matches.length) {
                        var matched = matches[0];
                        var score = matched.length / context.message.text.length;
                        if (score > result.score && score >= this.options.intentThreshold) {
                            result.score = score;
                            result.intent = exp.toString();
                            result.expression = exp;
                            result.matched = matched;
                            if (score == 1.0) {
                                break;
                            }
                        }
                    }
                }
            }
            if (result.score < 1.0 && this.options.recognizers.length) {
                switch (this.options.recognizeOrder) {
                    default:
                    case RecognizeOrder.parallel:
                        this.recognizeInParallel(context, done);
                        break;
                    case RecognizeOrder.series:
                        this.recognizeInSeries(context, done);
                        break;
                }
            }
            else {
                cb(null, result);
            }
        }
        else {
            cb(null, result);
        }
    };
    IntentDialog.prototype.onBegin = function (handler) {
        this.beginDialog = handler;
        return this;
    };
    IntentDialog.prototype.matches = function (intent, dialogId, dialogArgs) {
        var id;
        if (intent) {
            if (typeof intent === 'string') {
                id = intent;
            }
            else {
                id = intent.toString();
                this.expressions.push(intent);
            }
        }
        if (this.handlers.hasOwnProperty(id)) {
            throw new Error("A handler for '" + id + "' already exists.");
        }
        if (Array.isArray(dialogId)) {
            this.handlers[id] = actions.waterfall(dialogId);
        }
        else if (typeof dialogId === 'string') {
            this.handlers[id] = actions.DialogAction.beginDialog(dialogId, dialogArgs);
        }
        else {
            this.handlers[id] = actions.waterfall([dialogId]);
        }
        return this;
    };
    IntentDialog.prototype.onDefault = function (dialogId, dialogArgs) {
        if (Array.isArray(dialogId)) {
            this.handlers[consts.Intents.Default] = actions.waterfall(dialogId);
        }
        else if (typeof dialogId === 'string') {
            this.handlers[consts.Intents.Default] = actions.DialogAction.beginDialog(dialogId, dialogArgs);
        }
        else {
            this.handlers[consts.Intents.Default] = actions.waterfall([dialogId]);
        }
        return this;
    };
    IntentDialog.prototype.recognizeInParallel = function (context, done) {
        var _this = this;
        var result = { score: 0.0, intent: null };
        async.eachLimit(this.options.recognizers, this.options.processLimit, function (recognizer, cb) {
            try {
                recognizer.recognize(context, function (err, r) {
                    if (!err && r && r.score > result.score && r.score >= _this.options.intentThreshold) {
                        result = r;
                    }
                    cb(err);
                });
            }
            catch (e) {
                cb(e);
            }
        }, function (err) {
            if (!err) {
                done(null, result);
            }
            else {
                done(err instanceof Error ? err : new Error(err.toString()), null);
            }
        });
    };
    IntentDialog.prototype.recognizeInSeries = function (context, done) {
        var _this = this;
        var i = 0;
        var result = { score: 0.0, intent: null };
        async.whilst(function () {
            return (i < _this.options.recognizers.length && result.score < 1.0);
        }, function (cb) {
            try {
                var recognizer = _this.options.recognizers[i++];
                recognizer.recognize(context, function (err, r) {
                    if (!err && r && r.score > result.score && r.score >= _this.options.intentThreshold) {
                        result = r;
                    }
                    cb(err);
                });
            }
            catch (e) {
                cb(e);
            }
        }, function (err) {
            if (!err) {
                done(null, result);
            }
            else {
                done(err instanceof Error ? err : new Error(err.toString()), null);
            }
        });
    };
    IntentDialog.prototype.invokeIntent = function (session, recognizeResult) {
        var activeIntent;
        if (recognizeResult.intent && this.handlers.hasOwnProperty(recognizeResult.intent)) {
            activeIntent = recognizeResult.intent;
        }
        else if (this.handlers.hasOwnProperty(consts.Intents.Default)) {
            activeIntent = consts.Intents.Default;
        }
        if (activeIntent) {
            try {
                session.dialogData[consts.Data.Intent] = activeIntent;
                this.handlers[activeIntent](session, recognizeResult);
            }
            catch (e) {
                this.emitError(session, e);
            }
        }
    };
    IntentDialog.prototype.emitError = function (session, err) {
        err = err instanceof Error ? err : new Error(err.toString());
        session.error(err);
    };
    return IntentDialog;
})(dlg.Dialog);
exports.IntentDialog = IntentDialog;
