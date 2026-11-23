import { test, expect } from "@playwright/test";

test.describe("Member 3 - Authentication Automation", () => {
  test("AT-01: Student login with valid credentials", async ({ page }) => {
    // Open the Lecture Feedback System login page
    await page.goto("/login");

    // Enter valid student credentials
    await page.getByLabel("Email").fill("student1@lectures.test");
    await page.getByLabel("Password", { exact: true }).fill("DevPassword!2026");

    // Submit login form
    await page.getByRole("button", { name: "Sign in" }).click();

    // Verify successful authentication
    await expect(page).not.toHaveURL(/\/login/);

    // Save evidence
    await page.screenshot({
      path: "member3-evidence/AT-01-successful-login.png",
      fullPage: true,
    });
  });

  test("AT-02: Student login with incorrect password", async ({ page }) => {
    // Open login page
    await page.goto("/login");

    // Enter invalid login credentials
    await page.getByLabel("Email").fill("student1@lectures.test");
    await page
      .getByLabel("Password", { exact: true })
      .fill("WrongPassword123!");

    // Attempt login
    await page.getByRole("button", { name: "Sign in" }).click();

    // Verify student remains on login page
    await expect(page).toHaveURL(/\/login/);

    // Verify sign-in form remains available
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

    // Save evidence
    await page.screenshot({
      path: "member3-evidence/AT-02-rejected-login.png",
      fullPage: true,
    });
  });

  test("AT-03: Student registration with valid details", async ({ page }) => {
    // Generate a unique email for each test execution
    const email = `member3.${Date.now()}@lectures.test`;
    const password = "SecureStudent123!";

    // Open student registration page
    await page.goto("/register");

    // Enter new student details
    await page.getByLabel("Full name").fill("Member 3 Test Student");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);

    // Submit the registration form
    await page
      .getByRole("button", {
        name: /register|create account|sign up/i,
      })
      .click();

    // Verify the student is redirected after registration
    await expect(page).not.toHaveURL(/\/register/);

    // Verify the student has an authenticated session
    const response = await page.request.get("/api/v1/auth/me");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.user.email).toBe(email);
    expect(data.user.role).toBe("STUDENT");

    // Capture automation evidence
    await page.screenshot({
      path: "../../Member3-Evidence/AT-03-successful-registration.png",
      fullPage: true,
    });
  });
});
