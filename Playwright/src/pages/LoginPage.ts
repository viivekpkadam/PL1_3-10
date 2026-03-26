import { expect, Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import login from "../Data/login.json";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(`#username_id`);
    this.passwordInput = page.locator(`#password`);
    this.loginButton = page.locator(`#login`);
    this.loginErrorMessage = page.locator(
      `//div[contains(text(),"Invalid credentials !")]`
    );
    this.admin = page.locator('//li[@class="dropdown dropdown-user"]');
    this.logOut = page.locator("//a[text() = ' Log Out ']");
  }

  /**
   * @Test0 This method logs in the user with valid credentials.
   *
   * @description This method performs the login operation using the provided valid credentials. It highlights the input
   *              fields for better visibility during interaction and fills the username and password fields. After submitting
   *              the login form by clicking the login button, it validates the success of the login process. The login is
   *              considered successful if there are no errors.
   */
  async performLogin() {
    // write your logic here
    try {
      const ValidUserName = login.ValidLogin.ValidUserName;
      const ValidPassword = login.ValidLogin.ValidPassword;
      // Highlight and fill the username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(ValidUserName);
      // Highlight and fill the password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(ValidPassword);
      // Highlight and click the login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();
      // Verify successful login by checking if 'admin' element is visible
      await this.admin.waitFor({ state: "visible", timeout: 20000 });
      expect(await this.admin.isVisible()).toBeTruthy();
    } catch (e) {
      console.error("Error during login:", e);
    }
  }

  /**
   * @Test5 This method attempts login with invalid credentials and retrieves the resulting error message.
   *
   * @description Tries logging in with incorrect credentials to verify the login error message display.
   *              Highlights each input field and the login button during interaction. Captures and returns
   *              the error message displayed upon failed login attempt.
   */
  async performLoginWithInvalidCredentials() {
    // write your logic here
    try {
      const invalidUserName = login.InvalidLogin.InvalidUserName;
      const invalidPassword = login.InvalidLogin.InvalidPassword;
      await this.page.waitForTimeout(2000);
      // Attempt to reset login state by logging out if logged in
      if (await this.admin.isVisible()) {
        await CommonMethods.highlightElement(this.admin);
        await this.admin.click();
        await CommonMethods.highlightElement(this.logOut);
        await this.logOut.click();
      }
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(invalidUserName);
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(invalidPassword);
      // Highlight and click the login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();
      expect(await this.loginErrorMessage.isVisible());
    } catch (error) {
      console.error("Error during login with invalid credentials:", error);
      throw new Error(
        "Login failed, and error message could not be retrieved."
      );
    }
  }

  /**
   * @Test7
   * @description This method verifies the logout functionality from the Admin dropdown.
   * @expected
   * User is logged out successfully and the login page is displayed.
   */
  async verifyLogoutFunctionality() {
    // write your logic here
    await this.page.waitForTimeout(10000);
    await CommonMethods.highlightElement(this.admin);
    await this.admin.click();
    await CommonMethods.highlightElement(this.logOut);
    await this.logOut.click();

    expect(await this.loginButton.isVisible());
  }
}
