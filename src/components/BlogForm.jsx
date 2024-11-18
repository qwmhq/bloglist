import { useState } from 'react';

const BlogForm = ({ submitFn }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    if (await submitFn({ title, author, url })) {
      setTitle('');
      setAuthor('');
      setUrl('');
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
