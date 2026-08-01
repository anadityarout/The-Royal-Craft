import React from "react";
import "./Client.css";
import { Truck, Package, UserCheck, Clock3, ShieldCheck } from "lucide-react";

const testimonials = [
  { id: 1, text: "The quality and detailing of their work is beyond exceptional. They truly understand the value of design and commitment.", name: "Ar. Rajesh Sharma", role: "Architect, Jaipur", avatar: "https://randomuser.me/api/portraits/men/1.jpg", rating: 5 },
  { id: 2, text: "From design to installation, the entire process was seamless. The team is professional, skilled and very cooperative.", name: "Priya Mehta", role: "Interior Designer, Lucknow", avatar: "https://randomuser.me/api/portraits/women/1.jpg", rating: 5 },
  { id: 3, text: "Their in-house manufacturing gives them an edge in quality and customization. Highly recommended!", name: "Vivek Agarwal", role: "Developer, Indore", avatar: "https://randomuser.me/api/portraits/men/2.jpg", rating: 5 },
  { id: 4, text: "We have worked on multiple projects together and every time they exceed expectations with their craftsmanship and finishing.", name: "Neha Bansal", role: "Founder, Studio Bansal, Mumbai", avatar: "https://randomuser.me/api/portraits/women/2.jpg", rating: 5 },
  { id: 5, text: "Outstanding craftsmanship and attention to detail. Our resort's entrance gate is now the talk of the town.", name: "Arjun Khanna", role: "Founder, Lumière Studios, Delhi", avatar: "https://randomuser.me/api/portraits/men/3.jpg", rating: 5 },
  { id: 6, text: "Professional team, timely delivery, and impeccable finishing. Couldn't have asked for more.", name: "Sanjana Rao", role: "Project Manager, Hyderabad", avatar: "https://randomuser.me/api/portraits/women/3.jpg", rating: 5 },
  { id: 7, text: "Their fiber work looks exactly like stone carving. Guests can't tell the difference!", name: "Manish Trivedi", role: "Hotelier, Udaipur", avatar: "https://randomuser.me/api/portraits/men/4.jpg", rating: 5 },
  { id: 8, text: "A trusted partner for all our wedding venue decor needs. Always consistent quality.", name: "Kavita Malhotra", role: "Event Planner, Chandigarh", avatar: "https://randomuser.me/api/portraits/women/4.jpg", rating: 5 },
  { id: 9, text: "The custom mandap they built for our client exceeded every expectation.", name: "Rohit Deshmukh", role: "Wedding Designer, Pune", avatar: "https://randomuser.me/api/portraits/men/5.jpg", rating: 5 },
  { id: 10, text: "Reliable, creative, and always on schedule. Our go-to vendor for facades.", name: "Ayesha Siddiqui", role: "Architect, Bhopal", avatar: "https://randomuser.me/api/portraits/women/5.jpg", rating: 5 },
  { id: 11, text: "Incredible attention to detail on our palace-themed banquet hall.", name: "Devendra Rathore", role: "Resort Owner, Jodhpur", avatar: "https://randomuser.me/api/portraits/men/6.jpg", rating: 5 },
  { id: 12, text: "Their fountains and water features transformed our garden completely.", name: "Meera Iyer", role: "Landscape Designer, Chennai", avatar: "https://randomuser.me/api/portraits/women/6.jpg", rating: 5 },
  { id: 13, text: "Exceptional craftsmanship at a fair price. Highly recommend The Royal Kraft.", name: "Karan Bhatia", role: "Contractor, Gurugram", avatar: "https://randomuser.me/api/portraits/men/7.jpg", rating: 5 },
  { id: 14, text: "Delivered a stunning custom statue collection right on time.", name: "Ritu Chawla", role: "Art Curator, Delhi", avatar: "https://randomuser.me/api/portraits/women/7.jpg", rating: 5 },
  { id: 15, text: "Their pan-India delivery and installation service is seamless.", name: "Aditya Nair", role: "Facilities Head, Kochi", avatar: "https://randomuser.me/api/portraits/men/8.jpg", rating: 5 },
  { id: 16, text: "The best fiber craftsmanship team we've worked with in years.", name: "Simran Kaur", role: "Interior Architect, Amritsar", avatar: "https://randomuser.me/api/portraits/women/8.jpg", rating: 5 },
  { id: 17, text: "They understood our vision instantly and executed it flawlessly.", name: "Nikhil Shah", role: "Real Estate Developer, Surat", avatar: "https://randomuser.me/api/portraits/men/9.jpg", rating: 5 },
  { id: 18, text: "Beautiful gazebo and pavilion work for our farmhouse project.", name: "Pooja Verma", role: "Homeowner, Dehradun", avatar: "https://randomuser.me/api/portraits/women/9.jpg", rating: 5 },
  { id: 19, text: "Consistent quality across every single project we've collaborated on.", name: "Farhan Ali", role: "Site Engineer, Lucknow", avatar: "https://randomuser.me/api/portraits/men/10.jpg", rating: 5 },
  { id: 20, text: "Truly royal finishing — worth every rupee spent on this project.", name: "Ananya Sen", role: "Client, Kolkata", avatar: "https://randomuser.me/api/portraits/women/10.jpg", rating: 5 },
];

const trustBadges = [
  { icon: Truck, title: "PAN INDIA", subtitle: "DELIVERY" },
  { icon: Package, title: "SAFE & SECURE", subtitle: "PACKING" },
  { icon: UserCheck, title: "EXPERT INSTALLATION", subtitle: "TEAM" },
  { icon: Clock3, title: "ON TIME", subtitle: "DELIVERY" },
  { icon: ShieldCheck, title: "DEDICATED AFTER", subtitle: "SALES SUPPORT" },
];

const Client = () => {
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="rk-client-section">
      <div className="rk-client-bg">
        <img
          src="https://picsum.photos/1600/500?random=80"
          alt="Royal Kraft craftsmanship"
          className="rk-client-bg-img"
        />
        <div className="rk-client-overlay"></div>
      </div>

      <div className="rk-client-content">
        <div className="rk-client-header">
          <span className="rk-client-tag">WHAT OUR CLIENTS SAY</span>
          <h2 className="rk-client-title">
            TRUSTED BY ARCHITECTS, LOVED BY CLIENTS
          </h2>
        </div>

        <div className="rk-client-marquee-wrapper">
          <div className="rk-client-marquee-track">
            {marqueeItems.map((t, i) => (
              <div className="rk-client-card" key={`${t.id}-${i}`}>
                <div className="rk-client-quote">&#8220;</div>

                <p className="rk-client-text">{t.text}</p>

                <div className="rk-client-stars">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>

                <div className="rk-client-person">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="rk-client-avatar"
                  />
                  <div>
                    <div className="rk-client-name">{t.name}</div>
                    <div className="rk-client-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges strip */}
        <div className="rk-client-badges">
          {trustBadges.map((b, i) => {
            const Icon = b.icon;
            return (
              <React.Fragment key={i}>
                <div className="rk-client-badge">
                  <Icon className="rk-client-badge-icon" size={26} strokeWidth={1.5} />
                  <div className="rk-client-badge-text">
                    <span>{b.title}</span>
                    <span>{b.subtitle}</span>
                  </div>
                </div>
                {i < trustBadges.length - 1 && (
                  <div className="rk-client-badge-divider"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Client;