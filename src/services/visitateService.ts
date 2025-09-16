import axios from 'axios';
import { TourDetails, TourDate } from '../models/visitate';

export class VisitateService {
  private readonly baseUrl = 'https://mulu.visitate.net/service/web/infofeed/public';

  /**
   * Fetches tour details from Visitate API
   * 
   * @param tourId The ID of the tour to fetch
   * @returns Tour details
   */
  async getTourDetails(tourId: number): Promise<TourDetails> {
    try {
      const response = await axios.get<TourDetails>(`${this.baseUrl}/tour/${tourId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour details:', error);
      throw new Error(`Failed to fetch tour details for tour ID ${tourId}`);
    }
  }

  /**
   * Fetches tour dates from Visitate API
   * 
   * @param tourId The ID of the tour
   * @returns Array of tour dates
   */
  async getTourDates(tourId: number): Promise<TourDate[]> {
    try {
      const response = await axios.get<TourDate[]>(
        `${this.baseUrl}/tourAvasShort`,
        {
          params: {
            available_tours: 1,
            guided_tour_id: tourId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tour dates:', error);
      throw new Error(`Failed to fetch tour dates for tour ID ${tourId}`);
    }
  }

  // Method getDefaultDateRange removed as we now fetch all tour dates
}