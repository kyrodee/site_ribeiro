export default function Loading() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', display: 'flex', gap: '2rem' }}>
      {/* Sidebar Skeleton */}
      <div className="sidebar-skeleton" style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="shimmer-box" style={{ height: '30px', width: '150px', borderRadius: '4px' }}></div>
        <div className="shimmer-box shimmer-bg-light" style={{ height: '20px', width: '100%', borderRadius: '4px' }}></div>
        <div className="shimmer-box shimmer-bg-light" style={{ height: '20px', width: '90%', borderRadius: '4px' }}></div>
        <div className="shimmer-box shimmer-bg-light" style={{ height: '20px', width: '80%', borderRadius: '4px' }}></div>
        
        <div className="shimmer-box" style={{ height: '30px', width: '150px', borderRadius: '4px', marginTop: '2rem' }}></div>
        <div className="shimmer-box shimmer-bg-light" style={{ height: '20px', width: '100%', borderRadius: '4px' }}></div>
        <div className="shimmer-box shimmer-bg-light" style={{ height: '20px', width: '90%', borderRadius: '4px' }}></div>
      </div>

      {/* Grid Skeleton */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div className="shimmer-box" style={{ height: '40px', width: '200px', borderRadius: '4px' }}></div>
          <div className="shimmer-box" style={{ height: '40px', width: '150px', borderRadius: '4px' }}></div>
        </div>

        <div className="grid-products">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: 0, border: '1px solid #e5e7eb' }}>
              <div className="shimmer-box" style={{ height: '200px', width: '100%' }}></div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="shimmer-box shimmer-bg-light" style={{ height: '15px', width: '40%', borderRadius: '4px' }}></div>
                <div className="shimmer-box" style={{ height: '20px', width: '100%', borderRadius: '4px' }}></div>
                <div className="shimmer-box" style={{ height: '20px', width: '80%', borderRadius: '4px' }}></div>
                <div className="shimmer-box" style={{ height: '35px', width: '100%', borderRadius: '4px', marginTop: '1rem' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-box {
          position: relative;
          overflow: hidden;
          background-color: #e5e7eb;
        }
        .shimmer-box::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 20%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
          content: '';
        }
        .shimmer-bg-light {
          background-color: #f3f4f6 !important;
        }
        @media (max-width: 992px) {
          .sidebar-skeleton {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
