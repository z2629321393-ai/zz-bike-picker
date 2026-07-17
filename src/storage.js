import { APP_VERSION, DEFAULT_ANSWERS, STORAGE_KEY } from './config.js';

export function createInitialState() {
  return {
    version: APP_VERSION,
    current: 0,
    answers: { ...DEFAULT_ANSWERS, avoid: [] },
    completed: false,
    updatedAt: new Date().toISOString()
  };
}

export function saveState(state) {
  try {
    const payload = { ...state, version: APP_VERSION, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {
    // 隐私模式或存储被禁用时，继续允许测试运行。
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      answers: {
        ...DEFAULT_ANSWERS,
        ...(parsed.answers || {}),
        avoid: Array.isArray(parsed.answers?.avoid) ? parsed.answers.avoid : []
      }
    };
  } catch (_) {
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    // 忽略。
  }
}
