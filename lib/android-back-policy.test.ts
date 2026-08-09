import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAndroidBackAction } from './android-back-policy.ts';

test('closes the currently open virtual-phone app first', () => {
  assert.equal(resolveAndroidBackAction('settings'), 'close-active-app');
  assert.equal(resolveAndroidBackAction('chat'), 'close-active-app');
});

test('minimizes Android from the desktop root', () => {
  assert.equal(resolveAndroidBackAction(null), 'minimize');
});
