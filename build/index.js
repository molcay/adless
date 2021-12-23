"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var pino_1 = require("pino");
var axios_1 = require("axios");
var fs = require("fs/promises");
var path = require("path");
var PORT = process.env.PORT || 11923;
var server = (0, fastify_1.fastify)({
    logger: (0, pino_1.default)({ level: 'info' })
});
var RESPONSE = '';
var cleanMultipleLines = function (str) { return str.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return !!line; }); };
function readURLList() {
    return __awaiter(this, void 0, void 0, function () {
        var filepath, rawContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filepath = path.join(__dirname, 'assets/data/url-list.txt');
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 1:
                    rawContent = _a.sent();
                    return [2 /*return*/, cleanMultipleLines(rawContent.toString())];
            }
        });
    });
}
function updateHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, allLists;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readURLList()];
                case 1:
                    lines = _a.sent();
                    return [4 /*yield*/, Promise.all(lines.map(function (url) { return __awaiter(_this, void 0, void 0, function () {
                            var resp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.get(url)];
                                    case 1:
                                        resp = _a.sent();
                                        return [2 /*return*/, cleanMultipleLines(resp.data).join("\r\n")];
                                }
                            });
                        }); }))];
                case 2:
                    allLists = _a.sent();
                    RESPONSE = allLists.join('\r\n');
                    return [2 /*return*/, RESPONSE];
            }
        });
    });
}
function indexHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!RESPONSE) return [3 /*break*/, 2];
                    console.log('empty list! updating...');
                    return [4 /*yield*/, updateHandler(request, reply)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    console.log('Response from cache!');
                    return [2 /*return*/, RESPONSE];
            }
        });
    });
}
server.get('/', indexHandler);
server.post('/update', updateHandler);
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, server.listen(PORT, '0.0.0.0')];
            case 1:
                _a.sent();
                console.log('Server started successfully');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                server.log.error(err_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
start();
