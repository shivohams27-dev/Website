import React from 'react';
import styles from './TeamSocialIcon.module.css';
import { TeamMember } from '@/lib/types';

export type SocialType = 'instagram' | 'linkedin' | 'github';

interface TeamSocialIconProps {
  type: SocialType;
  url: string;
  member: TeamMember;
}

export const TeamSocialIcon = ({ type, url, member }: TeamSocialIconProps) => {
  const getSVG = () => {
    switch (type) {
      case 'instagram':
        return (
          <svg fill="white" className={`${styles.svgIcon} w-full h-full p-[6px] rounded-[10px]`} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 448 512" className={`${styles.svgIcon} w-full h-full p-[6px]`} xmlns="http://www.w3.org/2000/svg">
            <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
          </svg>
        );
      case 'github':
        return (
          <svg viewBox="0 0 30 30" className={`${styles.svgIcon} w-full h-full p-[3px]`} xmlns="http://www.w3.org/2000/svg">
            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
          </svg>
        );
    }
  };

  const getLabelName = () => {
    switch (type) {
      case 'instagram': return 'Instagram';
      case 'linkedin': return 'LinkedIn';
      case 'github': return 'GitHub';
    }
  };

  const getUsernameFromUrl = (url: string) => {
    // Specific request for founder's handles
    if (member.name === 'Shouraya Sharma' || member.username === 'Shivoham_07') {
      if (type === 'linkedin') return 'shouraya-sharma';
      if (type === 'instagram') return 'shourayasharma07';
      if (type === 'github') return 'Shouraya-07';
    }

    if (!url) return null;
    try {
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(validUrl);
      const path = urlObj.pathname.split('/').filter(Boolean);
      
      if (path.length === 0) return null;
      
      if (type === 'linkedin' && path[0] === 'in' && path.length > 1) {
        return path[1];
      }
      return path[path.length - 1];
    } catch {
      return null;
    }
  };

  const displayUsername = getUsernameFromUrl(url) || member.username || member.name?.toLowerCase().replace(/\s/g, '') || 'member';

  return (
    <div className={`${styles.tooltipContainer} ${styles[type]}`}>
      <div className={styles.tooltip}>
        <div className={styles.profile}>
          <div className={styles.user}>
            <div className={styles.img}>
              {member.avatar_url ? (
                <img src={member.avatar_url || undefined} alt={member.name || 'Team Member'} className="w-full h-full object-cover" />
              ) : (
                member.avatar_initials || '?'
              )}
            </div>
            <div className={styles.details}>
              <div className={styles.name}>{member.name}</div>
              <div className={styles.username}>@{displayUsername}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.text}>
        <a className={styles.iconWrapper} href={url} target="_blank" rel="noopener noreferrer">
          <div className={styles.layer}>
            <span />
            <span />
            <span />
            <span />
            <span className={styles.svgContainer}>
              {getSVG()}
            </span>
          </div>
          <div className={styles.text}>{getLabelName()}</div>
        </a>
      </div>
    </div>
  );
};
