import React, { useId } from 'react';

interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
  style?: React.CSSProperties;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = "100%",
  height = "100%",
  borderRadius = 0,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0.1,
  saturation = 1.2,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'normal',
  className = '',
  style = {},
}) => {
  const id = useId().replace(/:/g, '');
  const filterId = `glass-filter-${id}`;

  return (
    <div
      className={`relative overflow-hidden transition-all duration-500 ${className}`}
      style={{
        width,
        height,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        ...style,
      }}
    >
      {/* SVG Filter Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 -z-10">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          
          <feFlood floodOpacity={opacity} result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask" />
          
          <feMorphology operator="dilate" radius={borderWidth} in="mask" result="dilated" />
          <feComposite in="dilated" in2="mask" operator="out" result="border" />
          
          <feComponentTransfer in="border" result="brightness">
            <feFuncR type="linear" slope={brightness / 100} />
            <feFuncG type="linear" slope={brightness / 100} />
            <feFuncB type="linear" slope={brightness / 100} />
          </feComponentTransfer>

          <feOffset dx={redOffset} dy="0" in="brightness" result="red" />
          <feOffset dx={greenOffset} dy="0" in="brightness" result="green" />
          <feOffset dx={blueOffset} dy="0" in="brightness" result="blue" />
          
          <feMerge result="mergedBorder">
            <feMergeNode in="red" />
            <feMergeNode in="green" />
            <feMergeNode in="blue" />
          </feMerge>

          <feDisplacementMap
            in="blur"
            in2="mergedBorder"
            scale={distortionScale}
            xChannelSelector={xChannel}
            yChannelSelector={yChannel}
            result="displaced"
          />

          <feGaussianBlur in="displaced" stdDeviation={displace} result="finalBlur" />
          
          <feMerge>
            <feMergeNode in="finalBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      {/* Glass Layer */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          backdropFilter: `url(#${filterId}) blur(${blur}px) saturate(${saturation})`,
          borderRadius: 'inherit',
          mixBlendMode,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
