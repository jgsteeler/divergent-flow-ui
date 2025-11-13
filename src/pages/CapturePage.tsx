import { useState } from 'react';
import type { Theme } from '../theme';
import SingleCaptureForm from '../components/SingleCaptureForm';
import BulkCaptureForm from '../components/BulkCaptureForm';
import CaptureGrid from '../components/CaptureGrid';

interface CapturePageProps {
  theme: Theme;
}

type TabType = 'single' | 'bulk' | 'list';

export default function CapturePage({ theme }: CapturePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCaptureCreated = () => {
    // Trigger refresh of capture list
    setRefreshTrigger(prev => prev + 1);
    // Switch to list tab to show the new capture
    setActiveTab('list');
  };

  const tabStyle = (tab: TabType) => ({
    padding: '12px 24px',
    background: activeTab === tab ? theme.primary : 'transparent',
    color: activeTab === tab ? theme.background : theme.text,
    border: 'none',
    borderBottom: activeTab === tab ? 'none' : `2px solid ${theme.secondary}`,
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: activeTab === tab ? 600 : 400,
    transition: 'all 0.2s',
    borderRadius: activeTab === tab ? '8px 8px 0 0' : '0',
  });

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ color: theme.primary, marginBottom: '24px' }}>Capture Management</h1>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: `2px solid ${theme.secondary}`,
          marginBottom: '24px',
        }}
      >
        <button onClick={() => setActiveTab('single')} style={tabStyle('single')}>
          📝 Single Capture
        </button>
        <button onClick={() => setActiveTab('bulk')} style={tabStyle('bulk')}>
          📋 Bulk Capture
        </button>
        <button onClick={() => setActiveTab('list')} style={tabStyle('list')}>
          📂 View Captures
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'single' && (
          <SingleCaptureForm theme={theme} onCaptureCreated={handleCaptureCreated} />
        )}
        {activeTab === 'bulk' && (
          <BulkCaptureForm theme={theme} onCapturesCreated={handleCaptureCreated} />
        )}
        {activeTab === 'list' && (
          <CaptureGrid theme={theme} refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
}
