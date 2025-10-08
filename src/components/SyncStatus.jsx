import React, { useState, useEffect } from 'react';
import syncStorage from '../services/syncStorage';

const SyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    lastSync: 0,
    hasData: false
  });

  useEffect(() => {
    // Get initial status
    const updateStatus = () => {
      setSyncStatus(syncStorage.getSyncStatus());
    };

    updateStatus();

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'text-red-500';
    if (syncStatus.lastSync === 0) return 'text-yellow-500';
    const timeSinceSync = Date.now() - syncStatus.lastSync;
    if (timeSinceSync > 60000) return 'text-yellow-500'; // More than 1 minute
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return '🔴';
    if (syncStatus.lastSync === 0) return '🟡';
    const timeSinceSync = Date.now() - syncStatus.lastSync;
    if (timeSinceSync > 60000) return '🟡';
    return '🟢';
  };

  const handleForceSync = async () => {
    try {
      await syncStorage.forceSync();
      setSyncStatus(syncStorage.getSyncStatus());
    } catch (error) {
      console.warn('Force sync failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-gray-500">Sync:</span>
      <span className={getStatusColor()}>
        {getStatusIcon()} {formatLastSync(syncStatus.lastSync)}
      </span>
      <button
        onClick={handleForceSync}
        className="text-blue-500 hover:text-blue-700 text-xs underline"
        title="Force sync now"
      >
        Sync Now
      </button>
    </div>
  );
};

export default SyncStatus;
