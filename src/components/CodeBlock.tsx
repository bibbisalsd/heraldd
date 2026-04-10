import styles from "./CodeBlock.module.css";

interface Props {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language, filename }: Props) {
  return (
    <div className={styles.wrapper}>
      {(filename || language) && (
        <div className={styles.header}>
          {filename && <span className={styles.filename}>{filename}</span>}
          {language && <span className={styles.lang}>{language}</span>}
        </div>
      )}
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  );
}
