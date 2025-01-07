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

export { getContactData, getOrganizationData,getCustomFieldData };