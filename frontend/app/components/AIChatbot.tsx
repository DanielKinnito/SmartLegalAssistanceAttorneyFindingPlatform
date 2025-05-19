'use client'
import { useState } from 'react';
import Image from 'next/image';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-gray-700 font-semibold border border-gray-100">
          Need legal assistance? Ask me anything!
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#bfa14e] text-white p-4 rounded-full shadow-lg hover:bg-[#99813e] transition flex items-center justify-center"
        >
          <Image
            src="/chatbot.svg"
            alt="AI Legal Assistant"
            width={24}
            height={24}
            className="invert"
          />
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;