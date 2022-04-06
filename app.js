require('dotenv').config();
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground")

OAuth2_client.setCredentials( {refresh_token: process.env.REFRESH_TOKEN
});



const send_email = async (recepient, subject, mesgMethod = 'text', msg) => {
    let accessToken =  await OAuth2_client.getAccessToken();
    console.log(accessToken, ' is access')
    // accessToken = accessToken.res.data.access_token;
    const transport = nodemailer.createTransport({
        service: 'gmail',
        // tls: {
        //   rejectUnauthorized: false
        // },
        auth: {
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        }
    }) 

    let mail_option;

    if(mesgMethod === 'text') {
       mail_option = {
          from: `Emmijozzy ${process.env.USER}`,
          to: recepient,
          subject: subject,
          text: msg,
        }
    } else {
        mail_option = {
          from: `Emmijozzy ${process.env.USER}`,
          to: recepient,
          subject: subject,
          html: msg,
        }
    }


    transport.sendMail(mail_option, (err, result) => {
        if(err) {
            console.log("Error1 : ", err )
        } else {
            console.log("success: ", result)
            res.send('Message sent')
        }
        transport.close()
    })
    
}
const msg = '<h1> Pls, reset your password through this following link <h1>'

// send_email("logunsuyi@gmail.com", 'Reset of password', 'html', msg)


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  //Testing transporter 
  
  //   let transporter = nodemailer.createTransport({
  //     host: 'smtp.mailtrap.io',
  //     port: 2525,
  //     auth: {
  //        user: '7e632bb334d259',
  //        pass: 'eaad952e242342'
  //     }
  // });
  
  //Transporter 1 

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.USER,
  //     accessToken,
  //     clientId: process.env.CLIENT_ID,
  //     clientSecret: process.env.CLIENT_SECRET,
  //     refreshToken: process.env.REFRESH_TOKEN
  //   }
  // });

  // Transporter 2
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user:  process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKE,
       accessToken,
    },
  });




  return transporter;
};

//emailOptions - who sends what to whom
const sendEmail = async (emailOptions) => {
   await createTransporter()
    .then(async (transporter) => {
      try {
        await transporter.sendMail(emailOptions)
        console.log('Email sent sucessfully')
      } catch(err) {
        if(err) return console.log(err, "\n Error while sending email")
      }
    })
};

sendEmail({
  subject: "Reset password link",
  html: msg,
  to:  "logunsuyi@gmail.com",
  from: `Emmijozzy ${process.env.USER}`,
});
