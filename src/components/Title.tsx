interface TitleProps {
  text: string;
}

export function Title({ text }: TitleProps) {
  return (
    <header className="text-center mb-2">
      <h1 className="elegant-title text-xl md:text-4xl">
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className="inline-block mx-[0.02em]"
            style={{ '--char-index': i } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </header>
  );
}
