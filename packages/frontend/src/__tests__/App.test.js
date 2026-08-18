import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
const mockFetch = (data = [], error = false) => {
  global.fetch = jest.fn((url, options) => {
    if (error) {
      return Promise.reject(new Error('Network error'));
    }
    
    // Handle DELETE requests
    if (options?.method === 'DELETE') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Todo deleted' }),
      });
    }
    
    // Handle PUT requests (edit)
    if (options?.method === 'PUT') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, title: 'Updated', completed: false }),
      });
    }
    
    // Handle GET requests
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });
  });
};

test('renders TODO App heading', async () => {
  mockFetch();
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('shows empty state message when no todos', async () => {
  mockFetch([]);
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});

test('calculates and displays stats correctly', async () => {
  const mockTodos = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
  ];
  mockFetch(mockTodos);
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  // Wait for first stat
  await waitFor(() => {
    expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
  });
  
  // Check second stat
  expect(screen.getByText(/1 completed/i)).toBeInTheDocument();
});

test('deletes a todo when delete button clicked', async () => {
  const mockTodos = [
    { id: 1, title: 'Task to delete', completed: false },
  ];
  mockFetch(mockTodos);
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  // Wait for todo to appear
  await waitFor(() => {
    expect(screen.getByText('Task to delete')).toBeInTheDocument();
  });

  // Click delete button
  const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
  await userEvent.click(deleteButton);

  // Verify fetch was called with DELETE method
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

test('shows error message when API fails', async () => {
  mockFetch([], true);
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });
});

test('edits a todo when edit is clicked and saved', async () => {
  const mockTodos = [
    { id: 1, title: 'Original title', completed: false },
  ];
  mockFetch(mockTodos);
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  // Wait for todo to appear
  await waitFor(() => {
    expect(screen.getByText('Original title')).toBeInTheDocument();
  });

  // Click edit button
  const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
  await userEvent.click(editButton);

  // Should show input field for editing
  const editInput = await screen.findByDisplayValue('Original title');
  expect(editInput).toBeInTheDocument();

  // Change the title
  await userEvent.clear(editInput);
  await userEvent.type(editInput, 'Updated title');

  // Save the edit (look for save button or press enter)
  const saveButton = screen.getByRole('button', { name: /save/i });
  await userEvent.click(saveButton);

  // Verify PUT request was made
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({ 
        method: 'PUT',
        body: expect.stringContaining('Updated title')
      })
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
