export const sendMail = async (jsonEmail) => {
    const emailData = JSON.parse(jsonEmail.generated_email);

    const subject = emailData.subject || emailData.Subject || '';
    const body = emailData.body || emailData.Body || '';

    // Create a FormData instance
    const form = new FormData();
    form.append('from', "Saran <betagamer580@gmail.com>");
    form.append('to', "saranmuthuraj2004@gmail.com");
    form.append('subject', subject);
    form.append('html', body);
    form.append('o:tracking', 'yes')
    form.append('o:tracking-opens', 'yes')
    form.append('o:tracking-clicks', 'yes')

    const domainName = process.env.MAILGUN_URL // Update with your domain name
    const response = await fetch(`https://api.mailgun.net/v3/${domainName}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.API_KEY}`).toString('base64')}`,
            // 'Content-Type': 'application/x-www-form-urlencoded', // Remove this line
        },
        body: form // Use FormData as the body
    });
    console.log("RESPONSE", response)
    const responseData = await response.json();
    console.log(4, responseData);

    return responseData.id.slice(1, -1);
};
