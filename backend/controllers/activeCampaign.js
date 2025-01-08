import { emailData } from "../index.js";
import { getContactData, getOrganizationData, getCustomFieldData, getAllLists, createAccount, bulkImportContacts } from "../src/services/activeCampaign.js"
import { generateEmailsFromJsonList } from "../src/services/email_generation.js";
import { sendMail } from "../utils/sendMail.js";

async function handleSendMail(request, response) {
  try {
    const { contact } = request.body;
    const category = "NEW"
    // const contactData = parseFormData(body);
    console.log("Parsed contact data:", contact);

    const contactId = contact.id;
    const email = contact.email;
    const companyName = contact.orgname;

    if (!contactId) {
      throw new Error("Contact ID not found in webhook payload");
    }

    // Get detailed contact data
    const fullContactData = await getContactData(contactId);
    console.log("Full Contact Data", fullContactData);

    const empName =
      (fullContactData.contact?.firstName || "") +
      " " +
      (fullContactData.contact?.lastName || "");
    const designation =
      fullContactData.accountContacts?.[0]?.jobTitle || "";
    const shortBio = "";

    console.log(
      `Email: ${email}\ncompany_name: ${companyName}\nemp_name: ${empName}\ndesignation: ${designation}\nshort_bio: ${shortBio}`
    );

    if (!fullContactData) {
      throw new Error("Failed to fetch contact data");
    }

    const orgId = fullContactData.contact?.orgid;

    if (orgId) {
      const orgData = await getOrganizationData(orgId);
      console.log("Org Data", orgData);

      const link = orgData.links?.accountCustomFieldData || "";
      if (link) {
        let data = await getCustomFieldData(link);
        data = data.customerAccountCustomFieldData || [];
        console.log(data);

        let description = "";

        for (const link of data) {
          if (link.custom_field_id === "1") {
            description = link.custom_field_text_value;
          }
        }

        let prompt = "";
        if (category === "NOT_OPENED") {
          prompt = "11. Make an attractive subject line for open rate";
        } else if (category === "NOT_CLICKED") {
          prompt = "11. Make an attractive and informative body for click rate";
        }

        const aiGenMail = await generateEmailsFromJsonList(
          [
            {
              name: companyName,
              description: { long: description },
              employeeInfo: {
                employeeList: [
                  {
                    name: empName,
                    designation: designation,
                    shortBio: shortBio,
                  },
                ],
              },
            },
          ],
          prompt
        );

        console.log("Mail", typeof aiGenMail, aiGenMail);

        for (const aMail of aiGenMail) {
          const id = await sendMail(aMail);
          emailData.push({
            id: id,
            data: aMail,
            contact_id: contactId,
          });
        }
      }
    }
  } catch (error) {
    console.log(`Error in handleSendMail${error.message}`);
  }
}


async function handleGetLists(req, res) {
  try {
    const allLists = await getAllLists();
    return res.status(200).json({ data: allLists});
  } catch (error) {
    console.log(`Error in getLists: ${error.message}`);
  }
}

async function handleAddContact(req, res) {
    try {
        
    } catch (error) {
        console.log(`Error in handleAddContact: ${error}`);
    }
}

async function handleContactBulkUpload(req, res) {
  try {
    const { list_id, data } = req.body;
    const employeeData = [];

    for (let company of data) {
      const resp = await createAccount({
        account: {
            owner: 1,
            name: company.Name,
            accountUrl: company.Domain,
            fields: [
                { customFieldId: "1", fieldValue: company.Description },
                { customFieldId: "14", fieldValue: company.LinkedIn_URL },
                { customFieldId: "15", fieldValue: company.Business_Models },
                { customFieldId: "16", fieldValue: company.Primary_Industry }
            ]
        }
      });
      const companyId = resp.account?.id || "";

      for (const employee of company.Employee_List || []) {
        const primaryEmail = `user${Math.floor(Math.random() * 10000)}@gmail.com` || employee.emailInfo?.primaryEmail || '';
        console.log('Employee Info', {
            email: primaryEmail,
            firstName: employee.name?.replace(" ", "") || '',
            lastName: "",
            fieldValues: [
                { field: "1", value: employee.profileLinks?.linkedinHandle || '' }
            ]
        });
        employeeData.push({
            email: primaryEmail,
            first_name: employee.name?.replace(" ", "") || '',
            last_name: "",
            customer_acct_name: company?.Name,
            fields: [
                { id: 2, value: employee.profileLinks?.linkedinHandle || '' }
            ],
            subscribe: [
              { "listid": list_id },
            ]
        });
      }
    }

    if (employeeData.length > 0) {
      console.log("Bulk Importing Contacts...", {
        contacts: employeeData,
        callback: {
          requestType: "POST",
          detailed_results: "true",
          url: "www.google.com"
        }
      });

      const bulkUpload = await bulkImportContacts({
        contacts: employeeData,
        callback: {
          requestType: "POST",
          detailed_results: "true",
          url: "www.google.com"
        }
      });
    }

    console.log("Bulk Upload completed");
    return res.status(200).json({ message: "Bulk Upload completed" });
  } catch (error) {
    console.log(`Error in handleContactBulk: ${error}`);
  }
}

export { handleSendMail, handleAddContact, handleGetLists, handleContactBulkUpload }
