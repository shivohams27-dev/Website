import React from 'react';
import styles from './ExplodingPlusButton.module.css';
import { ArrowRight } from 'lucide-react';

export const ExplodingPlusButton = ({ url }: { url: string }) => {
  return (
    <div className={styles.wrapper}>
      <input 
        type="checkbox" 
        className={styles.inputCheckbox} 
        onChange={(e) => {
          if (e.target.checked) {
            window.open(url, '_blank');
          }
        }}
      />
      <div className={styles.btn} />
      
      {/* Tooltip that pops up - Clickable link! */}
      <div className={styles.tooltip}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-around w-full cursor-pointer group">
          <span>Join US</span>
          <ArrowRight className="w-5 h-5 ml-4 text-[#414856] opacity-40 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
      
      {/* SVG Particles for explosion */}
      <svg viewBox="0 0 300 300">
        <path fill="none" stroke="#b8cbee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#7691e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#fdd053" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#b8cbee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#7691e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#fdd053" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#b8cbee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#7691e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
        <path fill="none" stroke="#fdd053" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.shape} d="M 150 150 L 150 100" />
      </svg>
    </div>
  );
};
