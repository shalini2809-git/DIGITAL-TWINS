
import { GoogleGenAI } from "@google/genai";
import { Asset, PredictiveAnalysis } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateOptoPrompt = (asset: Asset): string => {
    const specs = asset.specifications.map(s => `- ${s.key}: ${s.value}`).join('\n');
    const params = asset.operationalParameters.map(p => `- ${p.key}: ${p.value}`).join('\n');

    return `
        Analyze the following industrial asset to provide optimization suggestions.
        The asset is currently experiencing some issues or has potential for improvement.
        Provide 3 concise, actionable suggestions in JSON format. The JSON should be an array of objects, where each object has a 'title' (a short headline) and a 'suggestion' (a 1-2 sentence explanation).

        Asset Details:
        - Name: ${asset.name}
        - Type: ${asset.type}
        - Status: ${asset.status}
        - Overall Performance (OEE): ${asset.performance}%
        
        Specifications:
        ${specs}
        
        Current Operational Parameters:
        ${params}

        Example JSON output format:
        [
            {"title": "Suggestion Title 1", "suggestion": "Detailed suggestion text here."},
            {"title": "Suggestion Title 2", "suggestion": "Detailed suggestion text here."},
            {"title": "Suggestion Title 3", "suggestion": "Detailed suggestion text here."}
        ]

        Based on the provided data, generate the optimization suggestions.
    `;
};

const generatePredictivePrompt = (asset: Asset): string => {
    const params = asset.operationalParameters.map(p => `- ${p.key}: ${p.value}`).join('\n');
    const warningParam = asset.operationalParameters.find(p => p.key.toLowerCase().includes('temp') || p.key.toLowerCase().includes('vibration'));

    return `
        You are a predictive maintenance specialist for industrial machinery. Based on the following data from a digital twin, predict the most likely failure mode, estimate the timeframe for this failure, and recommend a specific preventative action.
        The asset is currently in a 'Warning' state, which is a critical piece of information for your analysis.

        Asset Details:
        - Name: ${asset.name}
        - Type: ${asset.type}
        - Status: ${asset.status}
        - Performance (OEE): ${asset.performance}%
        
        Current Operational Parameters:
        ${params}
        ${warningParam ? `\nCRITICAL ALERT: The parameter '${warningParam.key}' is currently at '${warningParam.value}', which has triggered the warning state.` : ''}

        Provide your analysis in a single, clean JSON object with the keys "failureMode", "timeframe", and "recommendation".

        Example JSON output format:
        {"failureMode": "Motor Bearing Seizure due to Overheating", "timeframe": "Within the next 48-72 hours", "recommendation": "Immediately schedule maintenance to inspect and lubricate motor bearings. Consider reducing operational load by 20% until the issue is resolved."}

        Generate the predictive maintenance analysis based on the provided data.
    `;
};


const parseJsonResponse = (text: string) => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    return JSON.parse(jsonStr);
};


export const getOptimizationSuggestions = async (asset: Asset): Promise<{ title: string; suggestion: string }[]> => {
    if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve([
            { title: "Mock: Reduce Spindle Speed", suggestion: "Consider reducing spindle speed during non-critical operations to lower energy consumption and reduce wear." },
            { title: "Mock: Upgrade Coolant System", suggestion: "An upgraded coolant system could provide better temperature regulation, extending tool life and improving finish quality." },
            { title: "Mock: Calibrate Axis Servos", suggestion: "Regular calibration of the X and Y axis servos can prevent microscopic alignment errors, ensuring higher precision." }
        ]), 1500));
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: generateOptoPrompt(asset),
            config: { responseMimeType: "application/json", temperature: 0.5 }
        });

        const parsedData = parseJsonResponse(response.text);

        if (Array.isArray(parsedData) && parsedData.every(item => 'title' in item && 'suggestion' in item)) {
            return parsedData;
        } else {
            throw new Error("Invalid JSON format for suggestions received from API");
        }

    } catch (error) {
        console.error("Error fetching suggestions from Gemini API:", error);
        throw new Error("Failed to get optimization suggestions.");
    }
};

export const getPredictiveMaintenanceAnalysis = async (asset: Asset): Promise<PredictiveAnalysis> => {
     if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve({
            failureMode: "Mock: Motor Bearing Seizure due to Overheating",
            timeframe: "Within the next 48-72 hours",
            recommendation: "Immediately schedule maintenance to inspect and lubricate motor bearings. Consider reducing operational load by 20% until the issue is resolved."
        }), 1500));
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: generatePredictivePrompt(asset),
            config: { responseMimeType: "application/json", temperature: 0.7 }
        });

        const parsedData = parseJsonResponse(response.text);

        if (parsedData && 'failureMode' in parsedData && 'timeframe' in parsedData && 'recommendation' in parsedData) {
            return parsedData;
        } else {
             throw new Error("Invalid JSON format for predictive analysis received from API");
        }

    } catch (error) {
        console.error("Error fetching predictive analysis from Gemini API:", error);
        throw new Error("Failed to get predictive analysis.");
    }
}