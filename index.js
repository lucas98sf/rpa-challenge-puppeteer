import puppeteer from "puppeteer";
import XLSX from 'xlsx';
(async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto("http://www.rpachallenge.com");

		let data = XLSX.readFile('challenge.xlsx');
		let columns = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);

		columns.forEach(column => {
			const value = column['Last Name ']
			delete column['Last Name ']
			column['Last Name'] = value;
		});

		await page.click(".btn-large")

		for (let column in columns) {
			for (let i = 1; i < 8; i++) {
				let selector = `.inputFields > form > div > div:nth-child(${i})`
				let name = await page.$eval(selector, el => el.innerText)
				await page.type(selector + '> rpa1-field > div > input', String(columns[column][name]))
			}
			await page.keyboard.press("Enter")
		}

		await page.screenshot({ path: 'result.png' });
		await browser.close();
	} catch (err) {
		console.log(err)
	}
})();
