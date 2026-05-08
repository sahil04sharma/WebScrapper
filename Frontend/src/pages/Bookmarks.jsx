import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

const Bookmarks = () => {
  const { bookmarks } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stories/bookmarks/me');
      setStories(data.bookmarks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload whenever bookmarks change (e.g. user un-bookmarks from this page)
  useEffect(() => {
    load();
  }, [load, bookmarks.length]);

  return (
    <section>
      <h2>Your Bookmarks</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : stories.length === 0 ? (
        <p className="muted">No bookmarks yet. Star stories to save them here.</p>
      ) : (
        <div className="stories-list">
          {stories.map((s) => (
            <StoryCard key={s._id} story={s} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Bookmarks;
