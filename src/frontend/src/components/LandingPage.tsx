import { CheckCircle, ExternalLink, FileText, Shield } from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  const appId =
    typeof window !== "undefined"
      ? window.location.hostname
      : "tetrisverse-app";

  return (
    <div className="min-h-screen bg-game-bg text-game-text flex flex-col">
      {/* Header */}
      <header className="border-b border-game-border px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img
            src="/assets/generated/tetrisverse-logo-transparent.dim_200x200.png"
            alt="TetrisVerse Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-black tracking-widest text-neon-cyan uppercase">
            TetrisVerse
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full mx-auto text-center space-y-10">
          {/* Logo & Title */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl bg-neon-cyan opacity-20 scale-110" />
              <img
                src="/assets/generated/tetrisverse-logo-transparent.dim_200x200.png"
                alt="TetrisVerse"
                className="relative w-28 h-28 object-contain drop-shadow-[0_0_16px_rgba(0,255,255,0.5)]"
              />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-widest uppercase text-neon-cyan mb-2">
                TetrisVerse
              </h1>
              <p className="text-game-muted text-sm font-semibold tracking-widest uppercase">
                Official Developer Site
              </p>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-game-card border border-game-border rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-2 text-neon-cyan font-bold text-sm uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>AdMob Verification</span>
            </div>
            <p className="text-game-text text-base leading-relaxed">
              This is the official developer website for{" "}
              <strong className="text-neon-cyan">TetrisVerse</strong> — a global
              multi-mode Tetris game available on Android. This site hosts the{" "}
              <code className="bg-game-code text-neon-green px-1.5 py-0.5 rounded text-sm font-mono">
                app-ads.txt
              </code>{" "}
              file required for Google AdMob verification.
            </p>
            <div className="flex items-start gap-2 text-game-muted text-sm">
              <CheckCircle className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
              <span>
                Publisher ID:{" "}
                <span className="text-game-text font-mono">
                  pub-7936595519986908
                </span>
              </span>
            </div>
          </div>

          {/* app-ads.txt Link Card */}
          <a
            href="/app-ads.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-game-card border border-neon-cyan/30 hover:border-neon-cyan rounded-2xl p-6 transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,255,255,0.15)] hover:bg-game-card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                  <FileText className="w-6 h-6 text-neon-cyan" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-game-text text-base">
                    app-ads.txt
                  </p>
                  <p className="text-game-muted text-sm font-mono">
                    /app-ads.txt
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-neon-cyan opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4 bg-game-code rounded-lg px-4 py-3 font-mono text-sm text-neon-green text-left break-all">
              google.com, pub-7936595519986908, DIRECT, f08c47fec0942fa0
            </div>
          </a>

          {/* Info Note */}
          <p className="text-game-muted text-sm leading-relaxed">
            Google AdMob uses this file to verify that TetrisVerse is an
            authorized publisher. The file is accessible at{" "}
            <code className="text-neon-cyan font-mono text-xs bg-game-code px-1.5 py-0.5 rounded">
              {typeof window !== "undefined"
                ? window.location.origin
                : "https://[domain]"}
              /app-ads.txt
            </code>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-game-border px-4 py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-game-muted text-xs">
          <span>© {currentYear} TetrisVerse. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-neon-pink">♥</span> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
