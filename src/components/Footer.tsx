import { Gem, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Gem className="w-5 h-5 text-primary" />
              <span className="text-[18px] font-serif">
                Stellar<span className="text-gradient">Scribe</span>
              </span>
            </Link>
            <p className="text-[13px] text-[var(--color-text-dim)] leading-relaxed max-w-sm mb-6">
              The decentralized content platform built on Stellar. Publish, tokenize, and monetize your writing using Soroban smart contracts.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-accent">
                Soroban Testnet
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-text-dim)] mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/explore" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/write" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors">Write</Link></li>
              <li><Link to="/dashboard" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-text-dim)] mb-5">Ecosystem</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://stellar.org" target="_blank" rel="noreferrer" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors inline-flex items-center gap-1.5">
                  Stellar Network <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors inline-flex items-center gap-1.5">
                  Soroban Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://freighter.app" target="_blank" rel="noreferrer" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors inline-flex items-center gap-1.5">
                  Freighter Wallet <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <Github className="w-3 h-3" /> Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-[1px]">
            © 2025 StellarScribe — Built on Stellar
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[1px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Soroban Smart Contracts
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-[1px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Freighter Wallet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
