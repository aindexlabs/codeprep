import type { SVGProps } from 'react';

export function CodePrepLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M68.438 79.563l-15 15 35.156 35.25-35.156 35.156 15 15 50.156-50.156z"></path>
        <path d="M96.719 192h20.531l38.281-128h-20.531z"></path>
        <path d="M187.563 79.563l-50.156 50.156 50.156 50.156 15-15-35.156-35.156 35.156-35.25z"></path>
      </g>
    </svg>
  );
}
