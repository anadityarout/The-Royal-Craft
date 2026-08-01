import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  Award,
  Handshake,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import "./Counter.css";

const Counter = () => {
  const counters = [
    {
      icon: <Building2 size={45} />,
      value: 15000,
      suffix: "+",
      title: "SQ. FT. FACTORY",
    },
    {
      icon: <Award size={45} />,
      value: 750,
      suffix: "+",
      title: "MOLD DESIGNS",
    },
    {
      icon: <Handshake size={45} />,
      value: 112,
      suffix: "+",
      title: "SKILLED ARTISANS",
    },
    {
      icon: <MapPin size={45} />,
      text: "PAN INDIA",
      title: "DELIVERY & INSTALLATION",
    },
    {
      icon: <BadgeCheck size={45} />,
      value: 11,
      suffix: "+",
      title: "YEARS OF EXCELLENCE",
    },
  ];

  const [values, setValues] = useState(
    counters.map((item) => (item.value !== undefined ? 0 : ""))
  );

  const sectionRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          const duration = 10000; // 10 seconds
          const interval = 30;

          counters.forEach((counter, index) => {
            // Skip non-counter item
            if (counter.value === undefined) return;

            let current = 0;
            const increment = counter.value / (duration / interval);

            const timer = setInterval(() => {
              current += increment;

              if (current >= counter.value) {
                current = counter.value;
                clearInterval(timer);
              }

              setValues((prev) => {
                const updated = [...prev];
                updated[index] = Math.floor(current);
                return updated;
              });
            }, interval);
          });
        }
      },
      {
        threshold: 0.4,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="counter-section" ref={sectionRef}>
      <div className="counter-container">
        {counters.map((item, index) => (
          <div className="counter-card" key={index}>
            <div className="counter-icon">{item.icon}</div>

            <h2>
              {item.text ? (
                item.text
              ) : (
                <>
                  {values[index]}
                  {item.suffix}
                </>
              )}
            </h2>

            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Counter;