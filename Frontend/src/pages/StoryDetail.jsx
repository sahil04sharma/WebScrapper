import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StoryDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, bookmarks, toggleBookmark } = useAuth();
  const [story, setStory] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/stories/${id}`);
        setStory(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!story) return null;

  const isBookmarked = bookmarks?.some((b) => (b._id || b) === story._id);

  return (
    <article className="story-detail">
      <Link to="/" className="back-link">← Back to stories</Link>
      <h2>{story.title}</h2>
      <p className="story-meta">
        <strong>{story.points}</strong> points · by {story.author} · {story.postedAt}
      </p>
      <p>
        <a href={story.url} target="_blank" rel="noreferrer">{story.url}</a>
      </p>
      {isAuthenticated && (
        <button
          className={`btn ${isBookmarked ? 'btn-primary' : ''}`}
          onClick={() => toggleBookmark(story._id)}
        >
          {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
        </button>
      )}
    </article>
  );
};

export default StoryDetail;
