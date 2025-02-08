const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014/api/v1';

export const phishingAnalysisService = {
    async getAllPhishingData(params: { url?: string; domain?: string; html?: string }) {
        try {
            const queryParams = new URLSearchParams(params as Record<string, string>);
            const response = await fetch(`${BASE_URL}/phishing/scan/all?${queryParams}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching phishing analysis:', error);
            throw error;
        }
    },

    async checkWhois(domain: string) {
        try {
            const response = await fetch(`${BASE_URL}/phishing/check/whois?domain=${domain}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error checking WHOIS:', error);
            throw error;
        }
    },

    async checkDNS(domain: string) {
        try {
            const response = await fetch(`${BASE_URL}/phishing/check/dns?domain=${domain}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error checking DNS:', error);
            throw error;
        }
    },

    async checkContent(url: string) {
        try {
            const response = await fetch(`${BASE_URL}/phishing/check/content?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error checking content:', error);
            throw error;
        }
    },

    async extractLinks(html: string) {
        try {
            const response = await fetch(`${BASE_URL}/phishing/extract/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error extracting links:', error);
            throw error;
        }
    },

    async checkUrlSafety(url: string) {
        try {
            const response = await fetch(`${BASE_URL}/phishing/check/url-safety?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error checking URL safety:', error);
            throw error;
        }
    }
}; 