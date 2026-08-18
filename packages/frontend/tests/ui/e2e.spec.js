/**
 * End-to-End UI Tests for TODO Application
 * Tests critical user journeys using Page Object Model
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TODO Application - Critical User Journeys', () => {
  let todoPage;

  // Fresh page for each test (isolation)
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.reset();  // Clear backend state before each test
  });

  // Test 1: Create todo (happy path)
  test('should create a new todo', async () => {
    await todoPage.addTodo('Buy groceries');
    
    // Verify todo appears in list
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
    
    const text = await todoPage.getTodoText(0);
    expect(text).toContain('Buy groceries');
  });

  // Test 2: Toggle todo completion status
  test('should toggle todo completion status', async () => {
    // Create a todo first
    await todoPage.addTodo('Complete this task');
    
    // Verify it's initially not completed
    const initiallyCompleted = await todoPage.isTodoCompleted(0);
    expect(initiallyCompleted).toBe(false);
    
    // Toggle to completed
    await todoPage.toggleTodo(0);
    
    // Verify it's now completed
    const nowCompleted = await todoPage.isTodoCompleted(0);
    expect(nowCompleted).toBe(true);
    
    // Toggle back to incomplete
    await todoPage.toggleTodo(0);
    
    // Verify it's back to incomplete
    const finalCompleted = await todoPage.isTodoCompleted(0);
    expect(finalCompleted).toBe(false);
  });

  // Test 3: Delete a todo
  test('should delete a todo', async () => {
    // Create a todo first
    await todoPage.addTodo('Task to delete');
    expect(await todoPage.getTodoCount()).toBe(1);
    
    // Delete the todo
    await todoPage.deleteTodo(0);
    
    // Verify it's gone
    expect(await todoPage.getTodoCount()).toBe(0);
    
    // Verify empty state appears
    const hasEmptyState = await todoPage.hasEmptyStateMessage();
    expect(hasEmptyState).toBe(true);
  });

  // Test 4: Edit todo text
  test('should edit todo text', async () => {
    // Create a todo first
    await todoPage.addTodo('Original text');
    
    // Start editing
    await todoPage.startEditTodo(0);
    
    // Save with new text
    await todoPage.saveEdit('Updated text');
    
    // Verify text changed
    const updatedText = await todoPage.getTodoText(0);
    expect(updatedText).toContain('Updated text');
    expect(updatedText).not.toContain('Original text');
  });

  // Test 5: Stats calculation and display
  test('should calculate and display stats correctly', async () => {
    // Create multiple todos
    await todoPage.addTodo('First task');
    await todoPage.addTodo('Second task');
    await todoPage.addTodo('Third task');
    
    // Initially all incomplete
    const initialStats = await todoPage.getStats();
    expect(initialStats[0]).toContain('3 items left');
    expect(initialStats[1]).toContain('0 completed');
    
    // Complete one todo
    await todoPage.toggleTodo(0);
    
    // Verify stats updated
    const updatedStats = await todoPage.getStats();
    expect(updatedStats[0]).toContain('2 items left');
    expect(updatedStats[1]).toContain('1 completed');
  });
});