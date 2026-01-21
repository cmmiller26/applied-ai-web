'use client';

import { useState } from 'react';
import { createTutorial, deleteTutorial } from '@/app/actions/tutorials';
import { Tutorial } from '@/db/schema';

interface TutorialsListProps {
  tutorials: Tutorial[];
}

export default function TutorialsList({ tutorials: initialTutorials }: TutorialsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createTutorial(formData);
    
    if (result.success) {
      setMessage('Tutorial created successfully!');
      form.reset();
      setShowForm(false);
    } else {
      setMessage(result.message || 'Failed to create tutorial');
    }
    
    setLoading(false);
  }
  
  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    
    const result = await deleteTutorial(id);
    if (result.success) {
      setMessage('Tutorial deleted successfully!');
    } else {
      setMessage(result.message || 'Failed to delete tutorial');
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Tutorial'}
        </button>
        {message && (
          <p className={message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {message}
          </p>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="border dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              placeholder="e.g., Python, Machine Learning"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              defaultValue={0}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Tutorial'}
          </button>
        </form>
      )}
      
      <div className="space-y-2">
        {initialTutorials.map((tutorial) => (
          <div key={tutorial.id} className="flex justify-between items-center border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{tutorial.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tutorial.category}</p>
              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                {tutorial.url}
              </a>
            </div>
            <button
              onClick={() => handleDelete(tutorial.id)}
              className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
