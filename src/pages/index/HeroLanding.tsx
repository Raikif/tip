import React from 'react';
import { Button } from 'antd';
import './HeroLanding.less';

const HeroLanding: React.FC = () => {
  return (
    <div className="hero-landing">
      {/* 波浪背景 */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,160 L120,176 C240,192 480,224 720,208 C960,192 1200,128 1320,112 L1440,96 L1440,320 L1320,320 C1200,320 960,320 720,320 C480,320 240,320 120,320 L0,320 Z"
            fill="#FF6B35"
            opacity="0.8"
          />
          <path
            d="M0,160 L120,144 C240,128 480,96 720,112 C960,128 1200,192 1320,208 L1440,224 L1440,320 L1320,320 C1200,320 960,320 720,320 C480,320 240,320 120,320 L0,320 Z"
            fill="#A25AF4"
            opacity="0.7"
          />
          <path
            d="M0,160 L120,192 C240,224 480,256 720,256 C960,256 1200,224 1320,208 L1440,192 L1440,320 L1320,320 C1200,320 960,320 720,320 C480,320 240,320 120,320 L0,320 Z"
            fill="#FF6B35"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 中央纽扣图标 */}
      <div className="button-icon">
        <Button type="primary" shape="circle" size="large" icon={<span className="button-dot">●</span>} />
      </div>
    </div>
  );
};

export default HeroLanding;