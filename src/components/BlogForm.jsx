import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ onSuccess, onFailure }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await blogService.create({ title, author, url });
      console.log('response:', response);
      onSuccess(response);
    } catch (error) {
      onFailure(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          author:
          <input type='text' value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div>
          url:
          <input type='text' value={url} onChange={e => setUrl(e.target.value)} />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
