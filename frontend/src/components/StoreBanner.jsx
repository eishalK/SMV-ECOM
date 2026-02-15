import React from 'react';

const StoreBanner = () => {
    return (
    <section id="storebanner" className="relative w-full aspect-[16/9] md:aspect-[21/9] flex items-center justify-start overflow-hidden bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[30%] brightness-[0.4]"
        style={{ 
          backgroundImage: "url('/background1.jpeg')",
          backgroundAttachment: 'fixed' 
        }}
      ></div>

    
      <div className="container mx-auto h-full flex items-center justify-start px-4 md:px-20 relative z-10">
        
        {/* Contact Us */}
        <div className="bg-white p-12 md:p-16 max-w-md w-full shadow-2xl animate-fadeIn">
          <h4 className="text-[10px] font-bold tracking-[0.3em] text-black uppercase mb-4">
            Hello Customer!
          </h4>
          <h2 className="text-3xl font-bold text-black mb-8 uppercase tracking-tight">
            Visit Our Store
          </h2>
          
          <div className="space-y-4 text-gray-500 text-xs tracking-wider mb-10 leading-relaxed">
            <p>21 W. 46th St., Karachi, Pakistan</p>
            <p className="hover:text-[#f25a2b] cursor-pointer transition-colors">DecoMart@gmail.com</p>
            <p>+92 (000) 3333 4567</p>
          </div>

          <button className="bg-[#f25a2b] text-white px-10 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-black transition-all duration-300">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoreBanner;