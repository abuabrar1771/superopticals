import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const images = [
    assets.hero_fastrack,
    assets.hero_oakley,
    assets.hero_rayban,
    assets.hero_eyeglasses,
    assets.hero_contactlens,
    assets.hero_clipon,
    assets.hero_bauch,
    assets.hero_zeiss
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-[40vh] sm:h-[50vh] md:h-[80vh] w-full bg-black p-1">
      <div className="relative h-full w-full overflow-hidden border border-white/30 rounded-2xl">
        {/* Images */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="banner"
            className={`absolute inset-0 w-full h-full object-contain sm:object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
