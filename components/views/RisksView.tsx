
import React from 'react';
import { Card } from '../common/Card';
import { MOCK_RISKS } from '../../constants';
import { Risk } from '../../types';

const PriorityBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const colorClasses = {
        Low: 'bg-blue-500/20 text-blue-400',
        Medium: 'bg-yellow-500/20 text-yellow-400',
        High: 'bg-red-500/20 text-red-400',
    };
    return <span className={`${baseClasses} ${colorClasses[level]}`}>{level}</span>;
};

const RiskRow: React.FC<{ risk: Risk }> = ({ risk }) => (
    <tr className="border-b border-border-color hover:bg-primary">
        <td className="p-4 text-text-primary font-medium">{risk.description}</td>
        <td className="p-4 text-text-secondary">{risk.assetName}</td>
        <td className="p-4"><PriorityBadge level={risk.probability} /></td>
        <td className="p-4"><PriorityBadge level={risk.impact} /></td>
        <td className="p-4 text-text-secondary text-sm">{risk.mitigation}</td>
    </tr>
);

export const RisksView: React.FC = () => {
    return (
        <Card title="Risk Assessment">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-text-secondary uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-2/5">Risk Description</th>
                            <th className="p-4">Associated Asset</th>
                            <th className="p-4">Probability</th>
                            <th className="p-4">Impact</th>
                            <th className="p-4 w-1/3">Mitigation Strategy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_RISKS.map(risk => <RiskRow key={risk.id} risk={risk} />)}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
