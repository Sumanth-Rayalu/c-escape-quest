interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="scanline absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative text-center space-y-8 max-w-lg mx-4">
        {/* Title */}
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">
            {'// '}initializing...
          </p>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            ESCAPE<span className="text-primary text-glow">_</span>ROOM
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm font-mono text-primary">
            <span className="inline-block w-8 h-px bg-primary/40" />
            C Language Challenge
            <span className="inline-block w-8 h-px bg-primary/40" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>{'>'} You are trapped in a room.</p>
          <p>{'>'} Solve 5 levels of C programming challenges.</p>
          <p>{'>'} Find hidden keys. Activate switches. Escape.</p>
        </div>

        {/* Instructions */}
        <div className="border border-border rounded-lg p-4 bg-card/50 text-left space-y-2">
          <p className="text-xs font-mono text-accent text-glow-accent">HOW TO PLAY</p>
          <ul className="text-sm font-mono text-secondary-foreground space-y-1.5">
            <li><span className="text-primary">1.</span> Click the <span className="text-primary">question board</span> on the wall</li>
            <li><span className="text-primary">2.</span> Solve the C challenge correctly</li>
            <li><span className="text-primary">3.</span> Find and collect the revealed <span className="text-accent">key</span></li>
            <li><span className="text-primary">4.</span> Use the key on the <span className="text-primary">switch</span></li>
            <li><span className="text-primary">5.</span> Walk through the <span className="text-primary">unlocked door</span></li>
          </ul>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="group relative px-10 py-4 rounded-lg font-mono text-sm font-semibold
            bg-primary text-primary-foreground hover:bg-primary/90
            transition-all duration-300 box-glow hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
        >
          <span className="relative z-10">{'>'} START GAME</span>
        </button>

        <p className="text-xs font-mono text-muted-foreground/40">
          v1.0.0 • Desktop recommended • Click to interact
        </p>
      </div>
    </div>
  );
}
