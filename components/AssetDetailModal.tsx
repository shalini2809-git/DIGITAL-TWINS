import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { Modal } from './common/Modal';
import { Asset, PredictiveAnalysis } from '../types';
import { getPredictiveMaintenanceAnalysis } from '../services/geminiService';
import { IconSparkles } from '../constants';

interface AssetDetailModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge: React.FC<{ status: 'Online' | 'Offline' | 'Warning' }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  const colorClasses = {
    Online: 'bg-green-500/20 text-green-400',
    Offline: 'bg-red-500/20 text-red-400',
    Warning: 'bg-yellow-500/20 text-yellow-400',
  };
  return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
};

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
);

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, isOpen, onClose }) => {
    const [liveData, setLiveData] = useState<{ time: number, temp: number }[]>([]);
    const [analysis, setAnalysis] = useState<PredictiveAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simulate live data feed for a key parameter
    useEffect(() => {
        if (!isOpen) return;
        setAnalysis(null);
        setError(null);
        const initialTemp = parseFloat(asset.operationalParameters.find(p => p.key.includes('Temp'))?.value || '50');
        const data: { time: number, temp: number }[] = [];
        for(let i=0; i<20; i++) {
            data.push({ time: i, temp: initialTemp + (Math.random() - 0.5) * (asset.status === 'Warning' ? 5 : 1) });
        }
        setLiveData(data);

        const interval = setInterval(() => {
            setLiveData(prevData => {
                const newData = [...prevData.slice(1), {
                    time: (prevData[prevData.length-1]?.time || 0) + 1,
                    temp: initialTemp + (Math.random() - 0.5) * (asset.status === 'Warning' ? 5 : 1)
                }];
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [asset, isOpen]);

    const handleRunAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await getPredictiveMaintenanceAnalysis(asset);
            setAnalysis(result);
        } catch(e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [asset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Asset Details: ${asset.name}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Live Data ({asset.operationalParameters.find(p => p.key.includes('Temp'))?.key || 'Parameter'})</h3>
                <div className="p-4 bg-primary rounded-lg h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                            <XAxis dataKey="time" stroke="#8B949E" tick={false} />
                            <YAxis stroke="#8B949E" domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                            <Line type="monotone" dataKey="temp" name={asset.operationalParameters.find(p => p.key.includes('Temp'))?.key} stroke="#FFDF00" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-primary rounded-lg">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Operational Parameters</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {asset.operationalParameters.map(param => (
                             <p key={param.key}><span className="text-text-secondary">{param.key}:</span> <span className="font-medium text-text-primary">{param.value}</span></p>
                        ))}
                    </div>
                </div>
            </div>
             <div>
                 <h3 className="text-lg font-semibold text-text-primary mb-3">Asset Information</h3>
                 <div className="p-4 bg-primary rounded-lg space-y-3 text-sm">
                    <p><strong>ID:</strong> {asset.id}</p>
                    <p><strong>Type:</strong> {asset.type}</p>
                    <p><strong>Status:</strong> <StatusBadge status={asset.status} /></p>
                    <p><strong>Performance (OEE):</strong> {asset.performance}%</p>
                    <p><strong>Dimensions:</strong> {asset.dimensions}</p>
                    <div>
                        <h4 className="font-semibold mb-1">Specifications:</h4>
                        <ul className="list-disc list-inside text-text-secondary">
                           {asset.specifications.map(spec => <li key={spec.key}>{spec.key}: {spec.value}</li>)}
                        </ul>
                    </div>
                 </div>
                 {asset.status === 'Warning' && (
                     <div className="mt-4 p-4 bg-primary rounded-lg">
                         <h3 className="text-lg font-semibold text-accent mb-3 flex items-center">
                             <IconSparkles className="mr-2" />
                             Predictive Maintenance AI
                         </h3>
                         {isLoading ? <LoadingSpinner /> : error ? (
                             <p className="text-red-400">{error}</p>
                         ) : analysis ? (
                            <div className="space-y-2 text-sm">
                                <p><strong>Failure Mode:</strong> <span className="text-text-primary">{analysis.failureMode}</span></p>
                                <p><strong>Timeframe:</strong> <span className="text-text-primary">{analysis.timeframe}</span></p>
                                <p><strong>Recommendation:</strong> <span className="text-text-primary">{analysis.recommendation}</span></p>
                                <button onClick={handleRunAnalysis} className="text-accent text-xs hover:underline mt-2">Re-analyze</button>
                            </div>
                         ) : (
                             <>
                                <p className="text-text-secondary text-sm mb-4">This asset is in a 'Warning' state. Use our AI to predict potential failures.</p>
                                <button onClick={handleRunAnalysis} className="w-full bg-accent text-brand-secondary font-bold py-2 rounded-lg hover:bg-accent-hover transition-colors">Analyze Failure Risk</button>
                             </>
                         )}
                     </div>
                 )}
            </div>
        </div>
    </Modal>
  );
};