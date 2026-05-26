/* =============================================
   TO-DO APP — app.js
   ============================================= */

const app = (() => {

  /* ── State ─────────────────────────────────── */
  let tasks = [];          // { id, text, done, addedAt, completedAt }
  let editingId = null;

  /* ── DOM refs ───────────────────────────────── */
  const $ = id => document.getElementById(id);

  const taskInput    = $('task-input');
  const pendingList  = $('pending-list');
  const completedList= $('completed-list');
  const emptyPending = $('empty-pending');
  const emptyDone    = $('empty-completed');
  const modalOverlay = $('modal-overlay');
  const modalInput   = $('modal-input');
  const toastEl      = $('toast');

  const totalCount   = $('total-count');
  const pendingCount = $('pending-count');
  const doneCount    = $('done-count');
  const badgePending = $('badge-pending');
  const badgeDone    = $('badge-done');

  /* ── Helpers ────────────────────────────────── */
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function formatDateTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
  }

  function setDate() {
    const now = new Date();
    $('app-date').textContent = now.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ── Persistence (localStorage) ─────────────── */
  function saveTasks() {
    localStorage.setItem('todo_tasks_v1', JSON.stringify(tasks));
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem('todo_tasks_v1');
      tasks = raw ? JSON.parse(raw) : [];
    } catch {
      tasks = [];
    }
  }

  /* ── Render ─────────────────────────────────── */
  function render() {
    const pending   = tasks.filter(t => !t.done);
    const completed = tasks.filter(t =>  t.done);

    // Counts
    totalCount.textContent   = tasks.length;
    pendingCount.textContent = pending.length;
    doneCount.textContent    = completed.length;
    badgePending.textContent = pending.length;
    badgeDone.textContent    = completed.length;

    // Pending list
    pendingList.innerHTML = '';
    if (pending.length === 0) {
      pendingList.appendChild(emptyPending);
      emptyPending.style.display = 'flex';
    } else {
      emptyPending.style.display = 'none';
      pending.forEach(t => pendingList.appendChild(createCard(t)));
    }

    // Completed list
    completedList.innerHTML = '';
    if (completed.length === 0) {
      completedList.appendChild(emptyDone);
      emptyDone.style.display = 'flex';
    } else {
      emptyDone.style.display = 'none';
      completed.forEach(t => completedList.appendChild(createCard(t)));
    }

    // Show/hide clear btn
    $('clear-btn').style.display = completed.length ? 'flex' : 'none';

    saveTasks();
  }

  /* ── Card builder ───────────────────────────── */
  function createCard(task) {
    const card = document.createElement('div');
    card.className = `task-card${task.done ? ' is-done' : ''}`;
    card.dataset.id = task.id;

    // Top row
    const top = document.createElement('div');
    top.className = 'task-top';

    // Check button
    const checkBtn = document.createElement('button');
    checkBtn.className = `check-btn${task.done ? ' checked' : ''}`;
    checkBtn.title = task.done ? 'Mark as pending' : 'Mark as complete';
    checkBtn.setAttribute('aria-label', task.done ? 'Mark as pending' : 'Mark as complete');
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkBtn.addEventListener('click', () => toggleDone(task.id));

    // Body
    const body = document.createElement('div');
    body.className = 'task-body';

    const textEl = document.createElement('div');
    textEl.className = `task-text${task.done ? ' done' : ''}`;
    textEl.textContent = task.text;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const addedLine = document.createElement('div');
    addedLine.className = 'meta-line';
    addedLine.innerHTML = `<i class="fa-regular fa-clock"></i> Added: ${formatDateTime(task.addedAt)}`;
    meta.appendChild(addedLine);

    if (task.done && task.completedAt) {
      const doneLine = document.createElement('div');
      doneLine.className = 'meta-line meta-completed';
      doneLine.innerHTML = `<i class="fa-solid fa-circle-check"></i> Completed: ${formatDateTime(task.completedAt)}`;
      meta.appendChild(doneLine);
    }

    body.appendChild(textEl);
    body.appendChild(meta);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit task';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.addEventListener('click', () => openModal(task.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete';
    delBtn.title = 'Delete task';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    top.appendChild(checkBtn);
    top.appendChild(body);
    top.appendChild(actions);
    card.appendChild(top);

    return card;
  }

  /* ── Actions ────────────────────────────────── */
  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.focus();
      taskInput.style.borderColor = 'var(--red)';
      setTimeout(() => taskInput.style.borderColor = '', 900);
      return;
    }
    tasks.unshift({ id: genId(), text, done: false, addedAt: Date.now(), completedAt: null });
    taskInput.value = '';
    taskInput.focus();
    render();
    showToast('Task added');
  }

  function toggleDone(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    render();
    showToast(task.done ? 'Task completed ✓' : 'Task moved back to pending');
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
    showToast('Task deleted');
  }

  function clearCompleted() {
    const count = tasks.filter(t => t.done).length;
    if (!count) return;
    if (!confirm(`Delete all ${count} completed task${count > 1 ? 's' : ''}?`)) return;
    tasks = tasks.filter(t => !t.done);
    render();
    showToast(`${count} completed task${count > 1 ? 's' : ''} cleared`);
  }

  /* ── Modal (Edit) ───────────────────────────── */
  function openModal(id) {
    editingId = id;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    modalInput.value = task.text;
    modalOverlay.classList.add('open');
    setTimeout(() => modalInput.focus(), 80);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    editingId = null;
  }

  function saveEdit() {
    const newText = modalInput.value.trim();
    if (!newText) { modalInput.focus(); return; }
    const task = tasks.find(t => t.id === editingId);
    if (task) task.text = newText;
    closeModal();
    render();
    showToast('Task updated');
  }

  /* ── Event listeners ────────────────────────── */
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  modalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') closeModal();
  });

  /* ── Init ───────────────────────────────────── */
  function init() {
    setDate();
    loadTasks();
    render();
    // Hide clear btn initially if no completed
    $('clear-btn').style.display = 'none';
  }

  init();

  // Public API
  return { addTask, clearCompleted, openModal, closeModal, saveEdit };

})();
