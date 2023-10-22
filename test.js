function getKey() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoqrstuvwxyz0123456789';

    for (let i = 0; i < 2; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

function rawHtmlResponse(html) {
return new Response(html, {
    headers: {
    'content-type': 'text/html;charset=UTF-8',
    },
});
}

const express = require('express');
const router = express.Router();
const redis = require('redis');
const axios = require('axios');
const bodyParser = require('body-parser')

//service port 
const app = express();
const app2 = express();
const port = 3000
const port_redis = 6379;
const redis_client = redis.createClient(port_redis);
const eqauls = 1
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app2.use(bodyParser.urlencoded({extended: false}));
app2.use(bodyParser.json());


app.post('/p',async (req, res) => {
    var key1 = getKey()
    var key2 = getKey()
    var key3 = getKey()
    var key4 = getKey()
    var keys = [key1,key2,key3,key4];
    const arraycompare = new Set(keys);

    var isDuplicate = arraycompare.size < keys.length;
    console.log(arraycompare.size)
    console.log(keys.length)
    console.log(isDuplicate)

    while (isDuplicate) {
        key1 = getKey();
        key2 = getKey();
        key3 = getKey();
	    key4 = getKey();
	    keys = [key1,key2,key3,key4]
        var arraycompare2 = new Set(keys)
        var isDuplicate = arraycompare2.size < keys.length;
        console.log(keys);
	if(!isDuplicate){
	break;
	}
    }
    console.log(req.body.image)
    var test1='/e/'+key1+key2+key3+key4
    await redis_client.setEx(key1, 1440, req.body.image)
    await redis_client.setEx(key2, 1440, req.body.title)
    await redis_client.setEx(key3, 1440, req.body.descript)
    await redis_client.setEx(key4, 1440, req.body.stock_url)
    await redis_client.setEx("key", 1, test1)
    console.log(test1)
    res.send(keys);
    console.log(await redis_client.get("key"))
})
redis_client.connect()
app2.get('/*' ,async (req, res) => {
    var  test3 = req.url.split("/")
    console.log(test3[1])
    const pathname = req.url.split("/")[1]
    if(req.url.split("/")[1]=='null'){
        return res.redirect("https://keiminem.com")
    }
    if(req.url.split("/")[1]=='p'){
        console.log("gd")
    }
    else{
    console.log(pathname);
    console.log(req.url);
    const query1 = pathname.substr(0,2);
    const query2 = pathname.substr(2,2);
    const query3 = pathname.substr(4,2);
    const query4 = pathname.substr(6.2);
   // await redis_client.connect();
    console.log(req.body)
    console.log(req.params)

    const simage = await redis_client.get(query1)
    const title =  await redis_client.get(query2)
    const descript = await redis_client.get(query3)
    const url = await redis_client.get(query4)
    const html = `<html>
    
    <head>
    <meta property="og:image" content="${simage}">
    <meta property="og:image:width" content="450">
    <meta property="og:description" content="${descript}">
    <meta http-equiv="refresh" content="0;URL='${url}'" />
    <link rel="icon" href="data:;base64,=">
    <title>${title}</title>
    
    </head>
    <body>
    <img src="${simage}" style="width:450; height: auto;" alt="img"/></body>
    </html>`;
    
    // res2.send(html)
    res.send(html)
    // return rawHtmlResponse(html);
    // res.send(html)
    
    }
    
})

app2.listen(80, (req)=>{ console.log(req)} )
app.listen(port, (req) => {
    console.log(req)
    console.log('ㅎㅇㅎㅇ')
})
