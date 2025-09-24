import type { BlogPost } from './types';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import 'server-only';

// Cache article list to avoid duplicate reads
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const postsDirectory = path.join(process.cwd(), 'content/blog');

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Blog content directory does not exist yet:', postsDirectory);
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(
    filenames
      .filter(name => name.endsWith('.md') && !name.startsWith('_'))
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...data,
          slug: filename.replace(/\.md$/, ''),
          content,
        } as BlogPost;
      }),
  );

  // Sort by publish date
  return posts.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
});

// Get single article
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
});

// Get featured articles
export const getFeaturedPosts = cache(async (limit = 3): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  return posts.filter(post => post.featured).slice(0, limit);
});

// Get articles filtered by category
export const getPostsByCategory = cache(async (category: string): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  return posts.filter(post => post.category === category);
});

// Get articles filtered by tag
export const getPostsByTag = cache(async (tag: string): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
});

// Search articles
export const searchPosts = cache(async (query: string): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  const searchTerm = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm)
    || post.description.toLowerCase().includes(searchTerm)
    || post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    || post.content.toLowerCase().includes(searchTerm),
  );
});

// Get related articles
export const getRelatedPosts = cache(async (
  currentSlug: string,
  limit = 3,
): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  const currentPost = posts.find(p => p.slug === currentSlug);

  if (!currentPost) {
    return [];
  }

  // Recommend based on tag similarity
  return posts
    .filter(p => p.slug !== currentSlug)
    .map(post => ({
      post,
      score: post.tags.filter(tag =>
        currentPost.tags.includes(tag),
      ).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
});

// Get all categories
export const getAllCategories = cache(async (): Promise<string[]> => {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map(post => post.category)));
  return categories.sort();
});

// Get all tags
export const getAllTags = cache(async (): Promise<string[]> => {
  const posts = await getAllPosts();
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  return tags.sort();
});

// Get blog statistics
export const getBlogStats = cache(async () => {
  const posts = await getAllPosts();
  return {
    totalPosts: posts.length,
    featuredPosts: posts.filter(p => p.featured).length,
    categories: await getAllCategories(),
    tags: await getAllTags(),
    latestPost: posts[0],
  };
});
