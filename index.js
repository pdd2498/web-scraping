const axios = require("axios");
const fs = require("node:fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const header = {
    "content-type": "text/html",
};
const pagurl = "https://www.timesjobs.com/candidate/job-search.html?searchType=Industry&from=submit&clubJob=n&cboIndustry=28&gadLink=IT-Software";

const grtData = async (url)=> {
    console.log("start wating for data");
    try{
        const data = await axios.get(url, {
            header,
        });
        fs.writeFileSync("naukriData.txt", data.data );
        console.log("aaya");
    }
    catch (err){
        console.log("ni aaya");
    }
}
// grtData(pagurl);

const getDataFromFile = () =>{
    return fs.readFileSync("naukriData.txt", {encoding:"utf-8"});
}
const paghtmlData = getDataFromFile();


const $ = cheerio.load(paghtmlData);
const products = [];

const name = $(".clearfix.job-bx.wht-shd-bx").each((index, element) => {
    products.push({
        // name: $(element).text()
        JobTitle: $(element).find("a").text().split("\n")[1],
        CompanyName: $(element).find(".joblist-comp-name").text().split("\n")[1],
      Location: $(element).find("span").text().split("\n")[0],
      PostedDate : $(element).find(".sim-posted").find("span").text(),
      JobDescription: $(element).find(".list-job-dtl.clearfix").find("li").text().split("\n")[2],
    
    });
});
console.log(products);

const workbook = xlsx.utils.book_new();
const sheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook , sheet , "product");
xlsx.writeFile(workbook , "noukei.xlsx");
