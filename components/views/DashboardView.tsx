
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';
import { MOCK_ASSETS } from '../../constants';
import { View } from '../../types';

interface DashboardViewProps {
    setView: (view: View) => void;
}

const StatusIndicator: React.FC<{ status: 'Online' | 'Offline' | 'Warning' }> = ({ status }) => {
    const color = status === 'Online' ? 'bg-green-500' : status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500';
    return <span className={`w-3 h-3 rounded-full ${color} mr-2`}></span>;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ setView }) => {
    const onlineAssets = MOCK_ASSETS.filter(a => a.status === 'Online').length;
    const warningAssets = MOCK_ASSETS.filter(a => a.status === 'Warning').length;
    const offlineAssets = MOCK_ASSETS.filter(a => a.status === 'Offline').length;
    
    const performanceData = MOCK_ASSETS.map(asset => ({
        name: asset.name.split(' ')[0], // Shorten name for chart
        performance: asset.performance,
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Total Assets</h4>
                    <p className="text-4xl font-bold">{MOCK_ASSETS.length}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">System Status</h4>
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center"><StatusIndicator status="Online" /> Online: <span className="font-semibold ml-2">{onlineAssets}</span></div>
                        <div className="flex items-center"><StatusIndicator status="Warning" /> Warning: <span className="font-semibold ml-2">{warningAssets}</span></div>
                        <div className="flex items-center"><StatusIndicator status="Offline" /> Offline: <span className="font-semibold ml-2">{offlineAssets}</span></div>
                    </div>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Avg. Performance (OEE)</h4>
                    <p className="text-4xl font-bold">
                        {Math.round(MOCK_ASSETS.reduce((acc, a) => acc + a.performance, 0) / MOCK_ASSETS.length)}%
                    </p>
                </Card>
            </div>

            <Card title="Asset Performance Overview">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                            <XAxis dataKey="name" stroke="#8B949E" />
                            <YAxis stroke="#8B949E" unit="%" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
                                labelStyle={{ color: '#C9D1D9' }}
                            />
                            <Legend wrapperStyle={{color: '#C9D1D9'}}/>
                            <Bar dataKey="performance" fill="#58A6FF" name="Performance (OEE)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card title="Quick Actions">
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => setView(View.Assets)} className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors">Manage Assets</button>
                        <button onClick={() => setView(View.Simulations)} className="bg-secondary text-text-primary border border-border-color px-4 py-2 rounded-lg hover:bg-border-color transition-colors">Run Simulation</button>
                        <button onClick={() => setView(View.Reports)} className="bg-secondary text-text-primary border border-border-color px-4 py-2 rounded-lg hover:bg-border-color transition-colors">Generate Report</button>
                    </div>
                </Card>
                <Card title="Recent Activity">
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center"><span className="text-yellow-400 mr-2">WARN</span> Robotic Arm 3 motor temperature exceeded threshold.</li>
                        <li className="flex items-center"><span className="text-green-400 mr-2">INFO</span> Simulation 'Stress Test 1' completed on CNC Machine 7.</li>
                        <li className="flex items-center"><span className="text-red-400 mr-2">FAIL</span> Conveyor Belt 1 went offline unexpectedly.</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};
