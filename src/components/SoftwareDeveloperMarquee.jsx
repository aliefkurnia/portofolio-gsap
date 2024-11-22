import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import "./SoftwareDeveloperMarquee.css"; 

const SoftwareDeveloperMarquee = () => {
  useEffect(() => {
    // Mengambil baris yang mengandung kategori "Development"
    const developmentRow = document.querySelector('.cb-tagreel-row');
    
    // Menentukan lebar baris dan lebar item
    let rowWidth = developmentRow.getBoundingClientRect().width;
    let rowItemWidth = developmentRow.children[0].getBoundingClientRect().width;

    // Menghitung offset awal dan nilai transisi untuk animasi
    let initialOffset = ((2 * rowItemWidth) / rowWidth) * 100 * -1;
    
    // Set posisi awal menggunakan GSAP
    gsap.set(developmentRow, {
      xPercent: initialOffset,
    });

    let duration = 5; // Durasi untuk animasi
    var tl = gsap.timeline();

    tl.to(developmentRow, {
      ease: 'none',
      duration: duration,
      xPercent: 0,
      repeat: -1, // Mengulang animasi tanpa henti
    });
  }, []);

  return (
    <section className="cb-tagreel">
      <div className="cb-tagreel-content">
        <div className="cb-tagreel-items" role="marquee">
          <div className="cb-tagreel-row">
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareDeveloperMarquee;
