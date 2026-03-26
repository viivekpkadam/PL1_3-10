import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import maternity from "../Data/maternity.json";

export default class MaternityPage {

  readonly page: Page;
  public maternityLink: Locator;
  public maternity: {
    reportLink: Locator;
    maternityAllowanceReport: Locator;
    dateFrom: Locator;
    showReportBtn: Locator;
    dataType: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.maternityLink = page.locator('a[href="#/Maternity"]');
    this.maternity = {
      reportLink: this.page.locator('(//a[@href="#/Maternity/Reports"])[2]'),
      maternityAllowanceReport: this.page.locator(
        '(//a[@href="#/Maternity/Reports/MaternityAllowance"])'
      ),
      dateFrom: this.page.locator('(//input[@id="date"])[1]'),
      showReportBtn: this.page.locator(
        'button.btn.green.btn-success[type="button"]'
      ),
      dataType: this.page.locator(
        "//div[@role='gridcell' and @col-id='TransactionType'][1]"
      ),
    }
  }

  /**
   * @Test8
   * @description This method verifies the functionality of the Maternity Allowance Report.
   * It navigates to the Maternity module, accesses the report section, and opens the Maternity Allowance Report.
   * Initially, it ensures that the data grid is not visible, selects a date range by entering the 'from date,'
   * and clicks the 'Show Report' button. Finally, it waits for the report to load and asserts that the data grid becomes visible.
   * Throws an error if the data grid visibility states do not match the expected outcomes.
   */
  public async verifyMaternityAllowanceReport() {
    // write your logic here
    const fromDate = maternity.DateRange.FromDate;

    await CommonMethods.highlightElement(this.maternityLink);
    await this.maternityLink.click();
    await CommonMethods.highlightElement(this.maternity.reportLink);
    await this.maternity.reportLink.click();
    await CommonMethods.highlightElement(
      this.maternity.maternityAllowanceReport
    );
    await this.maternity.maternityAllowanceReport.click();
    await this.maternity.dateFrom.type(fromDate);
    await CommonMethods.highlightElement(this.maternity.showReportBtn);
    await this.maternity.showReportBtn.click();
    await this.page.waitForTimeout(2500);
    const isVisible = await this.maternity.dataType.isVisible();
    expect(isVisible).toBe(true);
  }
}
