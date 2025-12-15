import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveSectionProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  src: string;
  stateMachine?: string;
}

const RiveItem = ({
  src,
  stateMachine = "State Machine 1",
}: {
  src: string;
  stateMachine?: string;
}) => {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="relative w-full h-full group">
      <RiveComponent className="w-full h-full" />
    </div>
  );
};

const RiveSection = ({
  id,
  style,
  className,
  src,
  stateMachine,
}: RiveSectionProps) => {
  return (
    <section
      id={id}
      style={style}
      className={`py-12 bg-brutal-white dark:bg-brutal-black border-b-4 border-black ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 items-center justify-center w-full">
          <div className="w-full h-[400px] md:h-[600px] border-4 border-black bg-white dark:bg-zinc-900 shadow-brutal">
            <RiveItem src={src} stateMachine={stateMachine} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiveSection;
