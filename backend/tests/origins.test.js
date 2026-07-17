import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { getAllowedOrigins, isOriginAllowed } from '../config/origins.js';

const originalClientUrl = process.env.CLIENT_URL;

afterEach(() => {
  if (originalClientUrl === undefined) delete process.env.CLIENT_URL;
  else process.env.CLIENT_URL = originalClientUrl;
});

test('uses safe local development defaults without configuration', () => {
  delete process.env.CLIENT_URL;

  assert.deepEqual(getAllowedOrigins(), [
    'http://localhost:3000',
    'http://localhost:3001'
  ]);
});

test('normalizes configured origins and removes duplicates', () => {
  process.env.CLIENT_URL =
    'HTTPS://APP.EXAMPLE.COM/, https://app.example.com, https://admin.example.com/';

  assert.deepEqual(getAllowedOrigins(), [
    'https://app.example.com',
    'https://admin.example.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ]);
});

test('derives the scoped Netlify deploy-preview pattern for a production site', () => {
  process.env.CLIENT_URL = 'https://workhub-demo.netlify.app';

  const origins = getAllowedOrigins();
  assert.ok(origins.includes('https://*--workhub-demo.netlify.app'));
  assert.equal(
    isOriginAllowed('https://42--workhub-demo.netlify.app', origins),
    true
  );
});

test('rejects suffix spoofing and previews for a different Netlify site', () => {
  const origins = ['https://app.example.com', 'https://*--workhub-demo.netlify.app'];

  assert.equal(isOriginAllowed('https://app.example.com.attacker.test', origins), false);
  assert.equal(isOriginAllowed('https://42--other-site.netlify.app', origins), false);
});

test('accepts server-to-server requests without Origin and local development ports', () => {
  assert.equal(isOriginAllowed(undefined, []), true);
  assert.equal(isOriginAllowed('http://localhost:5173', []), true);
  assert.equal(isOriginAllowed('http://127.0.0.1:8080', []), true);
});
