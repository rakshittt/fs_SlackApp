     const { WebClient } = require('@slack/web-api');
     const token = process.env.SLACK_BOT_TOKEN; // Ensure this is set correctly
     const web = new WebClient(token);

     (async () => {
       try {
         const res = await web.auth.test();
         console.log('Authentication successful:', res);
       } catch (error) {
         console.error('Error authenticating:', error);
       }
     })();