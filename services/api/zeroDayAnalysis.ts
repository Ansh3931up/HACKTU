import { api } from './api'

export const zeroDayAnalysisService = {
    async getAllZeroDayData() {
        try {
            const response = await api.get(`/zeroDay/scan/all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching zero-day analysis:', error);
            throw error;
        }
    },
}