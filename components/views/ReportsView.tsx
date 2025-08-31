import React, { useState } from 'react';
import { Card } from '../common/Card';
import { MOCK_ASSETS, MOCK_RISKS } from '../../constants';

const PerformanceReport: React.FC = () => (
    <div>
        <h4 className="text-lg font-semibold text-accent mb-4">Monthly Performance Report</h4>
        <p className="text-text-secondary mb-4">Summary of asset performance for the last 30 days.</p>
        <ul className="space-y-2">
            {MOCK_ASSETS.map(asset => (
                <li key={asset.id} className="flex justify-between p-2 rounded-md bg-primary">
                    <span>{asset.name}</span>
                    <span className={`font-bold ${asset.performance > 85 ? 'text-green-400' : asset.performance > 70 ? 'text-yellow-400' : 'text-red-400'}`}>{asset.performance}% OEE</span>
                </li>
            ))}
        </ul>
    </div>
);

const RiskReport: React.FC = () => (
     <div>
        <h4 className="text-lg font-semibold text-accent mb-4">Active Risks Summary</h4>
        <p className="text-text-secondary mb-4">Overview of all identified operational risks.</p>
        <ul className="space-y-2">
            {MOCK_RISKS.map(risk => (
                 <li key={risk.id} className="p-2 rounded-md bg-primary">
                    <p><strong>{risk.description}</strong> on <span className="text-accent">{risk.assetName}</span></p>
                    <p className="text-sm text-text-secondary">Impact: {risk.impact}, Probability: {risk.probability}</p>
                </li>
            ))}
        </ul>
    </div>
);

export const ReportsView: React.FC = () => {
    const [reportType, setReportType] = useState('performance');

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <Card title="Generate Report">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="report-type" className="block text-sm font-medium text-text-secondary mb-2">Report Type</label>
                            <select
                                id="report-type"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full bg-primary border border-border-color rounded-lg p-2 text-text-primary focus:ring-accent focus:border-accent"
                            >
                                <option value="performance">Performance Report</option>
                                <option value="risk">Risk Summary</option>
                                <option value="simulation" disabled>Simulation Log (soon)</option>
                            </select>
                        </div>
                        <button className="w-full bg-accent text-brand-secondary font-bold py-2 rounded-lg hover:bg-accent-hover transition-colors">
                            Download Report
                        </button>
                    </div>
                </Card>
            </div>
            <div className="md:col-span-3">
                <Card title="Report Preview">
                    <div className="h-96 overflow-y-auto p-4 bg-primary rounded-lg">
                        {reportType === 'performance' && <PerformanceReport />}
                        {reportType === 'risk' && <RiskReport />}
                    </div>
                </Card>
            </div>
        </div>
    );
};