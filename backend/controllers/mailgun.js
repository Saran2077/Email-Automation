import { emailData } from "../index.js"
import { Email } from "../utils/models/Email.js";
import { Recipient } from "../utils/models/Recipient.js";

const email_opened = async  (req, res) => {
    console.log("Email opened")
    const body = req.body;
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };
    console.log(body['event-data']['message']['headers']['message-id']);

    let id = '';

    for (const email of emailData) {
        if (email['id'] === body['event-data']['message']['headers']['message-id']) {
            id = email['contact_id'];
        }
    }

    const update = await fetch(`${process.env.ACTIVE_CAMPAIGN_URL}/contactTags`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            contactTag: {
                contact: id,
                tag: '7'
            }
        })
    });

    console.log(update.status);
    res.sendStatus(update.status);
};

const email_clicked = async (req, res) => {
    const body = req.body;
    console.log("CLICKED")
    console.log(body['event-data']['message']['headers']['message-id']);
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };

    let id = '';

    for (const email of emailData) {
        if (email['id'] === body['event-data']['message']['headers']['message-id']) {
            id = email['contact_id'];
        }
    }

    const update = await fetch(`${process.env.ACTIVE_CAMPAIGN_URL}/contactTags`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            contactTag: {
                contact: id,
                tag: '6'
            }
        })
    });

    console.log(update.status);
    res.sendStatus(update.status);
};

async function email_replied(req, res) {
    console.log(req.body, 1)
    const mailgunData = req.body;
    try {
      const emailData = {
        subject: mailgunData.Subject || 'No Subject',
        body: mailgunData['stripped-text'] || mailgunData['stripped-html'] || '',
        from: mailgunData.sender,
        status: 'unopened',
        isReceived: true,
        isSent: false,
        isDraft: false
      };

      console.log(2, emailData)
  
      let fromRecipient = await Recipient.findOne({ email: emailData.from });
      if (!fromRecipient) {
        fromRecipient = await Recipient.create({
          email: emailData.from,
        });
      }

      console.log(3, fromRecipient)
  
      let toRecipient = await Recipient.findOne({ 
        email: mailgunData.recipient 
      });
      if (!toRecipient) {
        toRecipient = await Recipient.create({
          email: mailgunData.recipient,
        });
      }

      console.log(4, toRecipient)
  
      // Create the email document
      const email = new Email({
        ...emailData,
        from: fromRecipient.email, // Using email string as specified in your schema
        to: toRecipient._id, // Using ObjectId as specified in your schema
        timestamp: new Date(parseInt(mailgunData.timestamp) * 1000) // Convert Unix timestamp to Date
      });

      console.log(5, email)
  
      // Save the email
      const savedEmail = await email.save();
  
      return res.status(200).json({
        success: true,
        message: 'Email saved successfully',
        data: savedEmail
      });
  
    } catch (error) {
      console.error('Error processing email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing email',
        error: error.message
      });
    }
}

export { email_clicked, email_opened, email_replied };