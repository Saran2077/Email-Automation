export const sendMail = async (emailData) => {
    // const emailData = JSON.parse(jsonEmail.generated_email);

    const subject = emailData.subject || emailData.Subject || '';
    const body = emailData.body || emailData.Body || '';
    const to = emailData.to;

    // Create a FormData instance
    const form = new FormData();
    form.append('from', "Saran <postmaster@sandboxed091eb00b0a47fa91a3c0113be24b39.mailgun.org>");
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
        },
        body: form // Use FormData as the body
    });

    const responseData = await response.json();

    return responseData.id.slice(1, -1);
};
