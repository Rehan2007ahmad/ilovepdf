import React from "react";
import Features from "@/Components/Features";
import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import WhatWeDo from "@/Components/WhatWeDo";


export default function Home() {
  return (
    <>
    <div className="bg-gray-900">
    <Navbar/>
    <Hero/>
    <Features />
    <WhatWeDo/>
    <Footer/>
    </div>
    </>
  );
}
