import { Given, When, Then, Before, After, AfterAll, setWorldConstructor, World } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createApp } from '../../src/app.ts';
import { prisma } from '../../src/db.ts';
import { sessionPool } from '../../src/middleware/session.ts';
import { Client, PW, makeUser } from '../../tests/helpers.ts';

const app = createApp();

class LoginWorld extends World {
  client?: Client;
  studentId?: string;
  email?: string;
  loginStatus?: number;
}

setWorldConstructor(LoginWorld);

Before(function (this: LoginWorld) {
  this.loginStatus = undefined;
});

Given('a registered student exists', async function (this: LoginWorld) {
  this.email = `bdd-${randomUUID()}@t.test`;
  const student = await makeUser('STUDENT', 'BDD Student', this.email);
  this.studentId = student.id;
  this.client = await new Client(app).init();
});

When('the student logs in with valid credentials', async function (this: LoginWorld) {
  assert.ok(this.client);
  assert.ok(this.email);
  const response = await this.client.login(this.email, PW);
  this.loginStatus = response.status;
});

When('the student logs in with an incorrect password', async function (this: LoginWorld) {
  assert.ok(this.client);
  assert.ok(this.email);
  const response = await this.client.login(this.email, 'IncorrectPassword123!');
  this.loginStatus = response.status;
});

Then('the login should be successful', function (this: LoginWorld) {
  assert.equal(this.loginStatus, 200);
});

Then('the student should be authenticated', async function (this: LoginWorld) {
  assert.ok(this.client);
  const response = await this.client.get('/api/v1/auth/me');
  assert.equal(response.status, 200);
  assert.equal(response.body.user.email, this.email);
});

Then('the login should be rejected', function (this: LoginWorld) {
  assert.equal(this.loginStatus, 401);
});

Then('the student should remain unauthenticated', async function (this: LoginWorld) {
  assert.ok(this.client);
  const response = await this.client.get('/api/v1/auth/me');
  assert.equal(response.status, 401);
});

// Remove only this scenario's student and sessions (no full-table truncate).
After(async function (this: LoginWorld) {
  if (this.studentId) {
    await sessionPool.query("DELETE FROM user_sessions WHERE sess->>'userId' = $1", [this.studentId]);
    await prisma.user.delete({ where: { id: this.studentId } });
  }
});

AfterAll(async function () {
  await prisma.$disconnect();
  await sessionPool.end();
});
