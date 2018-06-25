CREATE SCHEMA blog;

CREATE TABLE IF NOT EXISTS blog.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  pass TEXT,
  name TEXT,
  roles TEXT,
  verified BOOLEAN,
  created TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog.posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES blog.users(id),
  title TEXT,
  summary TEXT,
  created TIMESTAMP,
  updated TIMESTAMP,
  tags TEXT,
  published BOOLEAN,
  post TEXT
);

CREATE TABLE IF NOT EXISTS blog.comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog.posts(id),
  user_id INTEGER REFERENCES blog.users(id),
  replied_comment_id INTEGER,
  comment TEXT,
  created TIMESTAMP,
  updated TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog.messages (
  id SERIAL PRIMARY KEY,
  user_from_id INTEGER REFERENCES blog.users(id),
  user_to_id INTEGER REFERENCES blog.users(id),
  message TEXT,
  created TIMESTAMP,
  updated TIMESTAMP
);
