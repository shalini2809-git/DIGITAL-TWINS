import React, { useState } from 'react';
import { Card } from '../common/Card';
import { MOCK_ASSETS } from '../../constants';
import { Asset } from '../../types';
import { AssetDetailModal } from '../AssetDetailModal';

const StatusBadge: React.FC<{ status: 'Online' | 'Offline' | 'Warning' }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  const colorClasses = {
    Online: 'bg-green-500/20 text-green-400',
    Offline: 'bg-red-500/20 text-red-400',
    Warning: 'bg-yellow-500/20 text-yellow-400',
  };
  return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
};

const AssetRow: React.FC<{ asset: Asset; onDetailsClick: () => void }> = ({ asset, onDetailsClick }) => (
  <tr className="border-b border-border-color hover:bg-primary">
    <td className="p-4 text-text-primary">{asset.id}</td>
    <td className="p-4 text-text-primary font-medium">{asset.name}</td>
    <td className="p-4 text-text-secondary">{asset.type}</td>
    <td className="p-4"><StatusBadge status={asset.status} /></td>
    <td className="p-4 text-text-primary">{asset.performance}%</td>
    <td className="p-4">
      <button onClick={onDetailsClick} className="text-accent hover:text-accent-hover font-medium">Details</button>
    </td>
  </tr>
);

export const AssetsView: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <>
      <Card title="Asset Inventory">
        <div className="mb-4 flex justify-end">
          <button className="bg-accent text-brand-secondary px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium">
            + Add New Asset
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-text-secondary uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Performance (OEE)</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ASSETS.map(asset => <AssetRow key={asset.id} asset={asset} onDetailsClick={() => setSelectedAsset(asset)} />)}
            </tbody>
          </table>
        </div>
      </Card>
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </>
  );
};