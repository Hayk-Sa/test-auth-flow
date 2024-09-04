const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    date: 'April 15, 2023',
    content: 'React is a popular JavaScript library for building user interfaces. In this post, we\'ll explore the basics of React and how to create your first component.',
  },
  {
    id: 2,
    title: 'The Power of Tailwind CSS',
    date: 'April 22, 2023',
    content: 'Tailwind CSS is a utility-first CSS framework that allows you to rapidly build custom user interfaces. Learn how to use it to create beautiful, responsive designs.',
  },
  {
    id: 3,
    title: 'State Management with Redux',
    date: 'April 29, 2023',
    content: 'Redux is a predictable state container for JavaScript apps. Discover how to manage complex application states efficiently using Redux.',
  },
];

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Tech Blog</h1>
      {blogPosts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{post.date}</p>
          <p className="text-gray-600 leading-relaxed">{post.content}</p>
        </article>
      ))}
    </div>
  );
}