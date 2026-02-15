import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoBedOutline, IoFileTrayStackedOutline, IoLibraryOutline, IoWineOutline, IoBulbOutline, IoDesktopOutline } from "react-icons/io5";

const categories = [
  { id: 1, name: "LIVING ROOM", icon: <IoFileTrayStackedOutline size={40} /> },
  { id: 2, name: "BEDROOM", icon: <IoBedOutline size={40} /> },
  { id: 3, name: "INTERIOR", icon: <IoLibraryOutline size={40} /> },
  { id: 4, name: "KITCHEN", icon: <IoWineOutline size={40} /> },
  { id: 5, name: "BATHROOM", icon: <IoLibraryOutline size={40} /> },
  { id: 6, name: "LIGHTING", icon: <IoBulbOutline size={40} /> },
  { id: 7, name: "OFFICE", icon: <IoDesktopOutline size={40} /> },
];

const Categories = () => {
  const scrollRef = useRef(null);

  // Logic to slide the container left or right
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-16 bg-white px-4 md:px-10">
      <div className="container mx-auto flex items-center group">
        
        {/* Left Button */}
        <button 
          onClick={() => scroll('left')}
          className="p-3 rounded-full border border-gray-200 bg-white hover:bg-black hover:text-white transition-all z-10 shadow-sm"
        >
          <FiChevronLeft size={24} />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 px-4 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[200px] h-[200px] bg-[#f8f8f8] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100"
            >
              <div className="text-black mb-4 transition-transform duration-300 hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-black uppercase">
                {item.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button 
          onClick={() => scroll('right')}
          className="p-3 rounded-full border border-gray-200 bg-white hover:bg-black hover:text-white transition-all z-10 shadow-sm"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Categories;