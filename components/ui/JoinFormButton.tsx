import React from 'react';
import styles from './JoinFormButton.module.css';

export const JoinFormButton = ({ url }: { url: string }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block w-fit mt-12 md:mt-0">
      <div className={styles.tooltipContainer}>
        <span className={styles.tooltip}>Join Now!</span>
        <span className={styles.text}>!</span>
      </div>
    </a>
  );
};
