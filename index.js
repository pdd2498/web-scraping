const axios = require("axios");
const fs = require("node:fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const header = {
    "content-type": "text/html",
};
const pagurl = "https://www.amazon.in/s?k=phone&i=fashion&crid=18MXMQLJ0X62X&sprefix=phone%2Cfashion%2C224&ref=nb_sb_noss_1";

const grtData = async (url)=> {
    console.log("start wating for data");
    try{
        const data = await axios.get(url, {
            header,
        });
        fs.writeFileSync("amazonwedData.txt", data.data );
        console.log("aaya");
    }
    catch (err){
        console.log("ni aaya");
    }
}
// grtData(pagurl);

const getDataFromFile = () =>{
    return fs.readFileSync("amazonwedData.txt", {encoding:"utf-8"});
}
const paghtmlData = getDataFromFile();

const $ = cheerio.load(paghtmlData);
const products = [];

const name = $(".a-section.a-spacing-small.puis-padding-left-micro.puis-padding-right-micro").each((index, element) => {
    products.push({
      name: $(element).find(".a-size-base-plus.a-color-base.a-text-normal").text(),
      price: $(element).find(".a-price-whole").text(),
      Availability: $(element).find(".a-size-base.a-color-price").text(),
      ProductRating : $(element).find(".a-icon-alt").text(),
    
    });
});

const workbook = xlsx.utils.book_new();
const sheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook , sheet , "product");
xlsx.writeFile(workbook , "products.xlsx");
