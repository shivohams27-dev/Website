import React from 'react';
import styles from './DynamicSocialGrid.module.css';

interface LinkItem {
  label: string;
  url: string;
}

export const DynamicSocialGrid = ({ links = [] }: { links?: LinkItem[] }) => {
  // We max out at 8 links since that's all the grid can hold around the center
  const displayLinks = links.slice(0, 8);
  const n = displayLinks.length;

  // Define grid areas to "span" cells based on how many links we have.
  // 1 / 1 / 2 / 2 = row_start / col_start / row_end / col_end
  // Grid layout:
  // (1,1)  (1,2)  (1,3)
  // (2,1) center  (2,3)
  // (3,1)  (3,2)  (3,3)
  const getGridArea = (count: number, index: number, link: LinkItem & { position?: string }) => {
    if (link.position) {
      switch (link.position) {
        case 'top-left': return '1 / 1 / 2 / 2';
        case 'top-mid': return '1 / 2 / 2 / 3';
        case 'top-right': return '1 / 3 / 2 / 4';
        case 'mid-right': return '2 / 3 / 3 / 4';
        case 'bot-right': return '3 / 3 / 4 / 4';
        case 'bot-mid': return '3 / 2 / 4 / 3';
        case 'bot-left': return '3 / 1 / 4 / 2';
        case 'mid-left': return '2 / 1 / 3 / 2';
      }
    }

    if (count === 1) return '1 / 1 / 4 / 4'; // wait, center overlaps? If 1, let's just do top row spanning 3
    
    // Hardcoded beautiful balanced layouts
    if (count === 4) {
      if (index === 0) return '1 / 1 / 2 / 3'; // Top Left & Top Mid
      if (index === 1) return '1 / 3 / 3 / 4'; // Top Right & Mid Right
      if (index === 2) return '3 / 2 / 4 / 4'; // Bot Mid & Bot Right
      if (index === 3) return '2 / 1 / 4 / 2'; // Mid Left & Bot Left
    }
    if (count === 5) {
      if (index === 0) return '1 / 1 / 2 / 2'; // Top Left
      if (index === 1) return '1 / 2 / 2 / 3'; // Top Mid
      if (index === 2) return '1 / 3 / 3 / 4'; // Top Right & Mid Right
      if (index === 3) return '3 / 2 / 4 / 4'; // Bot Mid & Bot Right
      if (index === 4) return '2 / 1 / 4 / 2'; // Mid Left & Bot Left
    }
    if (count === 6) {
      if (index === 0) return '1 / 1 / 2 / 2';
      if (index === 1) return '1 / 2 / 2 / 3';
      if (index === 2) return '1 / 3 / 2 / 4'; // Top Right
      if (index === 3) return '2 / 3 / 4 / 4'; // Mid Right & Bot Right
      if (index === 4) return '3 / 2 / 4 / 3'; // Bot Mid
      if (index === 5) return '2 / 1 / 4 / 2'; // Mid Left & Bot Left
    }
    if (count === 7) {
      if (index === 0) return '1 / 1 / 2 / 2';
      if (index === 1) return '1 / 2 / 2 / 3';
      if (index === 2) return '1 / 3 / 2 / 4'; 
      if (index === 3) return '2 / 3 / 3 / 4'; // Mid Right
      if (index === 4) return '3 / 3 / 4 / 4'; // Bot Right
      if (index === 5) return '3 / 2 / 4 / 3'; // Bot Mid
      if (index === 6) return '2 / 1 / 4 / 2'; // Mid Left & Bot Left
    }
    
    // Default 8-slots circular mapping
    const slots = [
      '1 / 1 / 2 / 2', // top left
      '1 / 2 / 2 / 3', // top mid
      '1 / 3 / 2 / 4', // top right
      '2 / 3 / 3 / 4', // mid right
      '3 / 3 / 4 / 4', // bot right
      '3 / 2 / 4 / 3', // bot mid
      '3 / 1 / 4 / 2', // bot left
      '2 / 1 / 3 / 2', // mid left
    ];
    
    // If < 4, just assign them slots
    return slots[index % 8];
  };

  const getBorderRadiusClass = (count: number, index: number) => {
    // If a box spans multiple cells, we don't want inner radiuses
    // For simplicity, we can let CSS handle rounding on hover
    return "";
  };

  const getIconData = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('instagram')) return { cls: 'instagram', icon: <svg viewBox="0 0 448 512" className={styles.svgIcon}><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg> };
    if (l.includes('twitter') || l.includes('x')) return { cls: 'twitter', icon: <svg viewBox="0 0 48 48" className={styles.svgIcon}><path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"/></svg> };
    if (l.includes('linkedin')) return { cls: 'linkedin', icon: <svg viewBox="0 0 448 512" className={styles.svgIcon}><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg> };
    if (l.includes('github')) return { cls: 'github', icon: <svg viewBox="0 0 30 30" className={styles.svgIcon}><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"/></svg> };
    if (l.includes('telegram')) return { cls: 'telegram', icon: <svg viewBox="0 0 48 48" className={styles.svgIcon}><path d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z" fill="#fff" /></svg> };
    if (l.includes('discord')) return { cls: 'discord', icon: <svg viewBox="0 0 48 48" className={styles.svgIcon}><path d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z" fill="#fff" /></svg> };
    // Default link icon
    return { cls: 'default', icon: <svg viewBox="0 0 24 24" className={styles.svgIcon}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainBack} />
      <div className={styles.main}>
        {displayLinks.map((link, i) => {
          const { cls, icon } = getIconData(link.label);
          return (
            <a 
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.card} ${styles[cls]}`}
              style={{ gridArea: getGridArea(n, i, link) }}
              title={link.label}
            >
              {icon}
            </a>
          );
        })}
        
        {/* The center "HOVER FOR SOCIAL" box */}
        <div className={styles.centerCard}>
          <p className={styles.hoverText}>HOVER<br/><br/>FOR<br/><br/>SOCIAL</p>
        </div>
      </div>
    </div>
  );
};
