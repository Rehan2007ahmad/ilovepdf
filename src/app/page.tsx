import React from "react";
import Features from "@/Components/Features";
import Hero from "@/Components/Hero";
import WhatWeDo from "@/Components/WhatWeDo";


export default function Home() {
  return (
    <>
    <div className="bg-gray-900">
    
    <Hero/>
    <Features />
    <WhatWeDo/>
    
    </div>
    </>
  );
}
