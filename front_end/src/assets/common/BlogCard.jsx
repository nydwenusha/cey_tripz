import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import './../css/BlogCard.scss';

const BlogCard = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="blog-card">
      <div className="card-image-wrapper">
        <CardMedia
          component="img"
          height="240"
          image={post.image}
          alt={post.title}
          className="card-image"
        />
        <Chip
          label={post.category}
          className="category-chip"
          size="small"
        />
      </div>

      <CardContent className="card-content">
        <div className="post-meta">
          <Box className="author-info">
            <Avatar className="author-avatar">
              {post.author.charAt(0)}
            </Avatar>
            <Typography variant="body2" className="author-name">
              {post.author}
            </Typography>
          </Box>
          <Typography variant="caption" className="post-date">
            {post.date}
          </Typography>
        </div>

        <Typography variant="h5" className="post-title">
          {post.title}
        </Typography>

        <div className="location-info">
          <LocationOnIcon className="location-icon" />
          <Typography variant="body2" className="location-text">
            {post.location}
          </Typography>
        </div>

        <Typography variant="body2" className="post-excerpt">
          {post.excerpt}
        </Typography>

        <div className="read-time">
          <AccessTimeIcon className="time-icon" />
          <Typography variant="caption">
            {post.readTime}
          </Typography>
        </div>

        <Stack direction="row" spacing={1} className="tags">
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              className="tag-chip"
            />
          ))}
        </Stack>
      </CardContent>

      <CardActions className="card-actions">
        <Button
          variant="outlined"
          className="read-more-btn"
          onClick={() => window.location.href = `/blog/${post.id}`}
        >
          Read More
        </Button>
        <Box className="action-icons">
          <IconButton onClick={handleLike} className="like-button">
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            <Typography variant="caption">{likesCount}</Typography>
          </IconButton>
          <IconButton className="comment-button">
            <CommentIcon />
            <Typography variant="caption">{post.comments}</Typography>
          </IconButton>
          <IconButton className="share-button">
            <ShareIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogCard;