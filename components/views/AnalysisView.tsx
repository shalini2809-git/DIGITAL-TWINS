import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../common/Card';
import { MOCK_ASSETS } from '../../constants';
import { Asset } from '../../types';
import { getOptimizationSuggestions } from '../../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
    </div>
);

const AISuggestion: React.FC<{ title: string; suggestion: string }> = ({ title, suggestion }) => (
    <div className="bg-primary p-4 rounded-lg border border-border-color">
        <h4 className="font-semibold text-accent">{title}</h4>
        <p className="text-sm text-text-secondary mt-1">{suggestion}</p>
    </div>
);

export const AnalysisView: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(MOCK_ASSETS.find(a => a.status === 'Warning') || MOCK_ASSETS[0]);
    const [suggestions, setSuggestions] = useState<{ title: string; suggestion: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchSuggestions = useCallback(async () => {
        if (!selectedAsset) return;
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        try {
            const result = await getOptimizationSuggestions(selectedAsset);
            setSuggestions(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedAsset]);
    
    // Fetch suggestions when component mounts or selectedAsset changes
    useEffect(() => {
        handleFetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card title="Select Asset for Analysis">
                    <div className="space-y-4">
                        <select
                            id="asset-select-analysis"
                            value={selectedAsset?.id || ''}
                            onChange={(e) => setSelectedAsset(MOCK_ASSETS.find(a => a.id === e.target.value) || null)}
                            className="w-full bg-primary border border-border-color rounded-lg p-3 text-text-primary focus:ring-accent focus:border-accent"
                        >
                            {MOCK_ASSETS.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                        </select>
                        {selectedAsset && (
                            <div className="text-sm space-y-2 p-3 bg-primary rounded-lg">
                                <p><strong>Type:</strong> {selectedAsset.type}</p>
                                <p><strong>Status:</strong> <span className={selectedAsset.status === 'Warning' ? 'text-yellow-400' : 'text-text-secondary'}>{selectedAsset.status}</span></p>
                                <p><strong>Performance:</strong> {selectedAsset.performance}% OEE</p>
                            </div>
                        )}
                         <button
                            onClick={handleFetchSuggestions}
                            disabled={isLoading || !selectedAsset}
                            className="w-full bg-accent text-brand-secondary font-bold py-3 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? 'Analyzing...' : 'Re-analyze with AI'}
                        </button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title={`AI Optimization Suggestions for ${selectedAsset?.name || ''}`}>
                    <div className="h-96">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-red-400">
                                <p>{error}</p>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="space-y-4">
                                {suggestions.map((s, i) => (
                                    <AISuggestion key={i} title={s.title} suggestion={s.suggestion} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                No suggestions available. Try running an analysis.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};