import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';

const Stories = () => {
  const [data, setData] = useState({ stories: [], page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (p) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/stories?page=${p}&limit=10`);
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  const handleRescrape = async () => {
    setRefreshing(true);
    try {
      await api.post('/scrape');
      await load(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Scrape failed');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="stories-page">
      <div className="page-header">
        <div>
          <h2>Top Stories</h2>
          <p className="muted">Sorted by points · {data.total} total</p>
        </div>
        <button className="btn" onClick={handleRescrape} disabled={refreshing}>
          {refreshing ? 'Re-scraping…' : 'Re-scrape now'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="stories-list">
          {data.stories.map((s) => (
            <StoryCard key={s._id} story={s} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>
        <span>Page {data.page} of {data.totalPages}</span>
        <button
          className="btn"
          disabled={page >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default Stories;
