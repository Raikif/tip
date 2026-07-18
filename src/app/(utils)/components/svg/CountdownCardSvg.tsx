import React from "react";

type CountdownCardSvgProps = {
  id: string;
};

const CountdownCardSvg = ({ id }: CountdownCardSvgProps) => (
  <svg
    className="timeline-section__countdown-card"
    viewBox="0 0 120 154"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <filter
        id={`countdown-inner-shadow-${id}`}
        x="0"
        y="0"
        width="120"
        height="154"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="innerShadow"
        />
      </filter>
    </defs>
    <rect
      width="120"
      height="150"
      rx="10"
      fill="#8D1CC9"
      filter={`url(#countdown-inner-shadow-${id})`}
    />
  </svg>
);

export default React.memo(CountdownCardSvg);
