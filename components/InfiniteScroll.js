import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * InfiniteScroll component that loads more content when the user scrolls to the bottom
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @param {boolean} props.hasMore - Whether there are more items to load
 * @param {Function} props.loadMore - Function to call when more items need to be loaded
 * @param {boolean} props.loading - Whether items are currently being loaded
 * @param {number} props.threshold - Distance from the bottom (in pixels) to trigger loading more items
 * @param {string} props.className - Additional CSS classes
 */
const InfiniteScroll = ({ 
  children, 
  hasMore, 
  loadMore, 
  loading, 
  threshold = 200,
  className = ""
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && hasMore && !loading) {
      loadMore();
    }
  }, [isVisible, hasMore, loadMore, loading]);

  return (
    <div className={className}>
      {children}
      
      {(hasMore || loading) && (
        <div 
          ref={containerRef} 
          className="py-4 flex justify-center items-center"
        >
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Loading more notes...</p>
            </div>
          ) : (
            <div className="h-10" /> // Invisible element for intersection observer
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll; 