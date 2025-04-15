import "./../style/AboutUs.css";
import Navbar from "../components/navbar";
export default function AboutUs() {
  return (
    <>
      <Navbar />
      <section className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2>About Us</h2>
            <div className="about-text">
              <p>
                This project was created from scratch by developer{" "}
                <strong>Alisher Assanov</strong> and UI/UX designer{" "}
                <strong>Sanjar Nurlan</strong>. We combined our efforts to
                create a warm and functional space for couples in long-distance
                relationships.
              </p>
              <p>
                The website helps synchronize daily life through shared
                planning, preserving memorable moments, and deepening
                understanding through personalized tools. We believe that
                distance is no obstacle to true connection.
              </p>
              <p>
                Our goal is to create an environment where love can grow and
                strengthen, despite the miles between you.
              </p>
            </div>
          </div>

          <div className="about-team">
            <div className="team-card">
              <div className="avatar">
                <div className="avatar-circle">AA</div>
              </div>
              <h3>Alisher Assanov</h3>
              <p className="role">Fullstack Developer</p>
              <p className="description">
                Responsible for building the entire platform — from architecture
                to security and performance.
              </p>
            </div>
            <div className="team-card">
              <div className="avatar">
                <div className="avatar-circle">SN</div>
              </div>
              <h3>Sanjar Nurlan</h3>
              <p className="role">UI/UX Designer</p>
              <p className="description">
                Crafted the visual and emotional aspects of the website to make
                it cozy and intuitive.
              </p>
            </div>
          </div>

          <div className="about-features">
            <h3>What you'll find on the website</h3>
            <div className="feature-grid">
              <div className="feature-card">
                <h4>Shared Planning</h4>
                <p>Common tasks and calendars to synchronize daily life</p>
              </div>
              <div className="feature-card">
                <h4>Memory Vault</h4>
                <p>Save important moments and revisit them together</p>
              </div>
              <div className="feature-card">
                <h4>Understanding Tools</h4>
                <p>
                  Get to know each other better through personalized insights
                </p>
              </div>
            </div>
          </div>

          <p className="about-quote">
            “Helping couples feel closer, despite the distance.”
          </p>
        </div>
      </section>
    </>
  );
}
