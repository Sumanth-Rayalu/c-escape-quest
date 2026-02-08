interface VictoryScreenProps {
  onRestart: () => void;
}

export default function VictoryScreen({ onRestart }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="scanline absolute inset-0 pointer-events-none opacity-20" />

      <div className="relative text-center space-y-8 max-w-lg mx-4">
        {/* Victory animation */}
        <div className="space-y-4">
          <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase animate-fade-in text-glow">
            {'// '}system.exit(0)
          </p>
          <h1 className="text-6xl font-bold text-foreground tracking-tight animate-scale-in">
            YOU<span className="text-primary text-glow"> ESCAPED</span>
          </h1>
          <p className="text-sm font-mono text-accent text-glow-accent animate-fade-in">
            All 5 levels completed successfully
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in">
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <p className="text-2xl font-bold text-primary text-glow">5/5</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">Levels</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <p className="text-2xl font-bold text-accent text-glow-accent">5</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">Keys Found</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card/50">
            <p className="text-2xl font-bold text-foreground">C</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">Master</p>
          </div>
        </div>

        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
          <p className="text-sm font-mono text-primary text-glow">
            {'>'} Congratulations! You've proven your C programming knowledge.
          </p>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="px-10 py-4 rounded-lg font-mono text-sm font-semibold
            bg-primary text-primary-foreground hover:bg-primary/90
            transition-all duration-300 box-glow"
        >
          {'>'} PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
