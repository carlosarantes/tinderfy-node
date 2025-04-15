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
    max: 11
};
var rangeDislikes = {
    min: 1,
    max: 3
};


(async () => {
    const browser = await puppeteer.launch({
        headless: headlessMode,
        userDataDir: './data',
    });
    const page = await browser.newPage();
    await page.goto(tinderPath);
    await page.setViewport();

    await new Promise(resolve => setTimeout(() => {
        resolve()
    }, 12000))


    const changeLocation = (city = '') => {
        let newCity = city
        if(!city) {
            newCity = cities[random(0, (cities.length-1))]
        }

        console.log('newCity ** ', newCity)
    }

    try {
        const likeButton = await page.waitForSelector(xpaths.like, {
            timeout: 10000
        })

        const dislikeButton = await page.waitForSelector(xpaths.dislike, {
            timeout: 10000
        })
    
        let likesCount = 0;
        while (likesCount < maxOfLikes || (maxOfLikes < 0)) {            
            const rangeOfLikes = random(rangeLikes.min, rangeLikes.max, false)
            console.log("This round we will perform some likes: "+rangeOfLikes)
            for (var i = 0; i < rangeOfLikes; i++) {
                likeButton.click({
                    delay: random(290, 410)
                })
                likesCount++;
                await new Promise(resolve => setTimeout(() => {
                    resolve()
                }, random(1000, 1583, false)))
                console.log(" Likes in this round: "+ (i+1))
            }

            const rangeOfDislikes = random(rangeDislikes.min, rangeDislikes.max, false)
            console.log("This round we will perform some dislikes: "+rangeOfDislikes)
            for (var x = 0;x < rangeOfDislikes; x++) {
                dislikeButton.click({
                    delay: random(310, 450)
                })
                await new Promise(resolve => setTimeout(() => {
                    resolve()
                }, random(1000, 1250, false)))
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