import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';
import { MOCK_ASSETS } from '../../constants';
import { SimulationResult, Asset } from '../../types';

interface Scenario {
    id: number;
    name: string;
    stress: number;
    data: SimulationResult[];
    color: string;
}

const generateSimulationData = (stress: number): SimulationResult[] => {
    const data: SimulationResult[] = [];
    let value = 50 + Math.random() * 10 - 5;
    for (let i = 0; i <= 60; i++) {
        const fluctuation = (Math.random() - 0.5) * (stress / 5);
        const trend = (stress / 75) * (i / 60) * Math.sin(i / 10);
        value += fluctuation + trend;
        value = Math.max(0, Math.min(100, value));
        data.push({ time: i, value: parseFloat(value.toFixed(2)) });
    }
    return data;
};

const SCENARIO_COLORS = ['#FFDF00', '#3FB950', '#F78166', '#A371F7', '#D29922'];

export const SimulationsView: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(MOCK_ASSETS[0]);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [nextScenarioId, setNextScenarioId] = useState<number>(1);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    
    const handleAddScenario = () => {
        const newScenario: Scenario = {
            id: nextScenarioId,
            name: `Scenario ${nextScenarioId}`,
            stress: 50,
            data: [],
            color: SCENARIO_COLORS[(nextScenarioId-1) % SCENARIO_COLORS.length],
        };
        setScenarios([...scenarios, newScenario]);
        setNextScenarioId(nextScenarioId + 1);
    };

    const handleUpdateStress = (id: number, stress: number) => {
        setScenarios(scenarios.map(s => s.id === id ? { ...s, stress } : s));
    };

    const handleRemoveScenario = (id: number) => {
        setScenarios(scenarios.filter(s => s.id !== id));
    };

    const handleRunSimulations = useCallback(() => {
        if (!selectedAsset || scenarios.length === 0) return;
        setIsRunning(true);
        setTimeout(() => {
            const updatedScenarios = scenarios.map(s => ({
                ...s,
                data: generateSimulationData(s.stress),
            }));
            setScenarios(updatedScenarios);
            setIsRunning(false);
        }, 1500);
    }, [selectedAsset, scenarios]);
    
    const allData = scenarios.flatMap(s => s.data);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card title="Simulation Setup">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="asset-select" className="block text-sm font-medium text-text-secondary mb-2">Select Asset</label>
                            <select
                                id="asset-select"
                                value={selectedAsset?.id || ''}
                                onChange={(e) => setSelectedAsset(MOCK_ASSETS.find(a => a.id === e.target.value) || null)}
                                className="w-full bg-primary border border-border-color rounded-lg p-2 text-text-primary focus:ring-accent focus:border-accent"
                            >
                                {MOCK_ASSETS.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleAddScenario}
                            className="w-full bg-secondary text-text-primary border border-border-color font-medium py-2 rounded-lg hover:bg-border-color transition-colors"
                        >
                            + Add Scenario
                        </button>
                    </div>
                </Card>
                <Card title="Scenarios" className="flex-grow">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {scenarios.map((s, index) => (
                             <div key={s.id} className="p-3 bg-primary rounded-lg">
                                 <div className="flex justify-between items-center mb-2">
                                     <h4 className="font-semibold" style={{color: s.color}}>{s.name}</h4>
                                     <button onClick={() => handleRemoveScenario(s.id)} className="text-xs text-text-secondary hover:text-red-400">Remove</button>
                                 </div>
                                 <label htmlFor={`stress-${s.id}`} className="block text-sm font-medium text-text-secondary mb-1">Stress Level ({s.stress})</label>
                                 <input type="range" id={`stress-${s.id}`} min="1" max="100" value={s.stress} onChange={e => handleUpdateStress(s.id, parseInt(e.target.value))} className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer" style={{accentColor: s.color}}/>
                             </div>
                        ))}
                         {scenarios.length === 0 && <p className="text-center text-text-secondary">Add a scenario to begin.</p>}
                    </div>
                     {scenarios.length > 0 && <button
                        onClick={handleRunSimulations}
                        disabled={isRunning || !selectedAsset}
                        className="w-full bg-accent text-brand-secondary font-bold py-3 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed mt-4"
                    >
                        {isRunning ? 'Running Simulations...' : 'Run All Simulations'}
                    </button>}
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Simulation Results Comparison">
                    <div className="h-[34rem]">
                       {allData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                                    <XAxis dataKey="time" type="number" domain={[0, 60]} stroke="#8B949E" unit="min" />
                                    <YAxis stroke="#8B949E" unit="%" domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                                    <Legend wrapperStyle={{color: '#C9D1D9'}}/>
                                    {scenarios.map(s => (
                                        <Line key={s.id} type="monotone" dataKey="value" data={s.data} name={s.name} stroke={s.color} strokeWidth={2} dot={false} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                {isRunning ? "Generating simulation data..." : "Add and run scenarios to see results."}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};