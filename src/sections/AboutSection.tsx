export function AboutSection() {
  return (
    <section className="aboutWrap" id="about">
      <div className="container">
        <div className="aboutGrid">
          <div className="aboutContent">
            <p className="aboutLabel">About</p>
            <h2 className="aboutTitle">A calmer way to present creative work.</h2>
            <p className="aboutText">
              Portfoly was created for actors, photographers, designers and independent creators who need a professional presence online — without building and maintaining a full website.
            </p>
            <p className="aboutText">
              Instead of expensive development, scattered links and outdated PDFs, Portfoly gives you one cinematic page for your identity, your work and your story. Simple to create. Beautiful to share. Ready when opportunity appears.
            </p>
          </div>
          <div className="aboutCards">
            <div className="aboutInfoCard">
              <h3 className="aboutInfoCardTitle">For creators</h3>
              <p className="aboutInfoCardText">
                Designed for people whose work is visual, emotional and personal — not corporate.
              </p>
            </div>
            <div className="aboutInfoCard">
              <h3 className="aboutInfoCardTitle">One link</h3>
              <p className="aboutInfoCardText">
                Everything in one place. Bio, selected work, contact and exportable PDF.
              </p>
            </div>
            <div className="aboutInfoCard">
              <h3 className="aboutInfoCardTitle">Built to last</h3>
              <p className="aboutInfoCardText">
                Minimal design, fast performance and a structure that grows with your career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
