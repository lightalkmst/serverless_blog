CREATE SCHEMA blog;

CREATE TABLE IF NOT EXISTS blog.users (
  id SERIAL PRIMARY KEY,
  email TEXT,
  pass TEXT,
  name TEXT
);

CREATE TABLE IF NOT EXISTS blog.posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES blog.users(id),
  title TEXT,
  summary TEXT,
  created TIMESTAMPTZ,
  updated TIMESTAMPTZ,
  tags TEXT,
  published BOOLEAN,
  post TEXT
);

CREATE TABLE IF NOT EXISTS blog.comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES blog.users(id),
  replied_comment_id INTEGER,
  comment TEXT,
  created TIMESTAMPTZ,
  updated TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS blog.messages (
  id SERIAL PRIMARY KEY,
  user_from_id INTEGER REFERENCES blog.users(id),
  user_to_id INTEGER REFERENCES blog.users(id),
  message TEXT,
  created TIMESTAMPTZ,
  updated TIMESTAMPTZ
);
