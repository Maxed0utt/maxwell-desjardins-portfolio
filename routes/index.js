const nodemailer = require('nodemailer')
const joi = require('joi')
require('dotenv').config()

module.exports = app => {
  // Home page route
  app.get('/', (req, res) => {
    console.log(`request made to: / at ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`)
    res.render('index', {title: 'Maxwell Desjardins'})
  })

  // About page route
  app.get('/about', (req, res) => {
    console.log(`request made to: /about at ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`)
    res.render('about', {title: 'About'})
  })

  // Hire Me page route
  app.get('/hire-me', (req, res) => {
    console.log(`request made to: /hire-me at ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`)
    res.render('hireMe', {title: 'Hire Me'})
  })

  app.post('/send-email', async (req, res) => {
    console.log(`request made to: /send-email at ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`)
    const body = req.body
    res.status(200)
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      phone: joi.string().pattern(/^[0-9+\-().\s]*$/).optional(),
      position: joi.string().required(),
      budget: joi.string().optional(),
      positionDescription: joi.string().optional()
    })
    const {error, value} = schema.validate(body)
    if (error) {
      res.send('Data is invalid:', error.details);
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'stmp.gmail.com',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      })
      try {
        // send mail with defined transport object
        await transporter.sendMail({
          from: `MaxwellDesjardins.com <${process.env.GMAIL_USER}>`,
          to: value.email,
          subject: 'Thank You For Your Interest - MaxwellDesjardins.com',
          text: `
            Thanks for reaching out regarding potential collaboration on your software development project. I appreciate your interest in me and am excited about the possibility of working together.\n
            I will review your message and get back to you within 24-48 hours to discuss the next steps.\n
            Looking forward to connecting with you soon!\n
            Maxwell Desjardins
            Software Developer
            705-918-1773
            maxwelldesjardins.com
          `
        })
        await transporter.sendMail({
          from: `MaxwellDesjardins.com <${process.env.GMAIL_USER}>`,
          to: 'max.desjardins@hotmail.ca',
          subject: 'Someone is Looking to Hire You! - MaxwellDesjardins.com',
          text: `
            FROM: ${value.name}\n
            Email: ${value.email}\n
            Phone: ${value.phone}\n
            Position: ${value.position}\n
            Budget: ${value.budget ? value.budget : ''}\n
            Position Description: ${value.positionDescription ? value.positionDescription : ''}
          `
        })
        return res.status(200).send('Success')
      } catch (e) {
        console.log('email failed!!')
        return res.status(500).send(e)
      }
    }
  })

  // Fallback route for undefined routes
  app.use((req, res) => {
    console.log(`404 - requested route: ${req.originalUrl} at ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}`)
    res.status(404).render('404', {title: 'Page Not Found'})
  })
}
