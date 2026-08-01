import React from "react";
import "./Banner.css";

/**
 * Banner
 * A wide promotional banner: architectural photo left, fountain photo right,
 * elegant serif headline + CTAs centered on a soft cream background.
 * Styles live in Banner.css (plain CSS, no Tailwind needed).
 *
 * Usage:
 *   <Banner
 *     leftImage="/images/palace.jpg"
 *     rightImage="/images/fountain.jpg"
 *     onGetQuote={() => {}}
 *     onDiscuss={() => {}}
 *   />
 */
export default function Banner({
  eyebrow = "Let's create something",
  headline = "Extraordinary together.",
  subtitle = "Share your vision with us and we will craft it with perfection.",
  primaryCta = "Get a free quote",
  secondaryCta = "Discuss your project",
  leftImage = "https://picsum.photos/seed/palace-arch/500/500",
  rightImage = "https://picsum.photos/seed/fountain-arch/500/500",
  onGetQuote,
  onDiscuss,
}) {
  return (
    <section className="banner">
      <div className="banner__side banner__side--left">
        <img src={leftImage} alt="" aria-hidden="true" />
        <div className="banner__fade" />
        <div className="banner__wash" />
      </div>

      <div className="banner__side banner__side--right">
        <img src={rightImage} alt="" aria-hidden="true" />
        <div className="banner__fade" />
        <div className="banner__wash" />
      </div>

      <div className="banner__content">
        <p className="banner__eyebrow">{eyebrow}</p>
        <h1 className="banner__headline">{headline}</h1>
        <p className="banner__subtitle">{subtitle}</p>

        <div className="banner__actions">
          <button
            type="button"
            className="banner__btn banner__btn--primary"
            onClick={onGetQuote}
          >
            {primaryCta}
          </button>
          <button
            type="button"
            className="banner__btn banner__btn--secondary"
            onClick={onDiscuss}
          >
            {secondaryCta}
          </button>
        </div>
      </div>
    </section>
  );
}
