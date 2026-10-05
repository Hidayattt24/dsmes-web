import Image from "next/image";

interface AuthFormHeaderProps {
  readonly title:       string;
  readonly description: string;
}

export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 font-[family-name:var(--font-jakarta)]">
      <div className="mb-5 sm:mb-6">
        <Image
          src="/logo.png"
          alt="DIBA Logo"
          width={240}
          height={80}
          className="h-12 sm:h-16 w-auto max-w-[180px] sm:max-w-[220px] object-contain"
          priority
        />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1c] mb-1.5 sm:mb-2 tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-[#4A5568] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
