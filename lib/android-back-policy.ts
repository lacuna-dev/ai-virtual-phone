export type AndroidBackAction = 'close-active-app' | 'minimize';

export function resolveAndroidBackAction(activeApp: string | null): AndroidBackAction {
  return activeApp ? 'close-active-app' : 'minimize';
}
