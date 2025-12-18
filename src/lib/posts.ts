export interface Post {
  id: string;
  title: string;
  date: string;
  body: string;
  createdAt: number;
}

const POSTS_KEY = "admin_posts";

export function getPosts(): Post[] {
  const stored = localStorage.getItem(POSTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function savePost(post: Omit<Post, "id" | "createdAt">): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  posts.unshift(newPost);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return newPost;
}

export function updatePost(id: string, updates: Partial<Omit<Post, "id" | "createdAt">>): Post | null {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  posts[index] = { ...posts[index], ...updates };
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts[index];
}

export function deletePost(id: string): void {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}
