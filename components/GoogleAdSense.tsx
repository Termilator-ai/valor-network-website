import Script from "next/script"

interface GoogleAdSenseProps {
  publisherId: string
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  return (
    <Script
      id="adsense-script"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  )
}
