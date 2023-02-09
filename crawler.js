const fs = require("fs");
const puppeteer = require("puppeteer");
const main = (imgUrl, initialHref, depth) => {
    const images = getImages(imgUrl, initialHref, depth).flat(depth);
    console.log(images);
    saveToFile(images);
}

const getImages = (href, depth, images = [], visitedPages = {}) => {
    if (depth === 0) {
        return images;
    }
    const page = puppeteer.open(href)
    const links = page.$eval('a').map(link => link.href) ?? []
    console.log(links);
    const newImages = page.$eval('img').map(img => img.src) ?? []
    console.log(newImages);
    return links.map(link => {
        if (visitedPages[link]) {
            return [];
        }
        getImages(link, depth - 1, [...images, ...newImages], { ...visitedPages, [link]: true })
    })
}

// [[[['fooo', 'bar']]['fooo']]] => ['foo', 'bar', 'fooo']


const saveToFile = (data) => {
    const isExist = fs.existsSync("./result.json");
    if (!isExist) {
        return fs.appendFile("./results.json", JSON.stringify(data), (error) => {
            if (error) return console.log(error);
        })
    } else {
        fs.writeFile("./results.json", JSON.stringify(data), (error) => {
            if (error) return console.log(error);
        })
    }
}