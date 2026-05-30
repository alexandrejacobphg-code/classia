import { useState, useEffect, useRef } from "react";

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Counter = ({ target, inView }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count}</span>;
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const StaggeredLines = ({ lines, baseDelay = 0 }) => {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <p
          key={i}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.8s ease ${baseDelay + i * 0.35}s, transform 0.8s ease ${baseDelay + i * 0.35}s`,
            fontSize: "clamp(1.35rem, 3vw, 1.9rem)",
            fontWeight: 300,
            color: "#1a1a1a",
            lineHeight: 1.55,
            margin: "0 0 0.5rem 0",
            letterSpacing: "-0.01em",
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
};

// ─── CONFIG AIRTABLE ──────────────────────────────────────────────
// Remplace ces deux valeurs par les tiennes (voir guide d'installation)
const AIRTABLE_TOKEN = "patA1hHh2vmsKts2J.9eb4de3f13b406fb8d4f57c0e6da84453c91f71197e1ea7703b11f4cc8d642fd";
const AIRTABLE_BASE_ID = "appiWGTZovoQrBxGY";
const AIRTABLE_TABLE = "Testeurs"; // nom de ta table dans Airtable
// ──────────────────────────────────────────────────────────────────

export default function Classia() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ prenom: "", email: "" });
  const [counterRef, counterInView] = useInView(0.3);

  const handleSubmit = async () => {
    if (!form.prenom || !form.email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Prénom: form.prenom,
              Email: form.email,
              Date: new Date().toISOString(),
            },
          }),
        }
      );
      if (!res.ok) throw new Error("Erreur réseau");
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez-nous directement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: "#fafaf8", color: "#1a1a1a", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Hero */}
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, #eef5f0 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, position: "relative" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#fff", border: "1px solid #e8e8e4", borderRadius: 100,
              padding: "0.4rem 1rem", marginBottom: "2.5rem",
              fontSize: "0.8rem", fontWeight: 500, color: "#5a7a62", letterSpacing: "0.04em",
              textTransform: "uppercase",
              animation: "fadeDown 1s ease 0.2s both",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5a7a62", display: "inline-block" }} />
            Classia — Projet en développement
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
              fontWeight: 400, lineHeight: 1.12, margin: "0 0 1.8rem",
              color: "#0f1412",
              animation: "fadeUp 1s ease 0.4s both",
            }}
          >
            Vous avez voulu être tenu informé du développement de Classia.
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)", fontWeight: 300, color: "#5a5a54",
              lineHeight: 1.7, margin: 0,
              animation: "fadeUp 1s ease 0.65s both",
            }}
          >
            C'est exactement ce que nous faisons.<br />
            Voici où en est le projet.
          </p>
          <div style={{ marginTop: "3rem", animation: "fadeUp 1s ease 0.85s both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#9a9990", fontSize: "0.85rem" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M8 13l-3-3M8 13l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Faites défiler
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, transparent, #d0d0c8)", margin: "0 auto" }} />

      {/* S1 */}
      <section style={{ padding: "clamp(5rem, 12vw, 9rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center" }}>
        <FadeIn>
          <p style={{ maxWidth: 580, margin: "0 auto", fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, lineHeight: 1.3, color: "#0f1412" }}>
            Il y a quelques semaines, vous avez répondu à notre questionnaire.
          </p>
        </FadeIn>
      </section>

      {/* S2 */}
      <section style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center", background: "#fff" }}>
        <FadeIn>
          <p style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)", fontWeight: 500, color: "#5a7a62", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Résultats</p>
        </FadeIn>
        <div ref={counterRef} style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              opacity: counterInView ? 1 : 0,
              transform: counterInView ? "scale(1)" : "scale(0.9)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}
          >
            <div style={{ fontSize: "clamp(4rem, 12vw, 8rem)", fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, color: "#0f1412", lineHeight: 1, marginBottom: "1rem" }}>
              <Counter target={285} inView={counterInView} />
            </div>
            <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 300, color: "#5a5a54", margin: 0 }}>
              Grâce à vous, nous avons reçu plusieurs dizaines de réponses.
            </p>
          </div>
        </div>
      </section>

      {/* S3 */}
      <section style={{ padding: "clamp(5rem, 14vw, 11rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center" }}>
        <FadeIn>
          <p style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#0f1412", margin: 0 }}>
            Une tendance est apparue.
          </p>
        </FadeIn>
      </section>

      {/* S4 */}
      <section style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", maxWidth: 720, margin: "0 auto" }}>
        <StaggeredLines
          lines={[
            "Les enseignants ne cherchent pas simplement un outil supplémentaire.",
            "Ils cherchent à gagner du temps.",
            "Ils cherchent à mieux préparer leurs cours.",
            "Ils cherchent à se concentrer sur leurs élèves.",
          ]}
        />
      </section>

      {/* S5 */}
      <section style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", background: "#0f1412" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)", fontWeight: 500, color: "#5a7a62", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "2rem" }}>
              Votre priorité est claire
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: "#1a1f1c", border: "1px solid #2d3530", borderRadius: 20, padding: "clamp(1.8rem, 4vw, 2.8rem)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, #5a7a62, transparent)" }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#2a3530", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#5a7a62" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)", fontWeight: 400, color: "#f0ede8", lineHeight: 1.5, margin: "0 0 1rem" }}>
                    Générer rapidement des séquences, activités et contenus pédagogiques.
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#6a7a70", margin: 0, fontWeight: 300 }}>
                    Fonctionnalité prioritaire identifiée dans votre questionnaire
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* S6 */}
      <section style={{ padding: "clamp(5rem, 12vw, 9rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center", background: "#fff" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)", fontWeight: 500, color: "#5a7a62", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Notre réponse
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 400, color: "#0f1412", margin: "0 0 1.5rem", lineHeight: 1.2 }}>
              Nous vous avons écoutés.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", fontWeight: 300, color: "#5a5a54", lineHeight: 1.7, margin: 0 }}>
              C'est cette fonctionnalité que nous avons décidé de construire en priorité.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* S7 — Emotional */}
      <section style={{ padding: "clamp(5rem, 14vw, 11rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center", background: "linear-gradient(to bottom, #fafaf8, #f2f5f1)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.7rem)", fontWeight: 300, color: "#4a4a44", lineHeight: 1.6, margin: "0 0 2rem" }}>
              Chaque projet commence par une idée.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.7rem)", fontWeight: 300, color: "#2a2a24", lineHeight: 1.6, margin: "0 0 2rem" }}>
              Mais aucun projet n'avance sans personnes prêtes à y croire.
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 400, fontStyle: "italic", color: "#0f1412", margin: 0 }}>
              Merci d'en faire partie.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* S8 — CTA */}
      <section style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", background: "#0f1412" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)", fontWeight: 500, color: "#5a7a62", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Dernière étape
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#f0ede8", margin: "0 0 1.2rem", lineHeight: 1.2 }}>
              Confirmez votre place parmi les premiers testeurs.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 300, color: "#8a8a80", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              C'est votre dernière confirmation. Une fois validée, vous recevrez l'accès à Classia directement par e-mail — <strong style={{ color: "#a0b0a5", fontWeight: 400 }}>le 20 août</strong>.
            </p>
          </FadeIn>

          {!submitted ? (
            <>
              {!formOpen ? (
                <FadeIn delay={0.3}>
                  <button
                    onClick={() => setFormOpen(true)}
                    style={{
                      background: "#5a7a62", color: "#fff", border: "none",
                      borderRadius: 100, padding: "1rem 2.2rem",
                      fontSize: "1rem", fontWeight: 500, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.25s ease, transform 0.2s ease",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={e => { e.target.style.background = "#4a6a52"; e.target.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.target.style.background = "#5a7a62"; e.target.style.transform = "scale(1)"; }}
                  >
                    Je confirme ma participation
                  </button>
                </FadeIn>
              ) : (
                <div
                  style={{
                    background: "#1a1f1c", border: "1px solid #2d3530",
                    borderRadius: 20, padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    animation: "fadeUp 0.6s ease both",
                    textAlign: "left",
                  }}
                >
                  <p style={{ color: "#f0ede8", fontWeight: 500, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
                    Confirmez votre accès
                  </p>
                  <p style={{ color: "#6a7a70", fontSize: "0.9rem", fontWeight: 300, margin: "0 0 1.8rem", lineHeight: 1.5 }}>
                    Vous recevrez Classia par e-mail le <strong style={{ color: "#a0b0a5", fontWeight: 400 }}>20 août</strong>.
                  </p>
                  <div style={{ marginBottom: "1.2rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#8a8a80", marginBottom: "0.5rem", fontWeight: 500 }}>Prénom</label>
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      value={form.prenom}
                      onChange={e => setForm({ ...form, prenom: e.target.value })}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "#0f1412", border: "1px solid #2d3530",
                        borderRadius: 10, padding: "0.85rem 1rem",
                        color: "#f0ede8", fontSize: "1rem",
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#5a7a62"}
                      onBlur={e => e.target.style.borderColor = "#2d3530"}
                    />
                  </div>
                  <div style={{ marginBottom: "1.8rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#8a8a80", marginBottom: "0.5rem", fontWeight: 500 }}>Adresse email</label>
                    <input
                      type="email"
                      placeholder="votre@email.fr"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "#0f1412", border: "1px solid #2d3530",
                        borderRadius: 10, padding: "0.85rem 1rem",
                        color: "#f0ede8", fontSize: "1rem",
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#5a7a62"}
                      onBlur={e => e.target.style.borderColor = "#2d3530"}
                    />
                  </div>
                  {error && (
                    <p style={{ color: "#e07060", fontSize: "0.85rem", margin: "0 0 1rem", lineHeight: 1.5 }}>{error}</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      width: "100%", background: loading ? "#3a5a42" : "#5a7a62", color: "#fff",
                      border: "none", borderRadius: 10, padding: "1rem",
                      fontSize: "1rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.25s ease",
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!loading) e.target.style.background = "#4a6a52"; }}
                    onMouseLeave={e => { if (!loading) e.target.style.background = "#5a7a62"; }}
                  >
                    {loading ? "Envoi en cours…" : "Je rejoins les premiers testeurs"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ animation: "fadeUp 0.7s ease both", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1a2e20", border: "1px solid #2d4535", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#5a7a62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p style={{ color: "#f0ede8", fontSize: "1.3rem", fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", margin: "0 0 0.8rem" }}>
                C'est confirmé, {form.prenom} !
              </p>
              <p style={{ color: "#6a7a70", fontSize: "0.95rem", fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
                Vous recevrez l'accès à Classia à l'adresse {form.email}<br />
                <strong style={{ color: "#a0b0a5", fontWeight: 400 }}>le 20 août</strong>. À très bientôt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div style={{ padding: "2rem", textAlign: "center", background: "#0f1412", borderTop: "1px solid #1e2420" }}>
        <p style={{ fontSize: "0.8rem", color: "#3a4a40", margin: 0, fontWeight: 300 }}>
          © {new Date().getFullYear()} Classia — Projet éducatif en développement
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { -webkit-font-smoothing: antialiased; }
        ::placeholder { color: #3a4a40 !important; }
      `}</style>
    </div>
  );
}
