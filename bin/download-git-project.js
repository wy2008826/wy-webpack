#!  /usr/bin/env node

const axios = require('axios');


axios.get('https://api.github.com/search/repositories?q=tetris').then((data)=>{
    console.log('data:',data);
})
