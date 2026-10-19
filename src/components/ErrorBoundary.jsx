import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ELIXORA Caught Error in Boundary:', error, errorInfo);
    const msg = String(error?.message || error);
    // If user's browser attempts to fetch an old deployment chunk that was replaced
    if (msg.includes('dynamically imported module') || msg.includes('Loading chunk')) {
      const hasAutoReloaded = sessionStorage.getItem('elixora_chunk_reload_done');
      if (!hasAutoReloaded) {
        sessionStorage.setItem('elixora_chunk_reload_done', 'true');
        const url = new URL(window.location.href);
        url.searchParams.set('_v', Date.now());
        window.location.replace(url.toString());
      }
    }
  }

  handleReload = () => {
    try {
      sessionStorage.removeItem('elixora_chunk_reload_done');
    } catch (e) {}
    const url = new URL(window.location.href);
    url.searchParams.set('_v', Date.now());
    window.location.replace(url.toString());
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
      }
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-obsidian-900/90 border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl">
              ✨
            </div>
            <h1 className="font-unbounded font-black text-2xl text-white mb-2 uppercase tracking-wide">
              ELIXORA 2.0
            </h1>
            <p className="text-sm text-slate-300 font-outfit mb-4">
              Something unexpected happened while initializing the experience.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-left text-xs font-mono text-rose-300 max-h-40 overflow-y-auto break-all select-text">
                <p className="font-bold text-rose-200 mb-1">Error Diagnostic:</p>
                <p>{this.state.error?.message || String(this.state.error)}</p>
                {this.state.error?.stack && (
                  <pre className="mt-2 text-[10px] text-rose-400/80 whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white font-outfit font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
              >
                Clear Cache &amp; Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
