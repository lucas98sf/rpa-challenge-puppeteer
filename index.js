import puppeteer from "puppeteer";
import XLSX from 'xlsx';
(async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto("http://www.rpachallenge.com");

		let planilha = XLSX.readFile('challenge.xlsx');
		let colunas = XLSX.utils.sheet_to_json(planilha.Sheets[planilha.SheetNames[0]]);

		colunas.forEach(coluna => {
			const value = coluna['Last Name ']
			delete coluna['Last Name ']
			coluna['Last Name'] = value;
		});

		await page.click(".btn-large")

		for (let coluna in colunas) {
			for (let i = 1; i < 8; i++) {
				let selector = `.inputFields > form > div > div:nth-child(${i})`
				let name = await page.$eval(selector, el => el.innerText)
				await page.type(selector + '> rpa1-field > div > input', String(colunas[coluna][name]))
			}
			await page.keyboard.press("Enter")
		}

		await page.screenshot({ path: 'result.png' });
		await browser.close();
	} catch (err) {
		console.log(err)
	}
})();
