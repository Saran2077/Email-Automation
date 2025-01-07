import { emailData } from "../index.js";
import { getContactData, getOrganizationData, getCustomFieldData } from "../services/activeCampaign.js"
import { generateEmailsFromJsonList } from "../services/email_generation.js";
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

export { handleSendMail }
