/**
 * Page Object for TODO Application
 * Encapsulates selectors and interaction methods for UI tests
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors (using stable identifiers)
    this.todoInput = 'input[placeholder*="What needs to be done"]';
    this.addButton = 'button:has-text("Add")';
    this.todoListItem = '.MuiListItem-root';
    this.todoCheckbox = 'input[type="checkbox"]';
    this.editButton = 'button[aria-label="edit"]';
    this.deleteButton = 'button[aria-label="delete"]';
    this.saveButton = 'button:has-text("Save")';
    this.cancelButton = 'button:has-text("Cancel")';
    this.editInput = 'input[type="text"]:not([placeholder])';
    this.errorMessage = 'p:has-text("Error")';
    this.emptyStateMessage = 'p:has-text("No todos yet")';
    this.statsChip = '.MuiChip-label';
  }

  /**
   * Navigate to the TODO application
   */
  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to be ready
    await this.page.waitForSelector(this.todoInput, { state: 'visible' });
  }

  /**
   * Add a new todo item
   * @param {string} text - The todo text
   */
  async addTodo(text) {
    await this.page.fill(this.todoInput, text);
    await this.page.click(this.addButton);
    
    if (text.trim()) {
      // Wait for todo to appear (only if non-empty)
      await this.page.waitForSelector(`${this.todoListItem}:has-text("${text}")`, {
        state: 'visible',
        timeout: 5000
      });
    }
  }

  /**
   * Toggle todo completion status by index
   * @param {number} index - The todo index (0-based)
   */
  async toggleTodo(index) {
    const listItems = await this.page.locator(this.todoListItem).all();
    const checkbox = listItems[index].locator(this.todoCheckbox);
    
    // Get current state
    const wasChecked = await checkbox.isChecked();
    
    // Click to toggle
    await checkbox.click();
    
    // Wait for state to change (API call + React update)
    await this.page.waitForTimeout(500);
  }

  /**
   * Delete a todo by index
   * @param {number} index - The todo index (0-based)
   */
  async deleteTodo(index) {
    const listItems = await this.page.locator(this.todoListItem).all();
    const deleteBtn = listItems[index].locator(this.deleteButton);
    await deleteBtn.click();
    
    // Wait for deletion to complete (item removed from DOM)
    await this.page.waitForTimeout(500);
  }

  /**
   * Start editing a todo by index
   * @param {number} index - The todo index (0-based)
   */
  async startEditTodo(index) {
    const listItems = await this.page.locator(this.todoListItem).all();
    const editBtn = listItems[index].locator(this.editButton);
    await editBtn.click();
    
    // Wait for edit mode to activate
    await this.page.waitForSelector(this.saveButton, { state: 'visible' });
  }

  /**
   * Save edited todo
   * @param {string} newText - The new todo text
   */
  async saveEdit(newText) {
    const editField = this.page.locator(this.editInput).first();
    await editField.clear();
    await editField.fill(newText);
    await this.page.click(this.saveButton);
    
    // Wait for edit mode to close
    await this.page.waitForSelector(this.saveButton, { state: 'hidden', timeout: 3000 });
  }

  /**
   * Cancel editing
   */
  async cancelEdit() {
    await this.page.click(this.cancelButton);
  }

  /**
   * Get the count of todos
   * @returns {Promise<number>}
   */
  async getTodoCount() {
    const items = await this.page.locator(this.todoListItem).all();
    return items.length;
  }

  /**
   * Get todo text by index
   * @param {number} index - The todo index (0-based)
   * @returns {Promise<string>}
   */
  async getTodoText(index) {
    const listItems = await this.page.locator(this.todoListItem).all();
    const text = await listItems[index].textContent();
    // Extract just the todo text (remove button text)
    return text.replace(/edit/gi, '').replace(/delete/gi, '').trim();
  }

  /**
   * Check if todo is completed by index
   * @param {number} index - The todo index (0-based)
   * @returns {Promise<boolean>}
   */
  async isTodoCompleted(index) {
    const listItems = await this.page.locator(this.todoListItem).all();
    const checkbox = listItems[index].locator(this.todoCheckbox);
    return await checkbox.isChecked();
  }

  /**
   * Get the stats text (e.g., "2 items left")
   * @returns {Promise<string[]>}
   */
  async getStats() {
    const chips = await this.page.locator(this.statsChip).allTextContents();
    return chips;
  }

  /**
   * Check if empty state message is visible
   * @returns {Promise<boolean>}
   */
  async hasEmptyStateMessage() {
    return await this.page.locator(this.emptyStateMessage).isVisible();
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>}
   */
  async hasErrorMessage() {
    return await this.page.locator(this.errorMessage).isVisible();
  }
  /**
   * Reset backend state (for test isolation)
   */
  async reset() {
    try {
      await this.page.request.post('http://localhost:3001/api/test/reset');
    } catch (error) {
      // Ignore errors if backend doesn't support reset
      console.warn('Backend reset failed:', error.message);
    }
  }

}

module.exports = { TodoPage };
