async function getContactData(contactId) {
    /**
     * Retrieve contact data from ActiveCampaign API
     */
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };
    console.log('getContactData', headers, process.env.ACTIVE_CAMPAIGN_URL)
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/contacts/${contactId}`;

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error(`Error fetching contact data: ${response.statusText}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getOrganizationData(orgId) {
    /**
     * Retrieve organization data from ActiveCampaign API
     */
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/accounts/${orgId}`;

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error(`Error fetching organization data: ${response.statusText}`);
        }
        const data = await response.json();
        return data.account;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getCustomFieldData(url) {
    /**
     * Retrieve custom field data from ActiveCampaign API
     */
    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error(`Error fetching custom field data: ${response.statusText}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function createAccount(companyData) {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/accounts`;

    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        
        console.log('Creating account with data:', companyData);

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(companyData)
        });
        console.log('response', response)
        if (!response.ok) {
            const errorResponse = await response.json(); // Log the error response
            throw new Error(`Error creating account: ${response.statusText}, Details: ${JSON.stringify(errorResponse)}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function createContact(contactData) {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/contacts`;

    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(contactData)
        });
        if (!response.ok) {
            const errorResponse = await response.json(); // Log the error response
            throw new Error(`Error creating contact: ${response.statusText}, Details: ${JSON.stringify(errorResponse)}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function createContactAssociation(contactData) {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/accountContacts`;

    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(contactData)
        });
        if (!response.ok) {
            throw new Error(`Error creating association: ${response.statusText}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

export { getContactData, getOrganizationData, getCustomFieldData, createAccount, createContact, createContactAssociation };