import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StoryCard = ({ story }) => {
  const { isAuthenticated, bookmarks, toggleBookmark } = useAuth();
  const isBookmarked = bookmarks?.some((b) => (b._id || b) === story._id);

  const handleToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      await toggleBookmark(story._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="story-card">
      <div className="story-points">{story.points}</div>
      <div className="story-body">
        <h3 className="story-title">
          <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
        </h3>
        <div className="story-meta">
          <span>by <strong>{story.author}</strong></span>
          <span>· {story.postedAt}</span>
          <Link to={`/stories/${story._id}`} className="story-detail-link">details</Link>
        </div>
      </div>
      {isAuthenticated && (
        <button
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleToggle}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      )}
    </article>
  );
};

export default StoryCard;
