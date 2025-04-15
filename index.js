var puppeteer = require('puppeteer');
var { random } = require('lodash')

var tinderPath = "https://tinder.com/";
var maxOfLikes = 1000;
var headlessMode = false;
var cities = [ "Lisbon", "Madrid", "Porto", "Paris", "Almada", "Seixal", "Toulouse", "Barreiro", "Bordeaux", "Barcelona", "Rome", "Uberlandia", "Uberaba", "Araguari", "Oeiras" ];
const xpaths = {
    like: "#main-content > div.H\\(100\\%\\) > div > div > div > div.Pos\\(r\\).Expand.H\\(--recs-card-height\\)--ml.Maw\\(--recs-card-width\\)--ml.Mt\\(a\\) > div > div > div.Pos\\(a\\).B\\(0\\).Iso\\(i\\).W\\(100\\%\\).Start\\(0\\).End\\(0\\).TranslateY\\(55\\%\\) > div > div:nth-child(4) > button",
    dislike: "#main-content > div.H\\(100\\%\\) > div > div > div > div.Pos\\(r\\).Expand.H\\(--recs-card-height\\)--ml.Maw\\(--recs-card-width\\)--ml.Mt\\(a\\) > div > div > div.Pos\\(a\\).B\\(0\\).Iso\\(i\\).W\\(100\\%\\).Start\\(0\\).End\\(0\\).TranslateY\\(55\\%\\) > div > div:nth-child(2) > button",
    superlike: "",
    profile_button: ""
};
var rangeLikes = {
    min: 4,
    max: 19
};
var rangeDislikes = {
    min: 1,
    max: 3
};
var likesCount = 0;

async function sleep(secs){
    return await new Promise(resolve => setTimeout(() => {
        resolve()
    }, secs*1000))
}

(async () => {
    const browser = await puppeteer.launch({
        headless: headlessMode,
        userDataDir: './data',
    });
    const page = await browser.newPage();
    await page.goto(tinderPath);
    await page.setViewport();

    await sleep(10) // 12 Seconds

    const likeButton = await page.waitForSelector(xpaths.like, {
        timeout: 10000
    })

    const dislikeButton = await page.waitForSelector(xpaths.dislike, {
        timeout: 10000
    })



    const changeLocation = (city = '') => {
        let newCity = city
        if(!city) {
            newCity = cities[random(0, (cities.length-1))]
        }

        console.log('newCity ** ', newCity)
    }

    try {
        while (likesCount < maxOfLikes || (maxOfLikes < 0 || maxOfLikes == null)) {            
            const rangeOfLikes = random(rangeLikes.min, rangeLikes.max, false)
            console.log("This round we will perform some likes: "+rangeOfLikes)
            for (var i = 0; i < rangeOfLikes; i++) {
                likeButton.click({
                    delay: random(290, 395)
                })
                likesCount++;
                await sleep(random(1000, 1483, false)/1000)
                console.log(" Likes in this round: "+ (i+1))
            }

            const rangeOfDislikes = random(rangeDislikes.min, rangeDislikes.max, false)
            console.log("This round we will perform some dislikes: "+rangeOfDislikes)
            for (var x = 0;x < rangeOfDislikes; x++) {
                dislikeButton.click({
                    delay: random(310, 420)
                })
                await sleep(random(1000, 1250, false)/1000)
                console.log(" Dislikes in this round: "+ (x+1))
            }

            console.log("---- TOTAL LIKES: "+likesCount)
       }
    } catch (e) {
        console.log("******* SOMETHING HAPPENED *******")
    }

    console.log("Let's close it for now. Goodbye")
    await browser.close();
})()