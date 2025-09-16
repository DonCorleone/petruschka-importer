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
exports.VisitateService = void 0;
const axios_1 = __importDefault(require("axios"));
class VisitateService {
    constructor() {
        this.baseUrl = 'https://mulu.visitate.net/service/web/infofeed/public';
        // Method getDefaultDateRange removed as we now fetch all tour dates
    }
    /**
     * Fetches tour details from Visitate API
     *
     * @param tourId The ID of the tour to fetch
     * @returns Tour details
     */
    getTourDetails(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/tour/${tourId}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching tour details:', error);
                throw new Error(`Failed to fetch tour details for tour ID ${tourId}`);
            }
        });
    }
    /**
     * Fetches tour dates from Visitate API
     *
     * @param tourId The ID of the tour
     * @returns Array of tour dates
     */
    getTourDates(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/tourAvasShort`, {
                    params: {
                        available_tours: 1,
                        guided_tour_id: tourId
                    }
                });
                return response.data;
            }
            catch (error) {
                console.error('Error fetching tour dates:', error);
                throw new Error(`Failed to fetch tour dates for tour ID ${tourId}`);
            }
        });
    }
}
exports.VisitateService = VisitateService;
