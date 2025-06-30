"use client"

import { useEffect } from "react"

export default function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error("Adsense error:", e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-3523990209984697"
      data-ad-slot="1108872383"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}
