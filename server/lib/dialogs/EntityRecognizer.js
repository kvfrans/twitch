var utils = require('../utils');
var chrono = require('chrono-node');
var EntityRecognizer = (function () {
    function EntityRecognizer() {
    }
    EntityRecognizer.findEntity = function (entities, type) {
        for (var i = 0; entities && i < entities.length; i++) {
            if (entities[i].type == type) {
                return entities[i];
            }
        }
        return null;
    };
    EntityRecognizer.findAllEntities = function (entities, type) {
        var found = [];
        for (var i = 0; entities && i < entities.length; i++) {
            if (entities[i].type == type) {
                found.push(entities[i]);
            }
        }
        return found;
    };
    EntityRecognizer.parseTime = function (entities) {
        if (typeof entities == 'string') {
            entities = EntityRecognizer.recognizeTime(entities);
        }
        return EntityRecognizer.resolveTime(entities);
    };
    EntityRecognizer.resolveTime = function (entities) {
        var _this = this;
        var now = new Date();
        var resolvedDate;
        var date;
        var time;
        entities.forEach(function (entity) {
            if (entity.resolution) {
                switch (entity.resolution.resolution_type || entity.type) {
                    case 'builtin.datetime':
                    case 'builtin.datetime.date':
                    case 'builtin.datetime.time':
                        var parts = (entity.resolution.date || entity.resolution.time).split('T');
                        if (!date && _this.dateExp.test(parts[0])) {
                            date = parts[0];
                        }
                        if (!time && parts[1]) {
                            time = 'T' + parts[1];
                            if (time == 'TMO') {
                                time = 'T08:00:00';
                            }
                            else if (time == 'TNI') {
                                time = 'T20:00:00';
                            }
                            else if (time.length == 3) {
                                time = time + ':00:00';
                            }
                            else if (time.length == 6) {
                                time = time + ':00';
                            }
                        }
                        break;
                    case 'chrono.duration':
                        var duration = entity;
                        resolvedDate = duration.resolution.start;
                }
            }
        });
        if (!resolvedDate && (date || time)) {
            if (!date) {
                date = utils.toDate8601(now);
            }
            if (time) {
                date += time;
            }
            resolvedDate = new Date(date);
        }
        return resolvedDate;
    };
    EntityRecognizer.recognizeTime = function (utterance, refDate) {
        var response;
        try {
            var results = chrono.parse(utterance, refDate);
            if (results && results.length > 0) {
                var duration = results[0];
                response = {
                    type: 'chrono.duration',
                    entity: duration.text,
                    startIndex: duration.index,
                    endIndex: duration.index + duration.text.length,
                    resolution: {
                        resolution_type: 'chrono.duration',
                        start: duration.start.date()
                    }
                };
                if (duration.end) {
                    response.resolution.end = duration.end.date();
                }
                if (duration.ref) {
                    response.resolution.ref = duration.ref;
                }
                response.score = duration.text.length / utterance.length;
            }
        }
        catch (err) {
            console.error('Error recognizing time: ' + err.toString());
            response = null;
        }
        return response;
    };
    EntityRecognizer.parseNumber = function (entities) {
        var entity;
        if (typeof entities == 'string') {
            entity = { type: 'text', entity: entities.trim() };
        }
        else {
            entity = EntityRecognizer.findEntity(entities, 'builtin.number');
        }
        if (entity) {
            var match = this.numberExp.exec(entity.entity);
            if (match) {
                return Number(match[0]);
            }
        }
        return Number.NaN;
    };
    EntityRecognizer.parseBoolean = function (utterance) {
        utterance = utterance.trim();
        if (EntityRecognizer.yesExp.test(utterance)) {
            return true;
        }
        else if (EntityRecognizer.noExp.test(utterance)) {
            return false;
        }
        return undefined;
    };
    EntityRecognizer.findBestMatch = function (choices, utterance, threshold) {
        if (threshold === void 0) { threshold = 0.6; }
        var best;
        var matches = EntityRecognizer.findAllMatches(choices, utterance, threshold);
        matches.forEach(function (value) {
            if (!best || value.score > best.score) {
                best = value;
            }
        });
        return best;
    };
    EntityRecognizer.findAllMatches = function (choices, utterance, threshold) {
        if (threshold === void 0) { threshold = 0.6; }
        var matches = [];
        utterance = utterance.trim().toLowerCase();
        var tokens = utterance.split(' ');
        EntityRecognizer.expandChoices(choices).forEach(function (choice, index) {
            var score = 0.0;
            var value = choice.trim().toLowerCase();
            if (value.indexOf(utterance) >= 0) {
                score = utterance.length / value.length;
            }
            else if (utterance.indexOf(value) >= 0) {
                score = Math.min(0.5 + (value.length / utterance.length), 0.9);
            }
            else {
                var matched = '';
                tokens.forEach(function (token) {
                    if (value.indexOf(token) >= 0) {
                        matched += token;
                    }
                });
                score = matched.length / value.length;
            }
            if (score > threshold) {
                matches.push({ index: index, entity: choice, score: score });
            }
        });
        return matches;
    };
    EntityRecognizer.expandChoices = function (choices) {
        if (!choices) {
            return [];
        }
        else if (Array.isArray(choices)) {
            return choices;
        }
        else if (typeof choices == 'string') {
            return choices.split('|');
        }
        else if (typeof choices == 'object') {
            var list = [];
            for (var key in choices) {
                list.push(key);
            }
            return list;
        }
        else {
            return [choices.toString()];
        }
    };
    EntityRecognizer.dateExp = /^\d{4}-\d{2}-\d{2}/i;
    EntityRecognizer.yesExp = /^(1|y|yes|yep|sure|ok|true)/i;
    EntityRecognizer.noExp = /^(2|n|no|nope|not|false)/i;
    EntityRecognizer.numberExp = /[+-]?(?:\d+\.?\d*|\d*\.?\d+)/;
    return EntityRecognizer;
})();
exports.EntityRecognizer = EntityRecognizer;
