import React, { useId } from 'react';

export default function DetroitDynamoMark({ className = 'h-11 w-11', title = 'Detroit Dynamo mark' }) {
  const gradientId = useId().replace(/:/g, '');
  const leftD = `${gradientId}-left-d`;
  const rightD = `${gradientId}-right-d`;
  const slash = `${gradientId}-slash`;

  return (
    // TODO: Replace header temporary DD mark with final transparent SVG logo export.
    <svg
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M84 112H214C294 112 345 167 345 256C345 345 294 400 214 400H84L132 256L84 112Z"
        fill={`url(#${leftD})`}
      />
      <path d="M151 169H218C265 169 289 203 289 256C289 309 265 343 218 343H151L179 256L151 169Z" fill="#020714" />
      <path
        d="M253 154H334C402 154 444 197 444 256C444 315 402 358 334 358H253L287 256L253 154Z"
        fill={`url(#${rightD})`}
      />
      <path d="M315 205H337C366 205 386 224 386 256C386 288 366 307 337 307H315L333 256L315 205Z" fill="#020714" />
      <path d="M333 58L196 244H270L156 454L376 221H299L452 58H333Z" fill="#006BFF" />
      <path d="M327 84L217 239H292L206 405L356 230H286L421 84H327Z" fill={`url(#${slash})`} />
      <path d="M217 239H292L268 286H181L217 239Z" fill="#F8FAFC" />
      <path
        d="M206 405L356 230H286L421 84"
        stroke="#33C8FF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={leftD} x1="84" y1="112" x2="294" y2="404" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#9AA6B8" />
        </linearGradient>
        <linearGradient id={rightD} x1="253" y1="154" x2="414" y2="366" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#DDE5F0" />
          <stop offset="1" stopColor="#7F8B9D" />
        </linearGradient>
        <linearGradient id={slash} x1="221" y1="405" x2="396" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#005DFF" />
          <stop offset="0.45" stopColor="#00A3FF" />
          <stop offset="1" stopColor="#77EAFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
