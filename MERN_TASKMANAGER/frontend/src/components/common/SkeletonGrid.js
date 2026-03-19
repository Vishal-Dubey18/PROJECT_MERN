import React from 'react';

function SkeletonCard() {
  return (
    <div style={{
      background:'rgba(12,18,32,0.8)',
      border:'1px solid rgba(79,142,247,0.08)',
      borderRadius:'18px',
      padding:'22px',
      display:'flex',flexDirection:'column',gap:14,
    }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
        <div className="skeleton" style={{ width:'55%',height:17 }} />
        <div className="skeleton" style={{ width:72,height:22,borderRadius:99 }} />
      </div>
      <div className="skeleton" style={{ width:'88%',height:13 }} />
      <div className="skeleton" style={{ width:'65%',height:13 }} />
      <div style={{ display:'flex',gap:8,marginTop:4 }}>
        <div className="skeleton" style={{ width:70,height:22,borderRadius:99 }} />
        <div className="skeleton" style={{ width:90,height:22,borderRadius:99 }} />
      </div>
      <div style={{ display:'flex',gap:8,paddingTop:12,borderTop:'1px solid rgba(79,142,247,0.06)' }}>
        <div className="skeleton" style={{ flex:1,height:34,borderRadius:10 }} />
        <div className="skeleton" style={{ width:36,height:34,borderRadius:10 }} />
        <div className="skeleton" style={{ width:36,height:34,borderRadius:10 }} />
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
