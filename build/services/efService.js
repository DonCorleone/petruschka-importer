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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function getEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = process.env.EF_AUTH;
        const cookie = process.env.EF_COOKIE;
        const uriOverview = process.env.EF_URL_OVERVIEW;
        if (!auth || !cookie || !uriOverview) {
            throw new Error('no ef uri or no auth');
        }
        const myHeaders = {
            Authorization: auth,
            Cookie: cookie
        };
        const resp = yield (0, node_fetch_1.default)(uriOverview, {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });
        const response = (yield resp.json());
        const list = response.events;
        const efEvents = list;
        if (!efEvents || !efEvents.length) {
            throw new Error('no Events found on EF');
        }
        return efEvents;
    });
}
exports.default = getEvents;
