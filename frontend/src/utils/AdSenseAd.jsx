import { useEffect, useRef, useState } from "react";

const AdSenseAd = () => {
  const [showAd, setShowAd] = useState(false);
  const containerRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showAd || pushed.current) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0 && !pushed.current) {
          pushed.current = true;
          observer.disconnect();
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.log("AdSense error:", err);
          }
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [showAd]);

  if (!showAd) return null;

  return (
    <div ref={containerRef} className="my-6 w-full flex min-h-25">
      <div className="w-full max-w-2xl mx-auto">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-7820681080990556"
          data-ad-slot="4392732261"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdSenseAd;
