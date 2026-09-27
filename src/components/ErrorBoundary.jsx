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
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-obsidian-900/90 border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
              ✨
            </div>
            <h1 className="font-unbounded font-black text-2xl text-white mb-2 uppercase tracking-wide">
              ELIXORA 2.0
            </h1>
            <p className="text-sm text-slate-300 font-outfit mb-6">
              Something unexpected happened while initializing the experience. Click below to refresh.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-cyber-violet text-white font-outfit font-extrabold text-sm tracking-wider uppercase shadow-neon-gold hover:scale-105 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
