import { emailData } from "../index.js"

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

export { email_clicked, email_opened };