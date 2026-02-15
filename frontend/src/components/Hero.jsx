import React from 'react';

const Hero = () => {
  const handleScroll = () => {
    const element = document.getElementById('new-arrivals');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-[88vh] flex items-center overflow-hidden 
      bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a]">

      {/* Chair Image */}
      <div className="absolute left-0 w-1/2 h-full flex items-center justify-center z-10 p-10">
        <img 
          src="/chair.png" 
          alt="Wood Chair" 
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        />
      </div>

      {/* Text Content */}
      <div className="w-full flex justify-end pr-28 z-20">
        <div className="w-[40%] text-left">
          
          <p className="text-orange-500 text-sm font-bold tracking-[0.50em] mb-6 uppercase">
            Future Living Space
          </p>

          <h1 className="text-white text-[52px] font-light leading-[1.15] mb-12 uppercase">
            Wood Minimalist <br />
            <span className="opacity-60 font-extralight text-[52px]">
              Chair Design
            </span>
          </h1>

          <button 
            onClick = { handleScroll }
            className="border border-white text-white px-15 py-4 uppercase text-xs tracking-[0.2em]
            hover:bg-white hover:text-black transition-all duration-300">
            Shop Now
          </button>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;
