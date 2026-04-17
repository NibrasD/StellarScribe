import { useAppStore, Article } from '../store/useAppStore';
import { ArticleCard } from '../components/ArticleCard';
import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { fetchAllArticlesFromChain } from '../lib/stellar';

type FilterType = 'all' | 'free' | 'gated' | 'crowdfund';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'gated', label: 'Token-Gated' },
  { value: 'crowdfund', label: 'Crowdfunding' },
];

export function Explore() {
  const localArticles = useAppStore(state => state.articles);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [chainArticles, setChainArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Load articles from on-chain on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const onChain = await fetchAllArticlesFromChain();
        if (!cancelled) setChainArticles(onChain as Article[]);
      } catch (e) {
        console.error('Failed to fetch on-chain articles:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Merge local + on-chain articles, deduplicate by tokenId
  const allArticles = (() => {
    const byToken = new Map<number, Article>();
    // On-chain first (lower priority for content, since it's empty)
    for (const a of chainArticles) {
      if (a.tokenId) byToken.set(a.tokenId, a);
    }
    // Local articles override (they have full content text)
    for (const a of localArticles) {
      if (a.tokenId && byToken.has(a.tokenId)) {
        // Merge: keep local content but update on-chain stats
        const chain = byToken.get(a.tokenId)!;
        byToken.set(a.tokenId, { ...a, accessCount: chain.accessCount, tipCount: chain.tipCount, totalRaised: chain.totalRaised });
      } else {
        byToken.set(a.tokenId || Math.random(), a);
      }
    }
    // Also add on-chain articles that aren't in local yet
    return Array.from(byToken.values()).sort((a, b) => b.createdAt - a.createdAt);
  })();

  const filteredArticles = allArticles.filter(article => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch = 
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        (article.authorName || '').toLowerCase().includes(q) ||
        (article.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    
    // Type filter
    if (filter === 'free') return !article.isTokenGated && !article.crowdfundingGoal;
    if (filter === 'gated') return article.isTokenGated;
    if (filter === 'crowdfund') return !!article.crowdfundingGoal;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <span className="eyebrow">Discover</span>
        <h1 className="text-[48px] font-serif tracking-[-1.5px] leading-[1.05] mb-6">
          Explore the <span className="text-gradient">Network</span>
        </h1>
        
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, authors, tags..."
              className="input-field pl-11 !rounded-sm"
            />
          </div>
          
          <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-1">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[1.5px] cursor-pointer rounded-sm transition-all ${
                  filter === value
                    ? 'bg-primary text-white'
                    : 'text-[var(--color-text-dim)] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <span className="label-sm">{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}</span>
        {filter !== 'all' && (
          <button 
            onClick={() => { setFilter('all'); setSearch(''); }}
            className="text-[10px] font-mono uppercase tracking-wider text-primary hover:text-white transition-colors cursor-pointer"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* Article Grid */}
      {loading ? (
        <div className="glass-panel p-16 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-serif mb-2">Loading from Stellar Network...</h3>
          <p className="text-[13px] text-[var(--color-text-dim)] font-mono">
            Fetching on-chain content via Soroban
          </p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.03] flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-xl font-serif mb-2 text-[var(--color-text-secondary)]">No articles found</h3>
          <p className="text-[13px] text-[var(--color-text-dim)] font-mono">
            {search ? `No results for "${search}"` : 'No articles match this filter'}
          </p>
        </div>
      )}
    </div>
  );
}
