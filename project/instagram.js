let fs = require("fs");

let puppeteer = require('puppeteer');

let instapage = process.argv[2];

let pageToLike = process.argv[3];

let numPosts = parseInt(process.argv[4]);

(async function () {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 70,
        args: ['--start-maximized', '--disable-notifications', '--incognito']
    });

    let contents = await fs.promises.readFile(instapage, 'utf-8');

    let obj = JSON.parse(contents);
    let user = obj.user;
    let pwd = obj.pwd;

    let pages = await browser.pages();
    let tab = pages[0];
    tab.goto('https://www.instagram.com/', {
        waitUntil: 'networkidle2'
    });

    await tab.waitForSelector("[name='username']", {
        visible: true
    });

    await tab.type("[name='username']", user);
    
    await tab.type("[name='password']", pwd);
    
    await tab.click("button[type='submit']");
    
    await tab.waitForSelector('input.XTCLo.x3qfX', {
        visible: true
    });

    await tab.type('[placeholder="Search"]', pageToLike,{
        delay:150
    });
    
    await tab.keyboard.press('ArrowDown');
    
    await tab.keyboard.press('Enter');
    
    await tab.waitForSelector('div.fuqBx a', {
        visible: true
    });

    await tab.evaluate(() => {
        document.querySelector('div.fuqBx a').click()
    });

    let idx = 0;
    
    do {
    
        await tab.waitForSelector('article > div:nth-child(1) img[decoding="auto"]');
    
        let elements = await tab.$$('article > div:nth-child(1) img[decoding="auto"]');
    
        let posts = elements[idx];
    
        await posts.click({
    
            delay:100
    
        });

        let like= await tab.waitForSelector('span.fr66n > button.wpO6b',{
        visible:true});
    
        if(like){
    
            await like.click({delay:100});
        }
    
        let closebtn=await tab.waitForSelector('.Igw0E button.wpO6b',{
            visible:true
        });
        console.log(idx+1 +"st"+  "post" +"like")
    
        await closebtn.click();
        idx++;
        
    } while (idx < numPosts);
    
      await browser.close();

    })();