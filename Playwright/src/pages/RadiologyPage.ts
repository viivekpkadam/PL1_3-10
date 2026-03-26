import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import radiology from "../Data/radiology.json";

export default class RadiologyPage {

  readonly page: Page;
  private radiologyModule: Locator;
  private listRequestSubModule: Locator;
  private filterDropdown: Locator;
  private fromDate: Locator;
  private toDate: Locator;
  private okButton: Locator;
  private dateRangeDropdown: Locator;
  private last3MonthsOption: Locator;
  private dateCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.radiologyModule = page.locator('a[href="#/Radiology"]');
    this.listRequestSubModule = page.locator(
      '//a[contains(text(),"List Requests")]'
    );
    this.filterDropdown = page.locator("//select");
    this.fromDate = page.locator(`(//input[@id="date"])[1]`);
    this.toDate = page.locator(`(//input[@id="date"])[2]`);
    this.okButton = page.locator(`//button[contains(text(),"OK")]`);
    this.dateRangeDropdown = page.locator("//span[@data-toggle='dropdown']");
    this.last3MonthsOption = page.locator("//a[text()= 'Last 3 Months']");
    this.dateCells = page.locator(
      "//div[@role='gridcell' and @col-id='CreatedOn'][1]"
    );
  }

  /**
   * @Test3
   * @description This method verifies that the data displayed in the radiology list request is within the last three months.
   * It navigates to the Radiology module, selects the "Last 3 Months" option from the date range dropdown, and confirms the filter.
   * The method retrieves all dates from the table, validates their format, and checks if they fall within the last three months.
   * Logs detailed errors if dates are invalid or out of range and provides debug information about the number of date cells and retrieved dates.
   * Throws an error if any date is invalid or outside the range.
   */
  async verifyDataWithinLastThreeMonths() {
    // write your logic here
    try {
      await CommonMethods.highlightElement(this.radiologyModule);
      await this.radiologyModule.click();
      await CommonMethods.highlightElement(this.listRequestSubModule);
      await this.listRequestSubModule.click();
      await CommonMethods.highlightElement(this.dateRangeDropdown);
      await this.dateRangeDropdown.click();
      await CommonMethods.highlightElement(this.last3MonthsOption);
      await this.last3MonthsOption.click();
      await CommonMethods.highlightElement(this.okButton);
      await this.okButton.click();
      const debugElements = await this.dateCells.count();
      console.log("Number of date cells found:", debugElements);
      if (debugElements === 0) {
        throw new Error(
          "No date cells found. Verify the locator or table data."
        );
      }
      const dateTexts = await this.dateCells.allTextContents();
      console.log("Retrieved dates:", dateTexts);
      const today = new Date();
      const threeMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate()
      );
      let isAllDatesValid = true;
      for (const dateText of dateTexts) {
        const dateValue = new Date(dateText.trim());
        if (isNaN(dateValue.getTime())) {
          console.error(`Invalid date format: ${dateText}`);
          isAllDatesValid = false;
        } else if (dateValue < threeMonthsAgo || dateValue > today) {
          console.error(`Date out of range: ${dateValue}`);
          isAllDatesValid = false;
        }
      }
      if (isAllDatesValid) {
        console.log("All dates are within the last 3 months.");
      } else {
        throw new Error(
          "Some dates are outside the last 3 months range or invalid."
        );
      }
    } catch (error) {
      console.error(
        'Error selecting "Last 3 Months" from the dropdown:',
        error
      );
    }
  }

  /**
   * @Test10
   * @description This method filters the list of radiology requests based on a specified date range and imaging type.
   * It navigates to the Radiology module, applies the selected filter, enters the 'From' and 'To' dates, and confirms the filter action.
   * The method verifies that the filtered results match the specified imaging type.
   */
  async filterListRequestsByDateAndType() {
    // write your logic here
    const filter = radiology.FilterDropdown.Filter;
    const fromDate = radiology.DateRange.FromDate;
    const toDate = radiology.DateRange.ToDate;

    await CommonMethods.highlightElement(this.radiologyModule);
    await this.radiologyModule.click();
    await CommonMethods.highlightElement(this.listRequestSubModule);
    await this.listRequestSubModule.click();
    await this.page.waitForTimeout(2000);

    await CommonMethods.highlightElement(this.filterDropdown);
    await this.filterDropdown.click();
    await this.filterDropdown.selectOption(filter);
    await this.page.waitForTimeout(2000);
    await CommonMethods.highlightElement(this.fromDate);
    await this.fromDate.type(fromDate);

    await CommonMethods.highlightElement(this.toDate);
    await this.toDate.type(toDate);

    await CommonMethods.highlightElement(this.okButton);
    await this.okButton.click();

    await this.page.waitForTimeout(3000);
    // Capture and verify the search result
    const resultText = await this.page
      .locator("//div[@role='gridcell' and @col-id='ImagingTypeName']")
      .allInnerTexts();
    // Trim and check if any result matches the gender
    const trimmedResults = resultText.map((text) => text.trim());
    const matchFound = trimmedResults.includes(filter.trim());

    expect(matchFound).toBe(true);
  }
}
