import "./WhyFiber.css";

const ADVANTAGES = [
  {
    no: "01",
    title: "Lightweight",
    text: "Reduced structural weight and easier handling.",
  },
  {
    no: "02",
    title: "Durable",
    text: "Designed for long-term use across demanding applications.",
  },
  {
    no: "03",
    title: "Weather Resistant",
    text: "Suitable for a wide range of environmental conditions.",
  },
  {
    no: "04",
    title: "Design Flexibility",
    text: "Complex shapes and customized architectural forms are possible.",
  },
  {
    no: "05",
    title: "Low Maintenance",
    text: "Designed for practical long-term maintenance requirements.",
  },
  {
    no: "06",
    title: "Customizable",
    text: "Dimensions, finishes, textures and designs can be adapted to project needs.",
  },
];

export default function WhyFiber() {
  return (
    <section className="rk-wf">
      <div className="rk-wf-inner">
        {/* ===== Header (centered) ===== */}

        <div className="rk-wf-head">
          <span className="rk-wf-tag">06 KEY ADVANTAGES</span>

          <h2 className="rk-wf-title">
            Why Choose{" "}
            <span className="rk-wf-title-gold">Fiber &amp; Fiber Product</span>
          </h2>

          <p className="rk-wf-desc">
            Performance engineered for modern construction and architectural
            applications.
          </p>
        </div>

        {/* ===== Panel ===== */}

        <div className="rk-wf-panel">
          {ADVANTAGES.map((item) => (
            <div className="rk-wf-item" key={item.no}>
              <span className="rk-wf-no">{item.no}</span>
              <h3 className="rk-wf-item-title">{item.title}</h3>
              <p className="rk-wf-item-text">{item.text}</p>
              <span className="rk-wf-item-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}