import { useEffect } from "react";

const AdSenseAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("AdSense error:", err);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7820681080990556"
        data-ad-slot="4392732261"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseAd;