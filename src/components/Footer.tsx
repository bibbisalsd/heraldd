import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            Herald / Skeptic<span className={styles.dot}>.</span>
          </div>
          <div className={styles.tagline}>
            An architectural pattern and operating system for evidence-grounded AI.
          </div>
        </div>
        <div className={styles.meta}>
          <div className={styles.metaLine}>
            CLLM Pattern + World-Model Cognitive Architecture
          </div>
          <div className={styles.metaLine}>
            Reference implementation: Esoteric v0.2 on Skeptic v0.2.0
          </div>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Herald / Skeptic Project
          </div>
        </div>
      </div>
    </footer>
  );
}
