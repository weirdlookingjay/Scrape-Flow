import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const webSiteUrl = environment.getInput("Website Url");
    console.log("@@WEBSITE URL", webSiteUrl);
    const browser = await puppeteer.launch({
      headless: false, // for testing
    });
    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
