import Image from "next/image";

interface AuthFormHeaderProps {
  readonly title:       string;
  readonly description: string;
}

export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <div className="mb-8 font-[family-name:var(--font-jakarta)]">
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="Digital DSMES Logo"
          width={240}
          height={80}
          className="h-16 w-auto max-w-[220px] object-contain"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-[#1b1c1c] mb-2">{title}</h1>
      <p className="text-base text-[#3e4946] leading-relaxed">{description}</p>
    </div>
  );
}
