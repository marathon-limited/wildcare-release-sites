'use client';
import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 'calc(100vh - 210px)', minHeight: 440, borderRadius: 9,
        border: '1px solid #dfe6e2', background: '#eef3f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5f6f68',
      }}
    >
      Loading map…
    </div>
  ),
});

export default MapInner;
