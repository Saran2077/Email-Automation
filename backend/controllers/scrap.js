// src/controllers/scrap.js

import { createAccount, createContact, createContactAssociation } from '../src/services/activeCampaign.js'; // Adjust the import path as necessary
import fs from 'fs';

const baseUrl = 'https://platform.tracxn.com/api/2.2/playground';

const extractRequiredFields = (companyData) => {
    /**
     * Extract only the required fields from the Tracxn API response
     */
    // Extract business models
    const businessModels = [];
    for (const bm of (companyData.businessModelList || [])) {
        const model = bm.fullPathString || bm.name || "";
        if (model && !businessModels.includes(model)) {
            businessModels.push(model);
        }
    }

    // Get description - combine long and short if available
    const descriptionData = companyData.description || {};
    const description = descriptionData.long || descriptionData.short || "";

    // Extract domain info
    const domain = companyData.domain || "";

    // Extract LinkedIn URL
    const profileLinks = companyData.profileLinks || {};
    const linkedinUrl = profileLinks.linkedIn || "";

    const primaryIndustry = [];
    for (const industry of (companyData.sectorList[0] || [])) {
        primaryIndustry.push(industry.name || "");
    }

    // Get annual revenue if available
    let annualRevenue = "Not Available";
    if (companyData.annualRevenue) {
        const revenueData = companyData.annualRevenue;
        const amount = revenueData.amount || 0;
        const unit = revenueData.unit ? revenueData.unit.toUpperCase() : "";
        if (unit === "M") {
            annualRevenue = `$${amount.toFixed(2)}M`;
        } else if (unit === "B") {
            annualRevenue = `$${amount.toFixed(2)}B`;
        } else {
            annualRevenue = `$${amount.toFixed(2)}`;
        }
    }

    return {
        Name: companyData.name || "",
        Description: description,
        Primary_Industry: primaryIndustry.join('>'),
        Business_Models: businessModels.join('>'),
        Domain: domain,
        LinkedIn_URL: linkedinUrl,
        Annual_Revenue: annualRevenue,
        Employee_List: companyData?.employeeInfo?.employeeList || []
    };
}

const fetchAllCompanies = async (req, res) => {
    /**
     * Fetch and process all companies with pagination
     */

    const { filter, from } = req.body;

    console.log(filter, from);

    // Function to remove keys with empty arrays
    const removeEmptyArrayKeys = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, value]) => !Array.isArray(value) || value.length > 0));
    }

    // Update filters to remove keys with empty arrays
    const filteredFilters = removeEmptyArrayKeys(filter);
    let params = {
        filter: filteredFilters,
    }

    if (from) {
        params['from'] = from;
    }

    const allCompanyData = [];

    const companiesList = await fetchCompaniesList(params);

    // console.log('companiesList', JSON.stringify(companiesList?.result?.[0]))
    for (const company of companiesList?.result) {
        const processedData = extractRequiredFields(company);
        allCompanyData.push(processedData);
    }

        return res.status(200).json({ data: allCompanyData })
        const resp = await createAccount({
            account: {
                owner: 1,
                name: processedData.Name,
                accountUrl: processedData.Domain,
                fields: [
                    { customFieldId: "1", fieldValue: processedData.Description },
                    { customFieldId: "14", fieldValue: processedData.LinkedIn_URL },
                    { customFieldId: "15", fieldValue: processedData.Business_Models },
                    { customFieldId: "16", fieldValue: processedData.Primary_Industry }
                ]
            }
        });

        const companyId = resp.account?.id || "";
        const employeeList = company.employeeInfo?.employeeList || [];
        console.log("Company employees", employeeList);

        for (const employee of employeeList) {
            const primaryEmail = `user${Math.floor(Math.random() * 10000)}@gmail.com` || employee.emailInfo?.primaryEmail || '';
            console.log('Employee Info', {
                email: primaryEmail,
                firstName: employee.name?.replace(" ", "") || '',
                lastName: "",
                fieldValues: [
                    { field: "1", value: employee.profileLinks?.linkedinHandle || '' }
                ]
            });
            if (primaryEmail) {
                const contact = await createContact({
                    contact: {
                    email: primaryEmail,
                    firstName: employee.name || '',
                    lastName: "M",
                    fieldValues: [
                        { field: "2", value: employee.profileLinks?.linkedinHandle || '' }
                    ]
                }});

                if (contact) {
                    const contactId = contact.contact?.id || '';
                    console.log('Contact ID', contactId);

                    const association = await createContactAssociation({
                        accountContact: {
                            contact: contactId,
                            account: companyId,
                            jobTitle: employee.designation || ""
                        }
                    });

                    console.log("Association", association);
                }
            }
        

        allCompanyData.push(processedData);

        // Save intermediate results periodically
        if (allCompanyData.length % 100 === 0) {
            // this.saveToCsv(allCompanyData, outputFile);
        }
    }

    // Save final results
    if (allCompanyData.length > 0) {
        // this.saveToCsv(allCompanyData, outputFile);
        console.log(`Completed! Total companies processed: ${allCompanyData.length}`);
    } else {
        console.log("No data was processed");
    }
}

const fetchCompaniesList = async(filters={}) => {
    /**
     * Fetch list of companies with pagination
     */
    try {
        const headers = {
            "accesstoken": `${process.env.TRACXN_API_KEY}`,
            'cache-control': 'no-cache',
            "Content-Type": "application/json"
        }
        const endpoint = `${baseUrl}/companies`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching companies list on page : ${error.message}`);
        return null;
    }
}




export { fetchAllCompanies };