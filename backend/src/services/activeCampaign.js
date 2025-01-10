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

async function getContactsData(query) {
    /**
     * Retrieve contact data from ActiveCampaign API
     */
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };
    
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/contacts?${new URLSearchParams(query).toString()}`;

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error(`Error fetching contact data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
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

async function getAllLists() {
    /**
     * Retrieve organization data from ActiveCampaign API
     */
    const headers = {
        'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'Content-Type': 'application/json'
    };
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/lists`;

    try {
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) {
            throw new Error(`Error fetching organization data: ${response.statusText}`);
        }
        const data = await response.json();
        return data.lists;
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

async function bulkImportContacts(contactData) {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/import/bulk_import`;

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
            throw new Error(`Error bulk uploading contacts: ${response.statusText} , Details: ${JSON.stringify(errorResponse)}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: `Error bulk uploading contacts: ${e.message}`});
    }
}

async function getAllCustomFields() {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/fields`;
    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error in fetching custom fields: ${response.statusText} , Details: ${JSON.stringify(errorResponse)}`);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }

}

async function updateContact(id, data) {
    const url = `${process.env.ACTIVE_CAMPAIGN_URL}/contacts/${id}`;
    try {
        const headers = {
            'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({contact: data})
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error in fetching custom fields: ${response.statusText} , Details: ${JSON.stringify(errorResponse)}`);
        }
        return await response.json();
    } catch (error) {
        console.error(e);
        return null;
    }
}

export { getContactData, getContactsData, getOrganizationData, getCustomFieldData, createAccount, createContact, createContactAssociation, getAllLists, bulkImportContacts, getAllCustomFields, updateContact };