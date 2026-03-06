import React from "react";
import { Card } from "../Card/Card";
import styles from "./SEOArticle.module.css";

interface SEOArticleProps {
  title: string;
  children: React.ReactNode;
}

export function SEOArticle({ title, children }: SEOArticleProps) {
  return (
    <Card className={styles.seoArticle}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </Card>
  );
}
