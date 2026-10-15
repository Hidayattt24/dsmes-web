interface AvatarProps {
  readonly src?:       string;
  readonly name:       string;
  readonly size?:      number;
  readonly showOnline?: boolean;
  readonly className?:  string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  name,
  size      = 40,
  className  = "",
}: AvatarProps) {

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // Profile photos may be stored as data URLs or regular URLs.
        // A native image supports both without requiring Next image-host config.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full bg-[#EEF2FF] text-[#3B67FC] font-bold select-none"
          style={{ fontSize: size * 0.38 }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
