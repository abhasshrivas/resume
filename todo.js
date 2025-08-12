(function(){
  'use strict';

  /** State and persistence **/
  /**
   * @typedef {Object} TodoItem
   * @property {string} id
   * @property {string} text
   * @property {boolean} completed
   * @property {number} createdAt
   */

  /** @type {TodoItem[]} */
  let items = [];
  /** @type {'all'|'active'|'completed'} */
  let activeFilter = 'all';

  const STORAGE_KEY = 'todo-items-v1';
  const FILTER_KEY = 'todo-filter-v1';

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){ items = JSON.parse(raw); }
      const savedFilter = localStorage.getItem(FILTER_KEY);
      if(savedFilter === 'all' || savedFilter === 'active' || savedFilter === 'completed'){
        activeFilter = savedFilter;
      }
    }catch(err){
      console.error('Failed to load state', err);
      items = [];
    }
  }

  function saveState(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(FILTER_KEY, activeFilter);
    }catch(err){
      console.error('Failed to save state', err);
    }
  }

  /** DOM **/
  const form = document.getElementById('new-task-form');
  const input = document.getElementById('new-task-input');
  const list = document.getElementById('todo-list');
  const itemsLeftEl = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  /** Utils **/
  function generateId(){
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  }

  function getVisibleItems(){
    if(activeFilter === 'active') return items.filter(it => !it.completed);
    if(activeFilter === 'completed') return items.filter(it => it.completed);
    return items.slice();
  }

  function pluralize(count, singular, plural){
    return count === 1 ? singular : plural;
  }

  /** Render **/
  function render(){
    // Items
    const visible = getVisibleItems();
    list.innerHTML = '';

    for(const item of visible){
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = item.id;

      const checkbox = document.createElement('button');
      checkbox.className = `checkbox ${item.completed ? 'is-checked' : ''}`;
      checkbox.setAttribute('type', 'button');
      checkbox.setAttribute('aria-pressed', String(item.completed));
      checkbox.setAttribute('aria-label', item.completed ? 'Mark as active' : 'Mark as completed');
      checkbox.innerHTML = `
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      const text = document.createElement('div');
      text.className = `todo-text ${item.completed ? 'is-completed' : ''}`;
      text.textContent = item.text;
      text.tabIndex = 0;
      text.setAttribute('role', 'textbox');
      text.setAttribute('aria-label', 'Edit task');

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.setAttribute('type', 'button');
      editBtn.setAttribute('aria-label', 'Edit');
      editBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn icon-btn--danger';
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.setAttribute('aria-label', 'Delete');
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
        </svg>`;

      li.appendChild(checkbox);
      li.appendChild(text);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(actions);

      list.appendChild(li);
    }

    // Counters
    const remaining = items.filter(it => !it.completed).length;
    itemsLeftEl.textContent = `${remaining} ${pluralize(remaining, 'item', 'items')} left`;

    // Filters UI
    for(const btn of filterButtons){
      const isActive = btn.dataset.filter === activeFilter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    }

    // Clear completed button state
    clearCompletedBtn.disabled = items.every(it => !it.completed);
  }

  /** Actions **/
  function addItem(text){
    const trimmed = text.trim();
    if(!trimmed) return;
    const item = { id: generateId(), text: trimmed, completed: false, createdAt: Date.now() };
    items.unshift(item);
    saveState();
    render();
  }

  function toggleItem(id){
    const item = items.find(it => it.id === id);
    if(!item) return;
    item.completed = !item.completed;
    saveState();
    render();
  }

  function deleteItem(id){
    const before = items.length;
    items = items.filter(it => it.id !== id);
    if(items.length !== before){
      saveState();
      render();
    }
  }

  function editItem(id, newText){
    const trimmed = newText.trim();
    if(!trimmed){
      deleteItem(id);
      return;
    }
    const item = items.find(it => it.id === id);
    if(!item) return;
    if(item.text !== trimmed){
      item.text = trimmed;
      saveState();
      render();
    }
  }

  function clearCompleted(){
    const hadCompleted = items.some(it => it.completed);
    if(!hadCompleted) return;
    items = items.filter(it => !it.completed);
    saveState();
    render();
  }

  /** Inline edit helpers **/
  function enterEditMode(li){
    const id = li.dataset.id;
    const textEl = li.querySelector('.todo-text');
    if(!textEl) return;

    const current = textEl.textContent || '';
    const inputEl = document.createElement('input');
    inputEl.className = 'edit-input';
    inputEl.value = current;
    inputEl.setAttribute('aria-label', 'Edit task');

    function commit(){ editItem(id, inputEl.value); }
    function cancel(){ exitEditMode(li, current); }

    inputEl.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') commit();
      else if(e.key === 'Escape') cancel();
    });
    inputEl.addEventListener('blur', commit);

    textEl.replaceWith(inputEl);
    inputEl.focus();
    inputEl.select();
  }

  function exitEditMode(li, text){
    const inputEl = li.querySelector('.edit-input');
    if(!inputEl) return;
    const div = document.createElement('div');
    const isCompleted = li.querySelector('.checkbox')?.classList.contains('is-checked');
    div.className = `todo-text ${isCompleted ? 'is-completed' : ''}`;
    div.textContent = text;
    div.tabIndex = 0;
    div.setAttribute('role', 'textbox');
    div.setAttribute('aria-label', 'Edit task');
    inputEl.replaceWith(div);
  }

  /** Event wiring **/
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addItem(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      addItem(input.value);
      input.value = '';
    }
  });

  list.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('.todo-item');
    if(!li) return;
    const id = li.dataset.id;

    if(target.closest('.checkbox')){
      toggleItem(id);
      return;
    }
    if(target.closest('.icon-btn--danger')){
      deleteItem(id);
      return;
    }
    if(target.closest('.icon-btn')){
      enterEditMode(li);
      return;
    }
  });

  list.addEventListener('dblclick', (e) => {
    const li = e.target.closest('.todo-item');
    if(!li) return;
    if(e.target.classList.contains('todo-text')){
      enterEditMode(li);
    }
  });

  list.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && e.target.classList.contains('todo-text')){
      e.preventDefault();
      const li = e.target.closest('.todo-item');
      if(li) enterEditMode(li);
    }
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  for(const btn of filterButtons){
    btn.addEventListener('click', () => {
      const next = btn.dataset.filter;
      if(next === 'all' || next === 'active' || next === 'completed'){
        activeFilter = next;
        saveState();
        render();
      }
    });
  }

  // Initialize
  loadState();
  render();
})();