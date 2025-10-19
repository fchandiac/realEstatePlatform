import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import FontAwesome from "@/components/FontAwesome/FontAwesome";

const Wsp: React.FC = () => (
  <button
    className="fixed bottom-6 right-6 z-60 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center text-white text-3xl transition-colors"
    aria-label="Contactar por WhatsApp"
    data-test-id="wsp-button"
    onClick={() => window.open('https://wa.me/56912345678', '_blank')}
  >
    {/* Simple inline emoji icon to avoid external fontawesome dependency */}
       <FontAwesomeIcon icon={faWhatsapp} />
  </button>
);

export default Wsp;
