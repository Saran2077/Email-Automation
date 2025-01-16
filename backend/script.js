import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const baseUrl = 'https://platform.tracxn.com/api/2.2/playground';

export function convertTracxnToExcel(tracxnData, outputPath) {
    try {
        // Validate input
        if (!Array.isArray(tracxnData) || tracxnData.length === 0) {
            throw new Error('Invalid input: Tracxn data must be a non-empty array');
        }

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(tracxnData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracxn Data');

        // Write to Excel file
        XLSX.writeFile(workbook, outputPath);

        console.log(`Excel file successfully created at: ${outputPath}`);
    } catch (error) {
        console.error('Error converting Tracxn data to Excel:', error.message);
        throw error;
    }
}

const tracxnData = []
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

    return {
        name: companyData.name || "",
        description: description,
        primaryIndustry: primaryIndustry.join('>'),
        businessModels: businessModels.join('>'),
        domain: domain,
        linkedInURL: linkedinUrl,
        employeeList: companyData?.employeeInfo?.employeeList || [],
        continent: companyData?.location?.continent,
        country: companyData?.location?.country,
        city: companyData?.location?.city,
        state: companyData?.location?.state,
        foundedYear: companyData?.foundedYear
    };
}

const fetchCompaniesList = async(filters={}) => {
    /**
     * Fetch list of companies with pagination
     */
    try {
        const headers = {
            "accesstoken": `4fb6e623-08f7-4c7a-b242-ee720ff5cff5`,
            'cache-control': 'no-cache',
            "Content-Type": "application/json"
        }
        console.log(headers)
        const endpoint = `${baseUrl}/companies`;

        console.log(JSON.stringify({...filters}))

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({...filters})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status},  statusText: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching companies list on page : ${error.message}`);
        return null;
    }
}
var from = 1;

while (true) {

    // const companiesList = await fetchCompaniesList({ from: from });
    const companiesList = {
        "result": [
            {
                "id": "Hxfcj5zaK4mLWyuBKORuwwu70xFB_GhPpAVdF7bxy-I",
                "name": "Nebtyid.com",
                "domain": "nebtyid.com",
                "tracxnUrl": "https://platform.tracxn.com/companies/Hxfcj5zaK4mLWyuBKORuwwu70xFB_GhPpAVdF7bxy-I/nebtyid.com",
                "businessModelList": [
                    {
                        "description": "Solution to detect and prevent digital identity theft",
                        "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "name": "Identity Theft",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Security of users against fraud, identity theft, payment fraud & phone fraud",
                                "id": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM",
                                "name": "Anti Fraud",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                            },
                            {
                                "description": "Solution to detect and prevent digital identity theft",
                                "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                                "name": "Identity Theft",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Anti Fraud>Identity Theft",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Solution to detect and prevent digital identity theft",
                        "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "name": "Identity Theft",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Security of users against fraud, identity theft, payment fraud & phone fraud",
                                "id": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM",
                                "name": "Anti Fraud",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                            },
                            {
                                "description": "Solution to detect and prevent digital identity theft",
                                "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                                "name": "Identity Theft",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Anti Fraud>Identity Theft",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Solution to detect and prevent digital identity theft",
                        "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "name": "Identity Theft",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAnti%20Fraud%20Management%7CbusinessModel%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAnti%20Fraud%20Management%7CbusinessModelId%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "feedId": "qhCujIf2911ypmSROkzvtWv1b3vtJsLjBBR9nrjqub4",
                        "feedName": "Anti Fraud Management",
                        "fullPathList": [
                            {
                                "tracxnId": "qhCujIf2911ypmSROkzvtWv1b3vtJsLjBBR9nrjqub4",
                                "name": "Anti Fraud Management",
                                "id": "qhCujIf2911ypmSROkzvtWv1b3vtJsLjBBR9nrjqub4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Security of users against fraud, identity theft, payment fraud & phone fraud",
                                "id": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM",
                                "name": "Anti Fraud",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                            },
                            {
                                "description": "Solution to detect and prevent digital identity theft",
                                "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                                "name": "Identity Theft",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                            }
                        ],
                        "fullPathString": "Anti Fraud Management>Cybersecurity>Anti Fraud>Identity Theft",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "feedTracxnId": "qhCujIf2911ypmSROkzvtWv1b3vtJsLjBBR9nrjqub4"
                    },
                    {
                        "description": "Solution to detect and prevent digital identity theft",
                        "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "name": "Identity Theft",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Theft%20Protection%7CbusinessModel%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Theft%20Protection%7CbusinessModelId%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "feedId": "sWYEKVDL8559UlPIPJklWZ7nDwUznqZLL4O3n6rUVP4",
                        "feedName": "Identity Theft Protection",
                        "fullPathList": [
                            {
                                "tracxnId": "sWYEKVDL8559UlPIPJklWZ7nDwUznqZLL4O3n6rUVP4",
                                "name": "Identity Theft Protection",
                                "id": "sWYEKVDL8559UlPIPJklWZ7nDwUznqZLL4O3n6rUVP4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Security of users against fraud, identity theft, payment fraud & phone fraud",
                                "id": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM",
                                "name": "Anti Fraud",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                            },
                            {
                                "description": "Solution to detect and prevent digital identity theft",
                                "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                                "name": "Identity Theft",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                            }
                        ],
                        "fullPathString": "Identity Theft Protection>Cybersecurity>Anti Fraud>Identity Theft",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "feedTracxnId": "sWYEKVDL8559UlPIPJklWZ7nDwUznqZLL4O3n6rUVP4"
                    },
                    {
                        "description": "Solution to detect and prevent digital identity theft",
                        "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "name": "Identity Theft",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D535de22ce4b0735cb1b3e164%3AIdentity%20Theft",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Security of users against fraud, identity theft, payment fraud & phone fraud",
                                "id": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM",
                                "name": "Anti Fraud",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                            },
                            {
                                "description": "Solution to detect and prevent digital identity theft",
                                "id": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                                "name": "Identity Theft",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Anti Fraud>Identity Theft",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    }
                ],
                "description": {
                    "long": "Provider of digital identity theft solutions. It provides businesses with a digital solution to prevent identity fraud and brand misuse. The company scans the internet to identify potential risks and helps businesses manage and mitigate it. It offers a range of services, including website and domain takedown, email spoofing detection, and cyber threat intelligence.",
                    "short": "Provider of digital identity theft solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": -1,
                    "httpStatusUpdatedDate": {
                        "year": 2025,
                        "month": 1,
                        "day": 7
                    },
                    "url": "http://nebtyid.com"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "Hxfcj5zaK4mLWyuBKORuwwu70xFB_GhPpAVdF7bxy-I",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Anti Fraud",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "0o4h8eEgU6lgxXkcc6qBN2QRI66pCRnh7-exco0SqTM"
                        },
                        {
                            "name": "Identity Theft",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "U6q86e4H9JzKznt-qIHJIlZ3bc0h9vyeQlx_kLOX7O0"
                        }
                    ]
                ],
                "companyId": "677c990b06388b74f15bc16e"
            },
            {
                "foundedYear": 2024,
                "id": "5lvM7yU5J6MGkzy-bWMrjKsfJMdeUGT4Iv4QLR-n5k4",
                "name": "CyberQuiz",
                "domain": "cyberquiz.io",
                "tracxnUrl": "https://platform.tracxn.com/companies/5lvM7yU5J6MGkzy-bWMrjKsfJMdeUGT4Iv4QLR-n5k4/cyberquiz.io",
                "businessModelList": [
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "Cybersecurity awareness training platform. It provides a comprehensive cybersecurity training solution for organizations, enabling them to assess and improve the staff cybersecurity knowledge and skills. The company offers a range of quizzes, training modules, and assessments to help businesses the cybersecurity posture and protect against cyber threats.",
                    "short": "Cybersecurity awareness training platform"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 30
                    },
                    "url": "https://cyberquiz.io"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/cyberquiz_io_c101b0f1-64ed-427d-a58a-6b066d10a817"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "tracxnId": "5lvM7yU5J6MGkzy-bWMrjKsfJMdeUGT4Iv4QLR-n5k4",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Cybersecurity Training",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                        },
                        {
                            "name": "Employee Awareness",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                        }
                    ]
                ],
                "companyId": "6771d8dd1558d26e6670ce4c"
            },
            {
                "id": "hfGvShfMfxvqbYPTz2C_hvM562SOVbDUrBTmAF3A-8g",
                "name": "Helm Guard",
                "domain": "helmguard.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "04JExUvOAyxd4xfvDHVL1uP6yDQ-J0iVqfIoTFs1dPY",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "stateGroup": [
                        "US East Coast"
                    ],
                    "city": "Dover",
                    "state": "Delaware",
                    "id": "04JExUvOAyxd4xfvDHVL1uP6yDQ-J0iVqfIoTFs1dPY"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/hfGvShfMfxvqbYPTz2C_hvM562SOVbDUrBTmAF3A-8g/helmguard.ai",
                "businessModelList": [
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "AI powered suite of cybersecurity solutions. It provides cyber defense solutions for enterprises. The technology performs defenses against emerging threats and optimizes the cybersecurity posture. It provides endpoint security, application security, email security, identity and access management, vulnerability management, observability, GRC, and more.",
                    "short": "AI powered suite of cybersecurity solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 23
                    },
                    "url": "https://helmguard.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "Delaware"
                        },
                        "city": {
                            "name": "Dover"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/helmguard_ai_f1f44977-011b-49e8-96af-ee0288793ff8"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "tracxnId": "hfGvShfMfxvqbYPTz2C_hvM562SOVbDUrBTmAF3A-8g",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Suite",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                        }
                    ]
                ],
                "companyId": "676903a28aa65e4480210927"
            },
            {
                "foundedYear": 2024,
                "id": "THaJ5mFwm7Pb_sQMQ-yCC2eRsYwZlC-JSp2NhVufVTo",
                "name": "TrustAI",
                "domain": "trustai.sg",
                "location": {
                    "continent": "Asia",
                    "country": "Singapore",
                    "tracxnId": "dex03oaPqnJgCWOxjs_9vZa5TNDlZHwisEX6hWUG68I",
                    "countryGroup": [
                        "Southeast Asia",
                        "Asia",
                        "APAC"
                    ],
                    "city": "Singapore",
                    "state": "Singapore",
                    "id": "dex03oaPqnJgCWOxjs_9vZa5TNDlZHwisEX6hWUG68I"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/THaJ5mFwm7Pb_sQMQ-yCC2eRsYwZlC-JSp2NhVufVTo/trustai.sg",
                "businessModelList": [
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20SEA%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20SEA%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "qYzSaK55VVCIoVDkTiDoe7ifYB2jprbW4ero3LgaaY4",
                        "feedName": "Enterprise Tech - SEA",
                        "fullPathList": [
                            {
                                "tracxnId": "qYzSaK55VVCIoVDkTiDoe7ifYB2jprbW4ero3LgaaY4",
                                "name": "Enterprise Tech - SEA",
                                "id": "qYzSaK55VVCIoVDkTiDoe7ifYB2jprbW4ero3LgaaY4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - SEA>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "qYzSaK55VVCIoVDkTiDoe7ifYB2jprbW4ero3LgaaY4"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20SEA%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20SEA%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "TC1vVoZqu3D0NgBzwcSK6lJ8d8c_MWgdpb4_fy1ello",
                        "feedName": "SaaS - SEA",
                        "fullPathList": [
                            {
                                "tracxnId": "TC1vVoZqu3D0NgBzwcSK6lJ8d8c_MWgdpb4_fy1ello",
                                "name": "SaaS - SEA",
                                "id": "TC1vVoZqu3D0NgBzwcSK6lJ8d8c_MWgdpb4_fy1ello",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "SaaS - SEA>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "TC1vVoZqu3D0NgBzwcSK6lJ8d8c_MWgdpb4_fy1ello"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                        "feedName": "Data Security",
                        "fullPathList": [
                            {
                                "tracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "name": "Data Security",
                                "id": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Data Security>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Singapore%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Singapore%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "A2ThpzndBxCvx5OVp_-7aSbm5iLCouOhrcYgOcLYr_I",
                        "feedName": "Enterprise Tech - Singapore",
                        "fullPathList": [
                            {
                                "tracxnId": "A2ThpzndBxCvx5OVp_-7aSbm5iLCouOhrcYgOcLYr_I",
                                "name": "Enterprise Tech - Singapore",
                                "id": "A2ThpzndBxCvx5OVp_-7aSbm5iLCouOhrcYgOcLYr_I",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Singapore>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "A2ThpzndBxCvx5OVp_-7aSbm5iLCouOhrcYgOcLYr_I"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20Singapore%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20Singapore%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "r1yTEJivoS-YZKdtrUutGvXCP0G7LUSbVcq0VQiBRM8",
                        "feedName": "SaaS - Singapore",
                        "fullPathList": [
                            {
                                "tracxnId": "r1yTEJivoS-YZKdtrUutGvXCP0G7LUSbVcq0VQiBRM8",
                                "name": "SaaS - Singapore",
                                "id": "r1yTEJivoS-YZKdtrUutGvXCP0G7LUSbVcq0VQiBRM8",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "SaaS - Singapore>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "r1yTEJivoS-YZKdtrUutGvXCP0G7LUSbVcq0VQiBRM8"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20Model%20Security%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20Model%20Security%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                        "feedName": "AI Model Security",
                        "fullPathList": [
                            {
                                "tracxnId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                                "name": "AI Model Security",
                                "id": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "AI Model Security>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "-oStzTgR5IWl_VwhM_kJjpiB5X2WqUPxgB7ZeiA3aP0",
                        "name": "SEA Tech",
                        "tracxnId": "-oStzTgR5IWl_VwhM_kJjpiB5X2WqUPxgB7ZeiA3aP0"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8",
                        "name": "Trending Themes in Enterprise Information Management",
                        "tracxnId": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8"
                    },
                    {
                        "id": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc",
                        "name": "Trending Themes in GRC Software",
                        "tracxnId": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc"
                    },
                    {
                        "id": "Ah4AFP5ZwemjDLDGtvp3x_4QOIWWJnikKSDYfKkZZ_0",
                        "name": "Singapore Tech",
                        "tracxnId": "Ah4AFP5ZwemjDLDGtvp3x_4QOIWWJnikKSDYfKkZZ_0"
                    }
                ],
                "description": {
                    "long": "AI security platform. It is a platform that focuses on GenAI security, providing solutions to mitigate risks such as prompt injections, data leakage, and toxic language. It provides AI-powered solutions to protect generative AI applications from malicious attacks, data breaches, and other potential threats.",
                    "short": "AI security platform"
                },
                "contactNumberList": [
                    {
                        "countryCode": "+65",
                        "number": "65318222"
                    }
                ],
                "emailList": [
                    {
                        "email": "marketing@trustai.sg"
                    },
                    {
                        "email": "sales@trustai.sg"
                    }
                ],
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "CEO",
                            "id": "o9dqUqu9D8YOqr29wPPpOAuxqvX6P8QSj5dddvdxe4Q",
                            "name": "Yue Xu",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/lawrence-xuu"
                            },
                            "shortBio": "Ex-StarCross Technology, Alibaba Cloud.",
                            "isKeyPeople": true,
                            "isFoundingMember": false,
                            "tracxnId": "o9dqUqu9D8YOqr29wPPpOAuxqvX6P8QSj5dddvdxe4Q"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "linkedIn": "https://linkedin.com/company/trustai-sg/about",
                    "twitter": "https://twitter.com/trustai_ltd"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://trustai.sg"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "Singapore"
                        },
                        "state": {
                            "name": "Singapore"
                        },
                        "city": {
                            "name": "Singapore"
                        },
                        "continent": {
                            "name": "Asia"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/trustai_sg_c47790d9-1d58-4be6-a47f-a5d7fece294c"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "THaJ5mFwm7Pb_sQMQ-yCC2eRsYwZlC-JSp2NhVufVTo",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Data Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                        },
                        {
                            "name": "AI Model Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                        }
                    ]
                ],
                "companyId": "67477694d28e6a50cd4f1c28"
            },
            {
                "foundedYear": 2024,
                "id": "cV-Rw7W-pi4UYWBoKxQh5VR7CNA9Fno2DctfjulYpzk",
                "name": "Sunnies",
                "domain": "sunnies.co.jp",
                "location": {
                    "continent": "Asia",
                    "country": "Japan",
                    "tracxnId": "7FFE8liF1JIfO7C2p3XdPWmZHqGOC4em6Tp9kMQLY-w",
                    "countryGroup": [
                        "Asia",
                        "APAC"
                    ],
                    "city": "Chiyoda-ku",
                    "state": "Tokyo-to",
                    "id": "7FFE8liF1JIfO7C2p3XdPWmZHqGOC4em6Tp9kMQLY-w"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/cV-Rw7W-pi4UYWBoKxQh5VR7CNA9Fno2DctfjulYpzk/sunnies.co.jp",
                "totalMoneyRaised": {
                    "totalAmount": {
                        "amount": 213253,
                        "currency": "USD"
                    }
                },
                "businessModelList": [
                    {
                        "description": "Companies that provide a secure platform to generate and manage  secure password",
                        "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "name": "Password Manager",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a secure platform to generate and manage  secure password",
                                "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                                "name": "Password Manager",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw"
                            }
                        ],
                        "fullPathString": "Cybersecurity>IAM>Password Manager",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a secure platform to generate and manage  secure password",
                        "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "name": "Password Manager",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Japan%7CbusinessModel%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Japan%7CbusinessModelId%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "feedId": "kK2ClN_xRCPDDzZFDPOFQOmUwBDQw1WkXT2XXCiK-Ro",
                        "feedName": "Enterprise Tech - Japan",
                        "fullPathList": [
                            {
                                "tracxnId": "kK2ClN_xRCPDDzZFDPOFQOmUwBDQw1WkXT2XXCiK-Ro",
                                "name": "Enterprise Tech - Japan",
                                "id": "kK2ClN_xRCPDDzZFDPOFQOmUwBDQw1WkXT2XXCiK-Ro",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a secure platform to generate and manage  secure password",
                                "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                                "name": "Password Manager",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Japan>Cybersecurity>IAM>Password Manager",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "feedTracxnId": "kK2ClN_xRCPDDzZFDPOFQOmUwBDQw1WkXT2XXCiK-Ro"
                    },
                    {
                        "description": "Companies that provide a secure platform to generate and manage  secure password",
                        "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "name": "Password Manager",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Access%20Management%7CbusinessModel%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Access%20Management%7CbusinessModelId%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "feedId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                        "feedName": "Identity Access Management",
                        "fullPathList": [
                            {
                                "tracxnId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                                "name": "Identity Access Management",
                                "id": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a secure platform to generate and manage  secure password",
                                "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                                "name": "Password Manager",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw"
                            }
                        ],
                        "fullPathString": "Identity Access Management>Cybersecurity>IAM>Password Manager",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "feedTracxnId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI"
                    },
                    {
                        "description": "Companies that provide a secure platform to generate and manage  secure password",
                        "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "name": "Password Manager",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D537329bfe4b0595dbe736785%3APassword%20Manager",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a secure platform to generate and manage  secure password",
                                "id": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                                "name": "Password Manager",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>IAM>Password Manager",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "3xP0S5Ww8Zu903607fXCWccGVijxkelRxOwCYuibDqo",
                        "name": "Japan Tech",
                        "tracxnId": "3xP0S5Ww8Zu903607fXCWccGVijxkelRxOwCYuibDqo"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "Provider of password manager solutions. It displays a list of services in use. The platform generates different email address, ID, and password for each service. The emails sent to multiple generated email addresses can be managed from the mailbox.",
                    "short": "Provider of password manager solutions"
                },
                "stageDetails": {
                    "isFunded": true,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Seed",
                "fundingInfo": {
                    "numberOfFundingRounds": 2,
                    "fundingRoundList": [
                        {
                            "id": "mpkOpQjMcvKVk9wgxX8qA8fnp5Lt-KmcQfwasrFF5I4",
                            "amount": {
                                "amount": "Undisclosed"
                            },
                            "date": {
                                "day": 19,
                                "month": 11,
                                "year": 2024
                            },
                            "investorList": [
                                {
                                    "id": "5319fdc8e4b0f7e1660562c7",
                                    "tracxnId": "AOGd6BicGpR9CpZn7tQHYRe2Dud2L8B--nJ2mht1TqM",
                                    "domain": "jfc.go.jp",
                                    "name": "JFC",
                                    "isFirstInvestment": true,
                                    "isLeadInvestor": false,
                                    "investorType": "CORPORATE_INVESTOR",
                                    "type": "COMPANY"
                                }
                            ],
                            "name": "Conventional Debt",
                            "tracxnId": "mpkOpQjMcvKVk9wgxX8qA8fnp5Lt-KmcQfwasrFF5I4"
                        },
                        {
                            "id": "14iaSNJLst-rqiblNWrpOVT6Ke90GJk2kA73o6TvHF8",
                            "amount": {
                                "amount": 213253.0,
                                "currency": "USD"
                            },
                            "date": {
                                "day": 19,
                                "month": 11,
                                "year": 2024
                            },
                            "investorList": [
                                {
                                    "id": "673c22ea74da5f300f0afc54",
                                    "tracxnId": "Dmth0Fsflrbmi6pcBdv5hXwkMjIlJH0WJMmRtvTZoHc",
                                    "domain": "hyperion-vc.jp",
                                    "name": "Hyperion",
                                    "isFirstInvestment": true,
                                    "isLeadInvestor": false,
                                    "type": "COMPANY"
                                }
                            ],
                            "name": "Seed",
                            "tracxnId": "14iaSNJLst-rqiblNWrpOVT6Ke90GJk2kA73o6TvHF8"
                        }
                    ],
                    "latestRoundInfo": {
                        "id": "673c2341703c713c7ee48890",
                        "linkList": [
                            {
                                "isVisibleToExternal": true,
                                "url": "https://startuplog.com/n/n2608ebccd1d0"
                            },
                            {
                                "isVisibleToExternal": true,
                                "url": "https://prtimes.jp/main/html/rd/p/000000001.000147785.html"
                            }
                        ],
                        "amount": {
                            "amount": "Undisclosed"
                        },
                        "date": {
                            "day": 19,
                            "month": 11,
                            "year": 2024
                        },
                        "investorList": [
                            {
                                "id": "5319fdc8e4b0f7e1660562c7",
                                "tracxnId": "AOGd6BicGpR9CpZn7tQHYRe2Dud2L8B--nJ2mht1TqM",
                                "domain": "jfc.go.jp",
                                "name": "JFC",
                                "isFirstInvestment": true,
                                "isLeadInvestor": false,
                                "investorType": "CORPORATE_INVESTOR",
                                "type": "COMPANY"
                            }
                        ],
                        "name": "Conventional Debt",
                        "tracxnId": "mpkOpQjMcvKVk9wgxX8qA8fnp5Lt-KmcQfwasrFF5I4"
                    },
                    "investorInfo": {
                        "numberOfInstitutionalInvestors": 2
                    }
                },
                "investorList": [
                    {
                        "domain": "jfc.go.jp",
                        "id": "AOGd6BicGpR9CpZn7tQHYRe2Dud2L8B--nJ2mht1TqM",
                        "name": "JFC",
                        "type": "COMPANY",
                        "tracxnId": "AOGd6BicGpR9CpZn7tQHYRe2Dud2L8B--nJ2mht1TqM"
                    },
                    {
                        "domain": "hyperion-vc.jp",
                        "id": "Dmth0Fsflrbmi6pcBdv5hXwkMjIlJH0WJMmRtvTZoHc",
                        "name": "Hyperion",
                        "type": "COMPANY",
                        "tracxnId": "Dmth0Fsflrbmi6pcBdv5hXwkMjIlJH0WJMmRtvTZoHc"
                    }
                ],
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://sunnies.co.jp"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "Japan"
                        },
                        "state": {
                            "name": "Tokyo-to"
                        },
                        "city": {
                            "name": "Chiyoda-ku"
                        },
                        "continent": {
                            "name": "Asia"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/sunnies_co_jp_44facc57-455f-450d-a732-0243e7b2e700"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 21.349510987011755,
                "metrics": {
                    "value": {
                        "avgInstitutionalinvestorScore": {
                            "percentile": 23.013220835263485
                        },
                        "totalInstituitionalinvestors": {
                            "percentile": 60.364000287355616
                        },
                        "maxInstitutionalinvestorScore": {
                            "percentile": 48.30522120188961
                        }
                    }
                },
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 33.641278186216056,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "cV-Rw7W-pi4UYWBoKxQh5VR7CNA9Fno2DctfjulYpzk",
                "tracxnSizeScore": 17.87231626078607,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "IAM",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                        },
                        {
                            "name": "Password Manager",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "2EM1DXVuhmcGVWMoEvNI4ktpX9a0ncN_bjWFKMUuyaw"
                        }
                    ]
                ],
                "companyId": "673c2157703c713c7ee4841e"
            },
            {
                "foundedYear": 2024,
                "id": "QrHo2HCj-P5WYzLUArvskdDQHfXSL3iHYhFZc1UoVTI",
                "name": "Narravance",
                "domain": "narravance.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "YAweRh5bz0d4CKQXtxoZJ-XpOdbPD8vcZn2WM0QiQX8",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "stateGroup": [
                        "US East Coast"
                    ],
                    "city": "Princeton",
                    "state": "New Jersey",
                    "id": "YAweRh5bz0d4CKQXtxoZJ-XpOdbPD8vcZn2WM0QiQX8"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/QrHo2HCj-P5WYzLUArvskdDQHfXSL3iHYhFZc1UoVTI/narravance.ai",
                "businessModelList": [
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIndustrial%20Security%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIndustrial%20Security%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "Td_8LL2R_BSeQVSr-KX2F_xhDEy41uVXfFDJq0qghYw",
                        "feedName": "Industrial Security",
                        "fullPathList": [
                            {
                                "tracxnId": "Td_8LL2R_BSeQVSr-KX2F_xhDEy41uVXfFDJq0qghYw",
                                "name": "Industrial Security",
                                "id": "Td_8LL2R_BSeQVSr-KX2F_xhDEy41uVXfFDJq0qghYw",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Industrial Security>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "Td_8LL2R_BSeQVSr-KX2F_xhDEy41uVXfFDJq0qghYw"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Companies that provide security solutions for social media accounts",
                        "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "name": "Social Media",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D6322ea46f1e834013e793016%3ASocial%20Media",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide cybersecurity for Operations technology such as IACS & SCADA systems",
                                "id": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw",
                                "name": "Industrial Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                            },
                            {
                                "description": "Companies that provide industry specific security solutions",
                                "id": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg",
                                "name": "Industry Specific",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                            },
                            {
                                "description": "Companies that provide security solutions for social media accounts",
                                "id": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                                "name": "Social Media",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Industrial Security>Industry Specific>Social Media",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "Analytics and compliance solutions for social media platforms. It is an artificial intelligence powered analytics platform that provides social media monitoring and compliance solutions. The company enables organizations to navigate the social media regulations for business intelligence and market research.",
                    "short": "Analytics and compliance solutions for social media platforms"
                },
                "emailList": [
                    {
                        "email": "support@narravance.ai"
                    },
                    {
                        "email": "admin@narravance.ai"
                    }
                ],
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "CEO",
                            "id": "YZdYVtRFM9dkc8Dd95z60YTSuzCzh3e4tyK0XIWbN3M",
                            "name": "Adam Sohn",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/adam-sohn"
                            },
                            "shortBio": "Ex-SHRM, Charles Koch Foundation, AARP. Columbia University",
                            "isKeyPeople": true,
                            "isFoundingMember": false,
                            "tracxnId": "YZdYVtRFM9dkc8Dd95z60YTSuzCzh3e4tyK0XIWbN3M"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "linkedIn": "https://linkedin.com/company/narravance/about"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://www.narravance.ai/"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "New Jersey"
                        },
                        "city": {
                            "name": "Princeton"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/narravance_ai_67fca055-d8f6-4eaf-9a3d-d1e7c834d756"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "QrHo2HCj-P5WYzLUArvskdDQHfXSL3iHYhFZc1UoVTI",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Industrial Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Qf-WRK-CZByZs01go7sgrhsty46s4WF_tLW6upFMsRw"
                        },
                        {
                            "name": "Industry Specific",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "CF29Bjx95Xu1YEtydOeOkXMB6nlyvjge3rV3ggtqxxg"
                        },
                        {
                            "name": "Social Media",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "BFTsgyUEL5_ALCpyxJda6YAsXrXPwJKQiX4G_P_ZhVs"
                        }
                    ]
                ],
                "companyId": "6730604c3109702fa4115907"
            },
            {
                "foundedYear": 2024,
                "id": "FuC3zmo3ya6toHnNejQZjor1d_Bn8O4tyAYAJHoj8TU",
                "name": "Symbiotic Security",
                "domain": "symbioticsec.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "SEaLQ3ur1EwQQRiy59BYuD8VcAr8ojrFRuDM2H-Nhs0",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "stateGroup": [
                        "US East Coast"
                    ],
                    "city": "New York",
                    "state": "New York",
                    "id": "SEaLQ3ur1EwQQRiy59BYuD8VcAr8ojrFRuDM2H-Nhs0"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/FuC3zmo3ya6toHnNejQZjor1d_Bn8O4tyAYAJHoj8TU/symbioticsec.ai",
                "totalMoneyRaised": {
                    "totalAmount": {
                        "amount": 3000000,
                        "currency": "USD"
                    }
                },
                "businessModelList": [
                    {
                        "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                        "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "name": "Code Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                                "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                                "name": "Code Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Application Security>Code Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                        "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "name": "Code Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCode%20Security%20Softwares%7CbusinessModel%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCode%20Security%20Softwares%7CbusinessModelId%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "feedId": "kwR6sI_FYOj1vnbjvJsXsFajCmRYToi98ewTv74Y8Dk",
                        "feedName": "Code Security Softwares",
                        "fullPathList": [
                            {
                                "tracxnId": "kwR6sI_FYOj1vnbjvJsXsFajCmRYToi98ewTv74Y8Dk",
                                "name": "Code Security Softwares",
                                "id": "kwR6sI_FYOj1vnbjvJsXsFajCmRYToi98ewTv74Y8Dk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                                "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                                "name": "Code Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw"
                            }
                        ],
                        "fullPathString": "Code Security Softwares>Cybersecurity>Application Security>Code Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "feedTracxnId": "kwR6sI_FYOj1vnbjvJsXsFajCmRYToi98ewTv74Y8Dk"
                    },
                    {
                        "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                        "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "name": "Code Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCode%20Security%7CbusinessModel%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCode%20Security%7CbusinessModelId%3D61b7051a91c2d15cdf1758b2%3ACode%20Security",
                        "feedId": "eUwO4VmmgcV3TTmlmpEslFEDmzY3hk9mn7FvsSs71Ac",
                        "feedName": "Code Security",
                        "fullPathList": [
                            {
                                "tracxnId": "eUwO4VmmgcV3TTmlmpEslFEDmzY3hk9mn7FvsSs71Ac",
                                "name": "Code Security",
                                "id": "eUwO4VmmgcV3TTmlmpEslFEDmzY3hk9mn7FvsSs71Ac",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide threat detection and vulnerability detection solutions for source codes in software development life cycle",
                                "id": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                                "name": "Code Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw"
                            }
                        ],
                        "fullPathString": "Code Security>Cybersecurity>Application Security>Code Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw",
                        "feedTracxnId": "eUwO4VmmgcV3TTmlmpEslFEDmzY3hk9mn7FvsSs71Ac"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    }
                ],
                "description": {
                    "long": "Cloud based platform offering code security solutions. It is a cybersecurity company that leverages artificial intelligence to provide security solutions for developers. The companys AI-powered security coach integrates with developers integrated development environments to detect and remediate security vulnerabilities in real-time.",
                    "short": "Cloud based platform offering code security solutions"
                },
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "Co-Founder & CTO",
                            "id": "7JK4dSneQS3MWQQnjZ3hPsJFaK4ZhX8xEfWO8mSx6DA",
                            "name": "Edouard Viot",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/edouardviot"
                            },
                            "shortBio": "Ex-Houlihan Lokey, GitGuardian, Rohde & Schwarz Cybersecurity, Stormshield, SkyRecon Systems. EPITECH European Institute of Technology 2011",
                            "isKeyPeople": true,
                            "isFoundingMember": true,
                            "tracxnId": "7JK4dSneQS3MWQQnjZ3hPsJFaK4ZhX8xEfWO8mSx6DA"
                        },
                        {
                            "designation": "Co-Founder & CEO",
                            "emailInfo": {
                                "primaryEmail": "**********",
                                "emailList": [
                                    "**********"
                                ]
                            },
                            "id": "O3M6b3kcxTw31kxOmRkV2Sz90SobiD6y_bWiNbb_Ero",
                            "name": "Jerome Robert",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/jeromerobert2"
                            },
                            "shortBio": "Ex-Alsid, EclecticIQ, Orange Cyberdefense, Arkoon-Netasq, SkyRecon Systems. EFREI - Large digital school MS 2004, ESSEC Business School EMBA 2011",
                            "isKeyPeople": true,
                            "isFoundingMember": true,
                            "tracxnId": "O3M6b3kcxTw31kxOmRkV2Sz90SobiD6y_bWiNbb_Ero"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": true,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Seed",
                "fundingInfo": {
                    "numberOfFundingRounds": 1,
                    "fundingRoundList": [
                        {
                            "id": "oACNwAdas45ZRYA9dyJzmi0LKFWaR4kS9_5WA2anpA8",
                            "amount": {
                                "amount": 3000000.0,
                                "currency": "USD"
                            },
                            "date": {
                                "day": 7,
                                "month": 11,
                                "year": 2024
                            },
                            "investorList": [
                                {
                                    "id": "542db932e4b06fa553e14e5b",
                                    "tracxnId": "CxRlCDBQ-wzSjQcV8ZOvGITLTV3snl4FCaHwhMBQ_xI",
                                    "domain": "lererhippeau.com",
                                    "name": "Lerer Hippeau",
                                    "isFirstInvestment": true,
                                    "isLeadInvestor": false,
                                    "investorType": "FUND",
                                    "type": "COMPANY"
                                },
                                {
                                    "id": "623aac876399bf2789f8f12e",
                                    "tracxnId": "aDEsFdYHrAy4evTlHJfO5Aj1rOuzCi0gCdfb02Wg-c0",
                                    "domain": "axc.vc",
                                    "name": "Axeleo Capital",
                                    "isFirstInvestment": true,
                                    "isLeadInvestor": false,
                                    "investorType": "FUND",
                                    "type": "COMPANY"
                                },
                                {
                                    "id": "62eec9781b9fb246688e6ca8",
                                    "tracxnId": "aJTFxkNPGwVWa9CDRcqJDv7r2ZVIFmZye4gPy2OWRnY",
                                    "domain": "factorialcap.com",
                                    "name": "Factorial",
                                    "isFirstInvestment": true,
                                    "isLeadInvestor": false,
                                    "investorType": "FUND",
                                    "type": "COMPANY"
                                }
                            ],
                            "name": "Seed",
                            "tracxnId": "oACNwAdas45ZRYA9dyJzmi0LKFWaR4kS9_5WA2anpA8"
                        }
                    ],
                    "latestRoundInfo": {
                        "id": "672c8a1b83c92d7c2c5edecc",
                        "linkList": [
                            {
                                "isVisibleToExternal": true,
                                "url": "https://cfotech.com.au/story/symbiotic-security-secures-3m-to-boost-shift-left-strategy"
                            },
                            {
                                "isVisibleToExternal": true,
                                "url": "https://securitybrief.asia/story/symbiotic-security-secures-3m-to-boost-shift-left-strategy"
                            },
                            {
                                "isVisibleToExternal": true,
                                "url": "https://pulse2.com/symbiotic-security-raises-3-million-seed-to-offer-real-time-feedback-on-vulnerabilities/"
                            }
                        ],
                        "amount": {
                            "amount": 3000000.0,
                            "currency": "USD"
                        },
                        "date": {
                            "day": 7,
                            "month": 11,
                            "year": 2024
                        },
                        "investorList": [
                            {
                                "id": "542db932e4b06fa553e14e5b",
                                "tracxnId": "CxRlCDBQ-wzSjQcV8ZOvGITLTV3snl4FCaHwhMBQ_xI",
                                "domain": "lererhippeau.com",
                                "name": "Lerer Hippeau",
                                "isFirstInvestment": true,
                                "isLeadInvestor": false,
                                "investorType": "FUND",
                                "type": "COMPANY"
                            },
                            {
                                "id": "623aac876399bf2789f8f12e",
                                "tracxnId": "aDEsFdYHrAy4evTlHJfO5Aj1rOuzCi0gCdfb02Wg-c0",
                                "domain": "axc.vc",
                                "name": "Axeleo Capital",
                                "isFirstInvestment": true,
                                "isLeadInvestor": false,
                                "investorType": "FUND",
                                "type": "COMPANY"
                            },
                            {
                                "id": "62eec9781b9fb246688e6ca8",
                                "tracxnId": "aJTFxkNPGwVWa9CDRcqJDv7r2ZVIFmZye4gPy2OWRnY",
                                "domain": "factorialcap.com",
                                "name": "Factorial",
                                "isFirstInvestment": true,
                                "isLeadInvestor": false,
                                "investorType": "FUND",
                                "type": "COMPANY"
                            }
                        ],
                        "name": "Seed",
                        "tracxnId": "oACNwAdas45ZRYA9dyJzmi0LKFWaR4kS9_5WA2anpA8"
                    },
                    "investorInfo": {
                        "numberOfInstitutionalInvestors": 3
                    }
                },
                "investorList": [
                    {
                        "domain": "lererhippeau.com",
                        "id": "CxRlCDBQ-wzSjQcV8ZOvGITLTV3snl4FCaHwhMBQ_xI",
                        "name": "Lerer Hippeau",
                        "type": "COMPANY",
                        "tracxnId": "CxRlCDBQ-wzSjQcV8ZOvGITLTV3snl4FCaHwhMBQ_xI"
                    },
                    {
                        "domain": "axc.vc",
                        "id": "aDEsFdYHrAy4evTlHJfO5Aj1rOuzCi0gCdfb02Wg-c0",
                        "name": "Axeleo Capital",
                        "type": "COMPANY",
                        "tracxnId": "aDEsFdYHrAy4evTlHJfO5Aj1rOuzCi0gCdfb02Wg-c0"
                    },
                    {
                        "domain": "factorialcap.com",
                        "id": "aJTFxkNPGwVWa9CDRcqJDv7r2ZVIFmZye4gPy2OWRnY",
                        "name": "Factorial",
                        "type": "COMPANY",
                        "tracxnId": "aJTFxkNPGwVWa9CDRcqJDv7r2ZVIFmZye4gPy2OWRnY"
                    }
                ],
                "profileLinks": {
                    "linkedIn": "http://linkedin.com/company/symbiotic-security/"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://www.symbioticsec.ai/"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "newsInfo": {
                    "newsList": [
                        {
                            "headLine": "Symbiotic Security Raises $3 Million (Seed) To Offer Real-Time Feedback On Vulnerabilities",
                            "sourceUrl": "https://pulse2.com/symbiotic-security-raises-3-million-seed-to-offer-real-time-feedback-on-vulnerabilities/"
                        }
                    ],
                    "totalArticles": 2,
                    "latestNews": {
                        "datePublished": {
                            "year": 2024,
                            "month": 11,
                            "day": 11
                        }
                    }
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "New York"
                        },
                        "city": {
                            "name": "New York"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/symbioticsec_ai_27cd6583-3308-4893-b697-ba0642e6c169"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 32.59423300006743,
                "metrics": {
                    "value": {
                        "avgInstitutionalinvestorScore": {
                            "percentile": 45.38360735333097
                        },
                        "totalInstituitionalinvestors": {
                            "percentile": 74.97306041156259
                        },
                        "maxInstitutionalinvestorScore": {
                            "percentile": 91.45439096712504
                        }
                    }
                },
                "specialFlagList": [
                    {
                        "name": "Consumer",
                        "value": "Untagged"
                    },
                    {
                        "name": "Enterprise",
                        "value": "Untagged"
                    },
                    {
                        "name": "Marketplace",
                        "value": "Untagged"
                    },
                    {
                        "name": "SaaS",
                        "value": "Untagged"
                    },
                    {
                        "name": "Tech",
                        "value": "Untagged"
                    },
                    {
                        "name": "Software",
                        "value": "Untagged"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "Untagged"
                    },
                    {
                        "name": "Social Impact",
                        "value": "Untagged"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "Untagged"
                    },
                    {
                        "name": "Blockchain",
                        "value": "Untagged"
                    }
                ],
                "tracxnTeamScore": 52.69884299826654,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    },
                    {
                        "name": "Has Marquee Institutional Investors",
                        "category": "Team"
                    }
                ],
                "tracxnId": "FuC3zmo3ya6toHnNejQZjor1d_Bn8O4tyAYAJHoj8TU",
                "tracxnSizeScore": 26.616207125976313,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Application Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                        },
                        {
                            "name": "Code Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "T1tXiRbwy71YJIo8l3HyDz8EnEm26a5EYI4PGpNK1Vw"
                        }
                    ]
                ],
                "companyId": "672c8598f542d370c9b89842"
            },
            {
                "foundedYear": 2024,
                "id": "Q6UkOGSASGbnuRpM54sLgXpkgxscVsQO69_h_LFll7E",
                "name": "ClearPhish",
                "domain": "clearphish.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "c7m2_73zH1x-qRxzAL9_uAl2KjB1bfPY0zz8lFI-Bp0",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "stateGroup": [
                        "US East Coast"
                    ],
                    "city": "Lewes",
                    "state": "Delaware",
                    "id": "c7m2_73zH1x-qRxzAL9_uAl2KjB1bfPY0zz8lFI-Bp0"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/Q6UkOGSASGbnuRpM54sLgXpkgxscVsQO69_h_LFll7E/clearphish.ai",
                "businessModelList": [
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                        "feedName": "SaaS - US",
                        "fullPathList": [
                            {
                                "tracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "name": "SaaS - US",
                                "id": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "SaaS - US>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Companies providing platforms which offer security awareness training for employees",
                        "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "name": "Employee Awareness",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D60018132655da9656852bf99%3AEmployee%20Awareness",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies providing platforms which offer security awareness training for employees",
                                "id": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                                "name": "Employee Awareness",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Cybersecurity Training>Employee Awareness",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    }
                ],
                "description": {
                    "long": "Provider of cyber awareness and training solutions. It provides precision phishing simulations and tactical training, that helps workforce to defend against evolving threats, safeguarding organization. It offers precision-targeted simulations that take into account factors such as employee roles, the departmental responsibilities, events in departments, key triggers in a specific job role, and the most expected emails coming into the inboxes daily.",
                    "short": "Provider of cyber awareness and training solutions"
                },
                "contactNumberList": [
                    {
                        "countryCode": "+1",
                        "number": "4089008420"
                    }
                ],
                "emailList": [
                    {
                        "email": "info@clearphish.ai"
                    }
                ],
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "Co-Founder & CEO",
                            "id": "e3DiueG6oZywC8WVVxigxm2k3ueMag87SrnmBjyj_GY",
                            "name": "Deepak Saini",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/deepaksaini1144"
                            },
                            "shortBio": "Founder ValueSec Technology and Consultin, ex-Dr. Reddy's Laboratories, Ranbaxy R&D Center, Samsung Electronics. Motivational Pathway BTech 2004",
                            "isKeyPeople": true,
                            "isFoundingMember": true,
                            "tracxnId": "e3DiueG6oZywC8WVVxigxm2k3ueMag87SrnmBjyj_GY"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "blog": "https://www.clearphish.ai/blog",
                    "linkedIn": "https://linkedin.com/company/clearphish",
                    "twitter": "https://x.com/clearphish"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://www.clearphish.ai/"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "Delaware"
                        },
                        "city": {
                            "name": "Lewes"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/evscd_4d0e4518-ad1b-42fa-b434-9671d9a4405e.JPG"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "addresses": [
                    {
                        "type": "Headquarters",
                        "street": "16192 Coastal Hwy, Lewes, DE 19958, USA"
                    }
                ],
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "tracxnId": "Q6UkOGSASGbnuRpM54sLgXpkgxscVsQO69_h_LFll7E",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Cybersecurity Training",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                        },
                        {
                            "name": "Employee Awareness",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "HfgXrAcOZmq7baJCYKf1oUDgzPwXoQttlFeN5sXC5Ns"
                        }
                    ]
                ],
                "companyId": "6728a1bdce97a24889d5084d"
            },
            {
                "foundedYear": 2023,
                "id": "os8Qd2i7eu_R0J8SWfeW_gltNm59XRQ3c4M_w6_9qqI",
                "name": "AquilaX",
                "domain": "aquilax.ai",
                "location": {
                    "continent": "Europe",
                    "country": "United Kingdom",
                    "tracxnId": "SkyrYC2ds7t9aUJ8pPSlHlo1_aThpoAHsl6uyPUuMNk",
                    "countryGroup": [
                        "Europe",
                        "Western Europe",
                        "UK & Ireland",
                        "Euro"
                    ],
                    "city": "London",
                    "state": "England",
                    "id": "SkyrYC2ds7t9aUJ8pPSlHlo1_aThpoAHsl6uyPUuMNk"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/os8Qd2i7eu_R0J8SWfeW_gltNm59XRQ3c4M_w6_9qqI/aquilax.ai",
                "businessModelList": [
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%20%26%20Ireland%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                        "feedName": "Artificial Intelligence - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                                "name": "Artificial Intelligence - UK & Ireland",
                                "id": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Europe%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Europe%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                        "feedName": "Enterprise Tech - Europe",
                        "fullPathList": [
                            {
                                "tracxnId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                                "name": "Enterprise Tech - Europe",
                                "id": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Europe>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20Europe%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20Europe%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "d_cWu6mF1rfPmH-szXKtA7iF52yR6mXd2zej4Gjjtm8",
                        "feedName": "SaaS - Europe",
                        "fullPathList": [
                            {
                                "tracxnId": "d_cWu6mF1rfPmH-szXKtA7iF52yR6mXd2zej4Gjjtm8",
                                "name": "SaaS - Europe",
                                "id": "d_cWu6mF1rfPmH-szXKtA7iF52yR6mXd2zej4Gjjtm8",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "SaaS - Europe>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "d_cWu6mF1rfPmH-szXKtA7iF52yR6mXd2zej4Gjjtm8"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DDevSecOps%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DDevSecOps%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                        "feedName": "DevSecOps",
                        "fullPathList": [
                            {
                                "tracxnId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                                "name": "DevSecOps",
                                "id": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "DevSecOps>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20UK%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20UK%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "kse3lh9_lGPlbZQ8kH6CeOIGrgAMN36whc625HAaxns",
                        "feedName": "SaaS - UK",
                        "fullPathList": [
                            {
                                "tracxnId": "kse3lh9_lGPlbZQ8kH6CeOIGrgAMN36whc625HAaxns",
                                "name": "SaaS - UK",
                                "id": "kse3lh9_lGPlbZQ8kH6CeOIGrgAMN36whc625HAaxns",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "SaaS - UK>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "kse3lh9_lGPlbZQ8kH6CeOIGrgAMN36whc625HAaxns"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                        "feedName": "Artificial Intelligence - UK",
                        "fullPathList": [
                            {
                                "tracxnId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                                "name": "Artificial Intelligence - UK",
                                "id": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - UK>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Euro%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Euro%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                        "feedName": "Enterprise Tech - Euro",
                        "fullPathList": [
                            {
                                "tracxnId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                                "name": "Enterprise Tech - Euro",
                                "id": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Euro>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20Europe%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20Europe%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                        "feedName": "Artificial Intelligence - Europe",
                        "fullPathList": [
                            {
                                "tracxnId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                                "name": "Artificial Intelligence - Europe",
                                "id": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - Europe>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%20%26%20Ireland%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                        "feedName": "Enterprise Tech - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                                "name": "Enterprise Tech - UK & Ireland",
                                "id": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20UK%20%26%20Ireland%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "LPLZvdqBegariMjX-lJYV9f6yU0yDgEQBApU5WYrTYQ",
                        "feedName": "SaaS - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "LPLZvdqBegariMjX-lJYV9f6yU0yDgEQBApU5WYrTYQ",
                                "name": "SaaS - UK & Ireland",
                                "id": "LPLZvdqBegariMjX-lJYV9f6yU0yDgEQBApU5WYrTYQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "SaaS - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "LPLZvdqBegariMjX-lJYV9f6yU0yDgEQBApU5WYrTYQ"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                        "feedName": "Vulnerability Assessment",
                        "fullPathList": [
                            {
                                "tracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "name": "Vulnerability Assessment",
                                "id": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Vulnerability Assessment>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                        "feedName": "Enterprise Tech - UK",
                        "fullPathList": [
                            {
                                "tracxnId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                                "name": "Enterprise Tech - UK",
                                "id": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - UK>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4"
                    },
                    {
                        "description": "Companies that provide a unified application security solutions",
                        "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "name": "Unified Application Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DHiTech%20-%20UK%20%26%20Ireland%7CbusinessModel%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DHiTech%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D61110da198d5b50e6ea24952%3AUnified%20Application%20Security",
                        "feedId": "QBCEygz6dTOpbkd92nIzONZKTa3nlNoEONa0ZJmBIQo",
                        "feedName": "HiTech - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "QBCEygz6dTOpbkd92nIzONZKTa3nlNoEONa0ZJmBIQo",
                                "name": "HiTech - UK & Ireland",
                                "id": "QBCEygz6dTOpbkd92nIzONZKTa3nlNoEONa0ZJmBIQo",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide a unified application security solutions",
                                "id": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                                "name": "Unified Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                            }
                        ],
                        "fullPathString": "HiTech - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>Unified Application Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E",
                        "feedTracxnId": "QBCEygz6dTOpbkd92nIzONZKTa3nlNoEONa0ZJmBIQo"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "EsOIBnrZZcMqwARDVeKamznjhUlIABpU9sGMGuRAr1M",
                        "name": "UK & Ireland Tech",
                        "tracxnId": "EsOIBnrZZcMqwARDVeKamznjhUlIABpU9sGMGuRAr1M"
                    },
                    {
                        "id": "wW4jE0j0WYFhkFEZ-Wt-HTAPlxJqHllxNCG7m0jD0kc",
                        "name": "Europe Tech",
                        "tracxnId": "wW4jE0j0WYFhkFEZ-Wt-HTAPlxJqHllxNCG7m0jD0kc"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "KQOFHQ4hv8-lXsxYoB9oRztgd5269dd_1lVd6U4lgKg",
                        "name": "Trending Themes in DevOps",
                        "tracxnId": "KQOFHQ4hv8-lXsxYoB9oRztgd5269dd_1lVd6U4lgKg"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "bcVJ_7m9jnHno4dY5_NKEGAV9scErBNR2GcBEqV99RQ",
                        "name": "UK Tech",
                        "tracxnId": "bcVJ_7m9jnHno4dY5_NKEGAV9scErBNR2GcBEqV99RQ"
                    },
                    {
                        "id": "qJnuc8DG2oZshiKA6WlnPpUx8dfG1PKWOzMVIovr8sU",
                        "name": "Euro Tech",
                        "tracxnId": "qJnuc8DG2oZshiKA6WlnPpUx8dfG1PKWOzMVIovr8sU"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    }
                ],
                "description": {
                    "long": "Provider of application security solutions. It is a cybersecurity company that leverages artificial intelligence to streamline software security and simplify the process of managing and securing code. It enables developers to identify vulnerabilities and ensure the integrity of the applications. It offers a field of application security that gives cost-effective approach to SDLC vulnerability reduction.",
                    "short": "Provider of application security solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "linkedIn": "http://linkedin.com/company/aquilax-ai",
                    "twitter": "https://twitter.com/aquilaxsecurity"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://aquilax.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United Kingdom"
                        },
                        "state": {
                            "name": "England"
                        },
                        "city": {
                            "name": "London"
                        },
                        "continent": {
                            "name": "Europe"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/aquilax_ai_28221e26-5eda-4fc4-b1f8-1db43d8a0106"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "os8Qd2i7eu_R0J8SWfeW_gltNm59XRQ3c4M_w6_9qqI",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Application Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                        },
                        {
                            "name": "Vulnerability Assessment",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                        },
                        {
                            "name": "Unified Application Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "wHHguCZV8FOlNUaNygnX00lftwq_reMWYzUPZiqUG9E"
                        }
                    ]
                ],
                "companyId": "6726605d5397561e66dca2c5"
            },
            {
                "foundedYear": 2024,
                "id": "Q7QWcFzQpSthKsO-d5-1QpO2PJCnQ4lCqM5scgyJXBQ",
                "name": "Cert-IX.",
                "domain": "cert-ix.com",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "aqVIwlrak-1PMTI93NPgQDytPh1t4m5M8u8fFuh8oEg",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "city": "San Francisco",
                    "cityGroup": [
                        "Bay Area"
                    ],
                    "state": "California",
                    "id": "aqVIwlrak-1PMTI93NPgQDytPh1t4m5M8u8fFuh8oEg"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/Q7QWcFzQpSthKsO-d5-1QpO2PJCnQ4lCqM5scgyJXBQ/cert-ix.com",
                "businessModelList": [
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                        "feedName": "Data Security",
                        "fullPathList": [
                            {
                                "tracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "name": "Data Security",
                                "id": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Data Security>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20Model%20Security%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20Model%20Security%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                        "feedName": "AI Model Security",
                        "fullPathList": [
                            {
                                "tracxnId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                                "name": "AI Model Security",
                                "id": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "AI Model Security>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "vq9bCIEzH4qZg5rR25LKHXM_cGl46DParfGN_fILz-Y"
                    },
                    {
                        "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                        "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "name": "AI Model Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModel%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModelId%3D6114a7dcf0aa330e4b947470%3AAI%20Model%20Security",
                        "feedId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                        "feedName": "Enterprise Tech - California",
                        "fullPathList": [
                            {
                                "tracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "name": "Enterprise Tech - California",
                                "id": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide a security solution for AI and ML data and models from adversarial attacks",
                                "id": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                                "name": "AI Model Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - California>Cybersecurity>Data Security>AI Model Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY",
                        "feedTracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8",
                        "name": "Trending Themes in Enterprise Information Management",
                        "tracxnId": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8"
                    },
                    {
                        "id": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc",
                        "name": "Trending Themes in GRC Software",
                        "tracxnId": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E",
                        "name": "California Tech",
                        "tracxnId": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E"
                    }
                ],
                "description": {
                    "long": "Provider of AI powered security solutions. It is a cybersecurity and insurance platform providing AI-powered protection and comprehensive security solutions for businesses. It offers a scanning tools to identify and assess security vulnerabilities across the infrastructure. It also provides an identity and access management with multi-factor authentication.",
                    "short": "Provider of AI powered security solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://cert-ix.com"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "California"
                        },
                        "city": {
                            "name": "San Francisco"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/cert-ix_com_ec561838-6a5e-4bcf-9184-38c2f8dfb366"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29,
                        "hours": 18,
                        "minutes": 58,
                        "seconds": 30
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "Q7QWcFzQpSthKsO-d5-1QpO2PJCnQ4lCqM5scgyJXBQ",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Data Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                        },
                        {
                            "name": "AI Model Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "FHPoo-vk9yefthp_kdpphATpMDOL3QFPlBZfUFwPozY"
                        }
                    ]
                ],
                "companyId": "6722744f0ac03c3c58c34c8a"
            },
            {
                "foundedYear": 2021,
                "id": "loxqqEYlta-DI2DPUGmwtgDp2XWGwYAPox2F0unmFuk",
                "name": "Securade",
                "domain": "securade.co.za",
                "location": {
                    "continent": "Africa",
                    "country": "South Africa",
                    "tracxnId": "fsWLU5aA3mqSCleNKU1W8YITSkijJaK1Ct_lcc7wNgI",
                    "countryGroup": [
                        "Africa",
                        "Sub-Saharan Africa",
                        "Southern Africa"
                    ],
                    "id": "fsWLU5aA3mqSCleNKU1W8YITSkijJaK1Ct_lcc7wNgI"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/loxqqEYlta-DI2DPUGmwtgDp2XWGwYAPox2F0unmFuk/securade.co.za",
                "businessModelList": [
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                        "feedName": "Vulnerability Assessment",
                        "fullPathList": [
                            {
                                "tracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "name": "Vulnerability Assessment",
                                "id": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "Vulnerability Assessment>Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw"
                    },
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Africa%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Africa%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "r4SaqcdJWjSTvLsDK3UUwOELC_EVX6mDqOoQfKQWNGw",
                        "feedName": "Enterprise Tech - Africa",
                        "fullPathList": [
                            {
                                "tracxnId": "r4SaqcdJWjSTvLsDK3UUwOELC_EVX6mDqOoQfKQWNGw",
                                "name": "Enterprise Tech - Africa",
                                "id": "r4SaqcdJWjSTvLsDK3UUwOELC_EVX6mDqOoQfKQWNGw",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Africa>Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "r4SaqcdJWjSTvLsDK3UUwOELC_EVX6mDqOoQfKQWNGw"
                    },
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSecurity%20Analytics%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSecurity%20Analytics%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "lPeE3HE1mvU2wt_BAYdtHWuBGWqoCLjKPDMYxGRPRUY",
                        "feedName": "Security Analytics",
                        "fullPathList": [
                            {
                                "tracxnId": "lPeE3HE1mvU2wt_BAYdtHWuBGWqoCLjKPDMYxGRPRUY",
                                "name": "Security Analytics",
                                "id": "lPeE3HE1mvU2wt_BAYdtHWuBGWqoCLjKPDMYxGRPRUY",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "Security Analytics>Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "lPeE3HE1mvU2wt_BAYdtHWuBGWqoCLjKPDMYxGRPRUY"
                    },
                    {
                        "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                        "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "name": "Cyber Risk & Vulnerability Assessment",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D566085cfe4b031f08d379f2b%3ACyber%20Risk%20%26%20Vulnerability%20Assessment",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Analytics of security information, event & system for threat prevention, detection, mitigation across enterprise",
                                "id": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ",
                                "name": "Security Analytics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                            },
                            {
                                "description": "Companies that provide a assessment and management of the enterprise-wide cyber-risk and vulnerabilities present",
                                "id": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                                "name": "Cyber Risk & Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Security Analytics>Cyber Risk & Vulnerability Assessment",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "593Qt24CRii5TPXyhGuqS36Ikgkt8RgMZe6_gz40n0k",
                        "name": "Africa Tech",
                        "tracxnId": "593Qt24CRii5TPXyhGuqS36Ikgkt8RgMZe6_gz40n0k"
                    }
                ],
                "description": {
                    "long": "Provider of cyber risk and vulnerability assessment solutions. The company provides a range of security solutions and services, including GPS tracking systems, security personnel, bollards, consultancy, and training, targeting various industries and markets.",
                    "short": "Provider of cyber risk and vulnerability assessment solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "facebook": "http://facebook.com/securade"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://securade.co.za"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "South Africa"
                        },
                        "continent": {
                            "name": "Africa"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/securade_co_za_b47c354d-5ec6-490d-b4e8-8504d8475cc9"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29,
                        "hours": 16,
                        "minutes": 24,
                        "seconds": 13
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "loxqqEYlta-DI2DPUGmwtgDp2XWGwYAPox2F0unmFuk",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Security Analytics",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "3GOSCGC4cZ3BAKj_48K8qqCFl6V4N8727Ls1X8UlFuQ"
                        },
                        {
                            "name": "Cyber Risk & Vulnerability Assessment",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "XjnOVEyVLY42p010vH-fFRfMR3yf6affAISxmrqa_fo"
                        }
                    ]
                ],
                "companyId": "671e8e63666bee3579c51212"
            },
            {
                "foundedYear": 2024,
                "id": "JyoyMX3DmwrUayH0K7wPxHjYsv9qPQLbPcFcQ9X1wGk",
                "name": "Fortiminds",
                "domain": "fortiminds.com",
                "location": {
                    "continent": "Europe",
                    "country": "United Kingdom",
                    "tracxnId": "bC8STLxoBSef7nHgH1TsG8j0MRHRXV51WhW3ao7V7N8",
                    "countryGroup": [
                        "Europe",
                        "Western Europe",
                        "UK & Ireland",
                        "Euro"
                    ],
                    "state": "England",
                    "id": "bC8STLxoBSef7nHgH1TsG8j0MRHRXV51WhW3ao7V7N8"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/JyoyMX3DmwrUayH0K7wPxHjYsv9qPQLbPcFcQ9X1wGk/fortiminds.com",
                "businessModelList": [
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%20%26%20Ireland%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                        "feedName": "Artificial Intelligence - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                                "name": "Artificial Intelligence - UK & Ireland",
                                "id": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "8xy05L3XYTRQ0AwsUDH2QNhKDV95xNKBFEKywofXsl4"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Europe%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Europe%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                        "feedName": "Enterprise Tech - Europe",
                        "fullPathList": [
                            {
                                "tracxnId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                                "name": "Enterprise Tech - Europe",
                                "id": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Europe>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "QtBE4PAY0CQ5CCZFLST-jboU2HkTEViTTv6v8pUrrdI"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DDevSecOps%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DDevSecOps%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                        "feedName": "DevSecOps",
                        "fullPathList": [
                            {
                                "tracxnId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                                "name": "DevSecOps",
                                "id": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "DevSecOps>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "ZU3a1WKtLr2utFv7mWPfyM6ft2I8kGfnUtnBNOfjk2U"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20UK%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                        "feedName": "Artificial Intelligence - UK",
                        "fullPathList": [
                            {
                                "tracxnId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                                "name": "Artificial Intelligence - UK",
                                "id": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - UK>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "AJtVbUIpzu6qTFKiEQFQlsqcrhCDv47r8e5CVaZ2f5A"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Euro%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20Euro%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                        "feedName": "Enterprise Tech - Euro",
                        "fullPathList": [
                            {
                                "tracxnId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                                "name": "Enterprise Tech - Euro",
                                "id": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - Euro>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "mWkgckcY5WmrEUybJNLoU6slH5c3TOZQsOkBH_U7z_A"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20Europe%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20Europe%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                        "feedName": "Artificial Intelligence - Europe",
                        "fullPathList": [
                            {
                                "tracxnId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                                "name": "Artificial Intelligence - Europe",
                                "id": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - Europe>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "SqAPVwX7dWR8Zdoli-fSU_HqGqm4fTDIcbeTupi1dUQ"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%20%26%20Ireland%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%20%26%20Ireland%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                        "feedName": "Enterprise Tech - UK & Ireland",
                        "fullPathList": [
                            {
                                "tracxnId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                                "name": "Enterprise Tech - UK & Ireland",
                                "id": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - UK & Ireland>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "pBPKTQCTAikT89Wa1UZi1kuYG_v0Cf_D5yQd1LrSR5I"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DVulnerability%20Assessment%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                        "feedName": "Vulnerability Assessment",
                        "fullPathList": [
                            {
                                "tracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "name": "Vulnerability Assessment",
                                "id": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Vulnerability Assessment>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "4NI6Hd6rQm69m92PUvvNpvtHbQEhl7XJNwsSNyJBNIw"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide Application security posture management (ASPM) platform",
                        "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "name": "ASPM",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%7CbusinessModel%3D633ea53a868d961c31124591%3AASPM",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20UK%7CbusinessModelId%3D633ea53a868d961c31124591%3AASPM",
                        "feedId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                        "feedName": "Enterprise Tech - UK",
                        "fullPathList": [
                            {
                                "tracxnId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                                "name": "Enterprise Tech - UK",
                                "id": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Application security testing, vulnerability assessment & runtime application protection",
                                "id": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg",
                                "name": "Application Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                            },
                            {
                                "description": "Companies that provide a vulnerability assessment platform for application modules, libraries & code",
                                "id": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw",
                                "name": "Vulnerability Assessment",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                            },
                            {
                                "description": "Companies that provide Application security posture management (ASPM) platform",
                                "id": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                                "name": "ASPM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - UK>Cybersecurity>Application Security>Vulnerability Assessment>ASPM",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY",
                        "feedTracxnId": "Op020NMckAFxYAgHBl3QpbqmWRFR4_mYp1jUVQYnjc4"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "EsOIBnrZZcMqwARDVeKamznjhUlIABpU9sGMGuRAr1M",
                        "name": "UK & Ireland Tech",
                        "tracxnId": "EsOIBnrZZcMqwARDVeKamznjhUlIABpU9sGMGuRAr1M"
                    },
                    {
                        "id": "wW4jE0j0WYFhkFEZ-Wt-HTAPlxJqHllxNCG7m0jD0kc",
                        "name": "Europe Tech",
                        "tracxnId": "wW4jE0j0WYFhkFEZ-Wt-HTAPlxJqHllxNCG7m0jD0kc"
                    },
                    {
                        "id": "KQOFHQ4hv8-lXsxYoB9oRztgd5269dd_1lVd6U4lgKg",
                        "name": "Trending Themes in DevOps",
                        "tracxnId": "KQOFHQ4hv8-lXsxYoB9oRztgd5269dd_1lVd6U4lgKg"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "bcVJ_7m9jnHno4dY5_NKEGAV9scErBNR2GcBEqV99RQ",
                        "name": "UK Tech",
                        "tracxnId": "bcVJ_7m9jnHno4dY5_NKEGAV9scErBNR2GcBEqV99RQ"
                    },
                    {
                        "id": "qJnuc8DG2oZshiKA6WlnPpUx8dfG1PKWOzMVIovr8sU",
                        "name": "Euro Tech",
                        "tracxnId": "qJnuc8DG2oZshiKA6WlnPpUx8dfG1PKWOzMVIovr8sU"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "Provider of AI powered application security posture management platform. It offers risk assessment and mitigation solutions for businesses, providing evaluation strategies for continuous monitoring. The platform utilizes artificial intelligence to analyze data and identify potential risks, enabling organizations to proactively manage and mitigate threats.",
                    "short": "Provider of AI powered application security posture management platform"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://fortiminds.com"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United Kingdom"
                        },
                        "state": {
                            "name": "England"
                        },
                        "continent": {
                            "name": "Europe"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/fortiminds_com_39a0bfab-e189-427a-b01c-e4e26d4c3dba"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28,
                        "hours": 22,
                        "minutes": 14,
                        "seconds": 11
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "JyoyMX3DmwrUayH0K7wPxHjYsv9qPQLbPcFcQ9X1wGk",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Application Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ioaaAiqh6hq9WOY0iKa4gavdMQVI0cHO40ID_pLzCZg"
                        },
                        {
                            "name": "Vulnerability Assessment",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "gvtX8bWeUNNczRdI_xY2gEBRMb7PAEmC8vAXoEEicsw"
                        },
                        {
                            "name": "ASPM",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "3xXlGe2ACbcbbJfe47LuvUBFniICmEaouGOLCSzUUEY"
                        }
                    ]
                ],
                "companyId": "671d2fcee56f636f4985e98f"
            },
            {
                "foundedYear": 2020,
                "id": "zoUQPJWsjsoKybUSPm4CR--01ayaGASa8Jg41lN802c",
                "name": "Com-Sec",
                "domain": "com-sec.io",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "Segy3nof62kHy-MIPVYhyNEVGQV9x_1ezxt2mAJbmeo",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "stateGroup": [
                        "US East Coast"
                    ],
                    "city": "Rockville",
                    "state": "Maryland",
                    "id": "Segy3nof62kHy-MIPVYhyNEVGQV9x_1ezxt2mAJbmeo"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/zoUQPJWsjsoKybUSPm4CR--01ayaGASa8Jg41lN802c/com-sec.io",
                "businessModelList": [
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                        "feedName": "SaaS - US",
                        "fullPathList": [
                            {
                                "tracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "name": "SaaS - US",
                                "id": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "SaaS - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    }
                ],
                "description": {
                    "long": "Provider of cybersecurity suite solutions. It is a cybersecurity consultancy that provides solutions to protect businesses from IT security threats. It offers consultancy and advisory services to startups and other organizations. It expertise lies in simplifying IT security and compliance, helps clients ensure the security and integrity of the operations.",
                    "short": "Provider of cybersecurity suite solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "linkedIn": "http://linkedin.com/company/com-sec/"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 29
                    },
                    "url": "https://com-sec.io"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "Maryland"
                        },
                        "city": {
                            "name": "Rockville"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/com-sec_io_515fd039-801a-46b1-89e2-9743f2f9f69c"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28,
                        "hours": 21,
                        "minutes": 26,
                        "seconds": 46
                    }
                },
                "tracxnId": "zoUQPJWsjsoKybUSPm4CR--01ayaGASa8Jg41lN802c",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Suite",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                        }
                    ]
                ],
                "companyId": "671c2af1ab60e20da10e7447"
            },
            {
                "foundedYear": 2023,
                "id": "cr6A9k4x9r7TFWk0h3sysmmhRbrmAqMYBzNvP4FwIfs",
                "name": "BeyondThreat",
                "domain": "beyondthreat.ai",
                "tracxnUrl": "https://platform.tracxn.com/companies/cr6A9k4x9r7TFWk0h3sysmmhRbrmAqMYBzNvP4FwIfs/beyondthreat.ai",
                "businessModelList": [
                    {
                        "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                        "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "name": "Compromised Credential Monitoring",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Actionable, processed, aggregated, relevant & evidence-based knowledge of existing & new threats & vulnerabilities",
                                "id": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU",
                                "name": "Threat Intelligence",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                            },
                            {
                                "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                                "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                                "name": "Compromised Credential Monitoring",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Threat Intelligence>Compromised Credential Monitoring",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                        "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "name": "Compromised Credential Monitoring",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Actionable, processed, aggregated, relevant & evidence-based knowledge of existing & new threats & vulnerabilities",
                                "id": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU",
                                "name": "Threat Intelligence",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                            },
                            {
                                "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                                "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                                "name": "Compromised Credential Monitoring",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Threat Intelligence>Compromised Credential Monitoring",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                        "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "name": "Compromised Credential Monitoring",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Actionable, processed, aggregated, relevant & evidence-based knowledge of existing & new threats & vulnerabilities",
                                "id": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU",
                                "name": "Threat Intelligence",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                            },
                            {
                                "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                                "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                                "name": "Compromised Credential Monitoring",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Threat Intelligence>Compromised Credential Monitoring",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                        "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "name": "Compromised Credential Monitoring",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Actionable, processed, aggregated, relevant & evidence-based knowledge of existing & new threats & vulnerabilities",
                                "id": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU",
                                "name": "Threat Intelligence",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                            },
                            {
                                "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                                "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                                "name": "Compromised Credential Monitoring",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Threat Intelligence>Compromised Credential Monitoring",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                        "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "name": "Compromised Credential Monitoring",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D5959fe504f0cffd453af778d%3ACompromised%20Credential%20Monitoring",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Actionable, processed, aggregated, relevant & evidence-based knowledge of existing & new threats & vulnerabilities",
                                "id": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU",
                                "name": "Threat Intelligence",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                            },
                            {
                                "description": "Companies that provide a real-time monitoring and lookup for the compromised credentials",
                                "id": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                                "name": "Compromised Credential Monitoring",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Threat Intelligence>Compromised Credential Monitoring",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    }
                ],
                "description": {
                    "long": "Provider of cyber risk and vulnerability assessment solutions. It is an AI-powered platform that helps enterprise risk management by leveraging data driven insights to calculate complex cyber risk assessments. The platform eliminates manual assessments, providing comprehensive risk visibility and actionable intelligence for CIOs and CISOs.",
                    "short": "Provider of cyber risk and vulnerability assessment solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "linkedIn": "http://linkedin.com/company/beyondthreat/"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://beyondthreat.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/beyondthreat_ai_ff9075b3-319a-4522-9cf2-90aebf52c18a"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28,
                        "hours": 16,
                        "minutes": 2,
                        "seconds": 13
                    }
                },
                "tracxnId": "cr6A9k4x9r7TFWk0h3sysmmhRbrmAqMYBzNvP4FwIfs",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Threat Intelligence",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "BYWm80ijthFo_wjjaD4QE1BGoRVgQqqMlV7Liq_QWpU"
                        },
                        {
                            "name": "Compromised Credential Monitoring",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "iVyS_Xa8lwr_rfVm8tKbKf2m5EN5H5uM8zkQCgUnfew"
                        }
                    ]
                ],
                "companyId": "671541ac8428ec44085487a3"
            },
            {
                "foundedYear": 2023,
                "id": "k_vM5daoihMItciUA4MFFzm3YCQUGKDMBAYr5jHRi_E",
                "name": "CyberContext",
                "domain": "cybercontext.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "Segy3nof62kHy-MIPVYhyKm4oErOuhcn921MgNreoVc",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "city": "Columbus",
                    "state": "Ohio",
                    "id": "Segy3nof62kHy-MIPVYhyKm4oErOuhcn921MgNreoVc"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/k_vM5daoihMItciUA4MFFzm3YCQUGKDMBAYr5jHRi_E/cybercontext.ai",
                "totalMoneyRaised": {
                    "totalAmount": {
                        "amount": 100000,
                        "currency": "USD"
                    }
                },
                "businessModelList": [
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                        "feedName": "Data Security",
                        "fullPathList": [
                            {
                                "tracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "name": "Data Security",
                                "id": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Data Security>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Privacy%20Software%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Privacy%20Software%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "L_7K3JaSdUKxw_3JkQd2hUCatVqjX12QwMJCeyspch4",
                        "feedName": "Data Privacy Software",
                        "fullPathList": [
                            {
                                "tracxnId": "L_7K3JaSdUKxw_3JkQd2hUCatVqjX12QwMJCeyspch4",
                                "name": "Data Privacy Software",
                                "id": "L_7K3JaSdUKxw_3JkQd2hUCatVqjX12QwMJCeyspch4",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Data Privacy Software>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "L_7K3JaSdUKxw_3JkQd2hUCatVqjX12QwMJCeyspch4"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                        "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "name": "Data Privacy",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D5dca8d78977ce80dfd497408%3AData%20Privacy",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies offering tools to protect customers sensitive personal information and adhere to the regulatory bodies",
                                "id": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                                "name": "Data Privacy",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Data Security>Data Privacy",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8",
                        "name": "Trending Themes in Enterprise Information Management",
                        "tracxnId": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8"
                    },
                    {
                        "id": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc",
                        "name": "Trending Themes in GRC Software",
                        "tracxnId": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc"
                    },
                    {
                        "id": "YOHxC5Zp7a09U9T1jxzXM2tUekDZAtKWOgCYLeV08_k",
                        "name": "Trending Themes in RegTech",
                        "tracxnId": "YOHxC5Zp7a09U9T1jxzXM2tUekDZAtKWOgCYLeV08_k"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    }
                ],
                "description": {
                    "long": "Provider of AI powered data privacy solutions. It is a provider of AI-powered mapping and automation services. The platform utilizes artificial intelligence to enhance cybersecurity and data privacy compliance. It also navigates, leverages, and reuses knowledge resident in internal documentation including semantic similarity data and entity relationships.",
                    "short": "Provider of AI powered data privacy solutions"
                },
                "stageDetails": {
                    "isFunded": true,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Seed",
                "fundingInfo": {
                    "numberOfFundingRounds": 1,
                    "fundingRoundList": [
                        {
                            "id": "j5q9804zT1mPNZZ55NY6rnERD53JM6BGyiKcKyOwxeI",
                            "amount": {
                                "amount": 100000.0,
                                "currency": "USD"
                            },
                            "date": {
                                "day": 19,
                                "month": 9,
                                "year": 2024
                            },
                            "name": "Seed",
                            "tracxnId": "j5q9804zT1mPNZZ55NY6rnERD53JM6BGyiKcKyOwxeI"
                        }
                    ],
                    "latestRoundInfo": {
                        "id": "6712409f51a60f18bd11a9af",
                        "linkList": [
                            {
                                "isVisibleToExternal": true,
                                "url": "https://www.sec.gov/Archives/edgar/data/2041033/000204103324000001/xslFormDX01/primary_doc.xml"
                            },
                            {
                                "isVisibleToExternal": true,
                                "url": "https://www.sec.gov/Archives/edgar/data/2041033/000204103324000002/xslFormDX01/primary_doc.xml"
                            },
                            {
                                "isVisibleToExternal": true,
                                "url": "https://www.sec.gov/Archives/edgar/data/2041033/000204103324000003/xslFormDX01/primary_doc.xml"
                            }
                        ],
                        "amount": {
                            "amount": 100000.0,
                            "currency": "USD"
                        },
                        "date": {
                            "day": 19,
                            "month": 9,
                            "year": 2024
                        },
                        "name": "Seed",
                        "tracxnId": "j5q9804zT1mPNZZ55NY6rnERD53JM6BGyiKcKyOwxeI"
                    }
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://www.cybercontext.ai/"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "Ohio"
                        },
                        "city": {
                            "name": "Columbus"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/cybercontext_ai_af38de3a-83fa-47c1-8788-cbb55b9fdb95"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 11.831170093443339,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "NO"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 27,
                        "hours": 18,
                        "minutes": 46,
                        "seconds": 22
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "k_vM5daoihMItciUA4MFFzm3YCQUGKDMBAYr5jHRi_E",
                "tracxnSizeScore": 14.788962616804174,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Data Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                        },
                        {
                            "name": "Data Privacy",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "PJw-_iBrQjNDHZdEOFoXHkqXZ_JyzcXC41zYsCtTBU4"
                        }
                    ]
                ],
                "companyId": "67124014654b353e55f1cc3f"
            },
            {
                "id": "yXK7m2AZY4Oelh2LHVukn73IW6vNDfUP6r4pGJG8qJM",
                "name": "Faceverify.ai",
                "domain": "faceverify.ai",
                "tracxnUrl": "https://platform.tracxn.com/companies/yXK7m2AZY4Oelh2LHVukn73IW6vNDfUP6r4pGJG8qJM/faceverify.ai",
                "businessModelList": [
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DBiometric%20Authentication%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DBiometric%20Authentication%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "F1p2KpIAWvi9fhFZJ4HhL8fQe8vNgcWGr3FlraHV5bI",
                        "feedName": "Biometric Authentication",
                        "fullPathList": [
                            {
                                "tracxnId": "F1p2KpIAWvi9fhFZJ4HhL8fQe8vNgcWGr3FlraHV5bI",
                                "name": "Biometric Authentication",
                                "id": "F1p2KpIAWvi9fhFZJ4HhL8fQe8vNgcWGr3FlraHV5bI",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Biometric Authentication>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "F1p2KpIAWvi9fhFZJ4HhL8fQe8vNgcWGr3FlraHV5bI"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Access%20Management%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20Access%20Management%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                        "feedName": "Identity Access Management",
                        "fullPathList": [
                            {
                                "tracxnId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                                "name": "Identity Access Management",
                                "id": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Identity Access Management>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "PPnngB2VsydirrE9zH9VW2l2ZT-ZH_FPgMoSq-lRFvI"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide face-based identification and authentication platform",
                        "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "name": "Facial Biometrics",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20as%20a%20Service%7CbusinessModel%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DIdentity%20as%20a%20Service%7CbusinessModelId%3D61d808362a1aff3a932ea6da%3AFacial%20Biometrics",
                        "feedId": "AmE0WDux7Q-nJU8XohMiHBcM2o1L7aoc9yeMJjGHhME",
                        "feedName": "Identity as a Service",
                        "fullPathList": [
                            {
                                "tracxnId": "AmE0WDux7Q-nJU8XohMiHBcM2o1L7aoc9yeMJjGHhME",
                                "name": "Identity as a Service",
                                "id": "AmE0WDux7Q-nJU8XohMiHBcM2o1L7aoc9yeMJjGHhME",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Identity & Access Management (IAM) solution for the user login, authentication and authorization",
                                "id": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js",
                                "name": "IAM",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                            },
                            {
                                "description": "Companies that provide a biometrics-based IAM solution",
                                "id": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY",
                                "name": "Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                            },
                            {
                                "description": "Companies that provide an authentication platform based on innate human features like a fingerprint, iris pattern etc.",
                                "id": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E",
                                "name": "Physiological",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                            },
                            {
                                "description": "Companies that provide face-based identification and authentication platform",
                                "id": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                                "name": "Facial Biometrics",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                            }
                        ],
                        "fullPathString": "Identity as a Service>Cybersecurity>IAM>Biometrics>Physiological>Facial Biometrics",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20",
                        "feedTracxnId": "AmE0WDux7Q-nJU8XohMiHBcM2o1L7aoc9yeMJjGHhME"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    }
                ],
                "description": {
                    "long": "Provider of identity verification platform. It leverages AI and machine learning to provide accurate and secure identity verification solutions for businesses and software. The platform uses facial recognition technology to verify identities, that ensures accuracy and reducing the risk of fraud.",
                    "short": "Provider of identity verification platform"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://faceverify.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/faceverify_ai_1263e4c6-d6f1-44b4-866d-afaa4a795b39"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 27,
                        "hours": 19,
                        "minutes": 20,
                        "seconds": 41
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "yXK7m2AZY4Oelh2LHVukn73IW6vNDfUP6r4pGJG8qJM",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "IAM",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "6nkz_poa3IeueJnPx-RNftmCnq-sPijHdqbKUepC_Js"
                        },
                        {
                            "name": "Biometrics",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "I8a9-XzSsA07A7pyuZIT07fEDKX88RxkOAcK9T4C_FY"
                        },
                        {
                            "name": "Physiological",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "85GkYjM1DDTA_0R2gMAuvfXEGwnsYK3hvJvkj2W6P1E"
                        },
                        {
                            "name": "Facial Biometrics",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Mb3OkUnNhoZ-AWVD5INnJJAQ74QPv3iKVdsBrXdmG20"
                        }
                    ]
                ],
                "companyId": "6711491f01cbce542571f6c3"
            },
            {
                "foundedYear": 2024,
                "id": "u7mwEBbXm3D7KcfvIzEfTNYn6503FfQG-8a1915w3ME",
                "name": "Stenio Agency",
                "domain": "stenioagency.com",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "Segy3nof62kHy-MIPVYhyNRwul1997qtvQjxlNLJP64",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "city": "Los Angeles",
                    "state": "California",
                    "id": "Segy3nof62kHy-MIPVYhyNRwul1997qtvQjxlNLJP64"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/u7mwEBbXm3D7KcfvIzEfTNYn6503FfQG-8a1915w3ME/stenioagency.com",
                "businessModelList": [
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                        "feedName": "SaaS - US",
                        "fullPathList": [
                            {
                                "tracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "name": "SaaS - US",
                                "id": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "SaaS - US>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DData%20Security%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                        "feedName": "Data Security",
                        "fullPathList": [
                            {
                                "tracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "name": "Data Security",
                                "id": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Data Security>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "p-x5QnYH4T_FZVXYDRdCRyB7E6OQrJ7yNrMGcH9iC7A"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies that provide security of data stored or moving through cloud-based storage",
                        "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "name": "Cloud Data Security",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModel%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModelId%3D575ab8f7e4b0cb636486739f%3ACloud%20Data%20Security",
                        "feedId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                        "feedName": "Enterprise Tech - California",
                        "fullPathList": [
                            {
                                "tracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "name": "Enterprise Tech - California",
                                "id": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies that provide a solution for the protection of data at rest, in use & in-transit from unauthorized access & modification",
                                "id": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA",
                                "name": "Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                            },
                            {
                                "description": "Companies that provide security of data stored or moving through cloud-based storage",
                                "id": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                                "name": "Cloud Data Security",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - California>Cybersecurity>Data Security>Cloud Data Security",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA",
                        "feedTracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8",
                        "name": "Trending Themes in Enterprise Information Management",
                        "tracxnId": "JPilzz_I9-GudEdw-CVs-v1i2iv8qYIaVU2p3rGvUu8"
                    },
                    {
                        "id": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc",
                        "name": "Trending Themes in GRC Software",
                        "tracxnId": "deMb4ZNVlT3uSrcYEGTIfUFQJ5c9TEaHfS0EIELwFVc"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    },
                    {
                        "id": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E",
                        "name": "California Tech",
                        "tracxnId": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E"
                    }
                ],
                "description": {
                    "long": "Provider of data security solutions. It offers comprehensive cybersecurity and analytics solutions to empower businesses, provides protection, security, analytics, and data analysis, the agency delivers tailored services to mitigate threats, improve defenses, and enhance business resilience.",
                    "short": "Provider of data security solutions"
                },
                "emailList": [
                    {
                        "email": "support@stenioagency.com"
                    }
                ],
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "CEO",
                            "id": "8S2J00wd3RtIIgfpKeSww1ZAs6aSrCZ4-oHot0ln-6c",
                            "name": "Billy Vasquez",
                            "isKeyPeople": true,
                            "isFoundingMember": false,
                            "tracxnId": "8S2J00wd3RtIIgfpKeSww1ZAs6aSrCZ4-oHot0ln-6c"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "profileLinks": {
                    "blog": "http://stenioagency.com/company-pages/blog"
                },
                "websiteInfo": {
                    "httpStatus": 404,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://www.stenioagency.com"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "California"
                        },
                        "city": {
                            "name": "Los Angeles"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/stenioagency_com_dd455470-8732-472a-ae78-ad877a01364a"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 27,
                        "hours": 18,
                        "minutes": 41,
                        "seconds": 13
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "u7mwEBbXm3D7KcfvIzEfTNYn6503FfQG-8a1915w3ME",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Data Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ggfLsGxavVwmNv1HL9XozdbsQ2RUkyUhq3oYmaA1xmA"
                        },
                        {
                            "name": "Cloud Data Security",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "yTeAD2hI1E0XkOQ_Cx09RbC27TRUlS_v5tGMxD9UiKA"
                        }
                    ]
                ],
                "companyId": "671007a8d7dd351725dc56bd"
            },
            {
                "foundedYear": 2023,
                "id": "Jq30yNuCxIuQUk3x43BoIVZKsxCbHD088cb4t_S18hc",
                "name": "Cyber Connective",
                "domain": "cyberconnective.ai",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "eGfsfVGHHPaSXXeDc30hBSTZuNpg3SsTyaI0UcF6Xh4",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "city": "Washington",
                    "state": "District of Columbia",
                    "id": "eGfsfVGHHPaSXXeDc30hBSTZuNpg3SsTyaI0UcF6Xh4"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/Jq30yNuCxIuQUk3x43BoIVZKsxCbHD088cb4t_S18hc/cyberconnective.ai",
                "businessModelList": [
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DConsumer%20Digital%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DConsumer%20Digital%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "ONT4e7zkx80c_RFAraqSACZlYa3FmEz_OfwAXLOHaTY",
                        "feedName": "Consumer Digital - US",
                        "fullPathList": [
                            {
                                "tracxnId": "ONT4e7zkx80c_RFAraqSACZlYa3FmEz_OfwAXLOHaTY",
                                "name": "Consumer Digital - US",
                                "id": "ONT4e7zkx80c_RFAraqSACZlYa3FmEz_OfwAXLOHaTY",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Consumer Digital - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "ONT4e7zkx80c_RFAraqSACZlYa3FmEz_OfwAXLOHaTY"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DAI%20in%20Cybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                        "feedName": "AI in Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "name": "AI in Cybersecurity",
                                "id": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "AI in Cybersecurity>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "LcQYU4KIwb4oFiXgl9kMz7hKePB9nxKTmCCc-8KG6-Q"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                        "feedName": "Artificial Intelligence",
                        "fullPathList": [
                            {
                                "tracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "name": "Artificial Intelligence",
                                "id": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D5 - Auto Feeds - Waves",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "uH2tBp5wdkGB8RqKfiwW-xfeyl-J_f1-NTN2pbJZFfQ"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DArtificial%20Intelligence%20-%20US%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                        "feedName": "Artificial Intelligence - US",
                        "fullPathList": [
                            {
                                "tracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "name": "Artificial Intelligence - US",
                                "id": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Artificial Intelligence - US>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "-QxLh1IiIKqLFESIDsFNifbuy5OZf53JH9cGHEqnd4E"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8",
                        "name": "Artificial Intelligence - Industry Applications",
                        "tracxnId": "gu4H43vXQK5EIwZSkvghaRUNZSQqFRVFvePz-BEpkx8"
                    },
                    {
                        "id": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8",
                        "name": "High Tech",
                        "tracxnId": "yKEvMbkhsi5wN50RLaIDLmEwsHyyIYhWe1bpcySZnW8"
                    }
                ],
                "description": {
                    "long": "Provider of cybersecurity suite solutions. The companys AI-powered platform provides a snapshot of an organizations cybersecurity posture, that enables risk management and mitigation.",
                    "short": "Provider of cybersecurity suite solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://cyberconnective.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "District of Columbia"
                        },
                        "city": {
                            "name": "Washington"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/Screenshot_2024-10-28_113024_2bf94641-f093-41d0-9111-39fcb534eb34.png"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "YES"
                    },
                    {
                        "name": "Enterprise",
                        "value": "NO"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "NO"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "YES"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 26,
                        "hours": 16,
                        "minutes": 43,
                        "seconds": 16
                    }
                },
                "tracxnId": "Jq30yNuCxIuQUk3x43BoIVZKsxCbHD088cb4t_S18hc",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Suite",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                        }
                    ]
                ],
                "companyId": "6706ba6f86883a226c9c5956"
            },
            {
                "foundedYear": 2024,
                "id": "NIF8hPfjgb7byEP3PR73QmbMMXZyN5AcSXlLhUKaWJM",
                "name": "CTRL+ALT+DETECT",
                "domain": "cmndctrl.io",
                "location": {
                    "continent": "North America",
                    "country": "United States",
                    "tracxnId": "SVHD_v_re2BBHO4f5bFjv03xrUdP0DeY7Ylh3StNMj8",
                    "countryGroup": [
                        "North America",
                        "US & Canada"
                    ],
                    "city": "Covina",
                    "state": "California",
                    "id": "SVHD_v_re2BBHO4f5bFjv03xrUdP0DeY7Ylh3StNMj8"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/NIF8hPfjgb7byEP3PR73QmbMMXZyN5AcSXlLhUKaWJM/cmndctrl.io",
                "businessModelList": [
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                        "feedName": "SaaS",
                        "fullPathList": [
                            {
                                "tracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "name": "SaaS",
                                "id": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "SaaS>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "WWcdcrOlbRi-2GA3FW1Oy-VGyILhngnI-ev6OFVTYTE"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DSaaS%20-%20US%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                        "feedName": "SaaS - US",
                        "fullPathList": [
                            {
                                "tracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "name": "SaaS - US",
                                "id": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "SaaS - US>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "2_45o5zLDTyeghK_-TWgKeQLy6vaATfd5G1x4T2oy0g"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEndpoint%20Security%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEndpoint%20Security%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "G-aD1-_wRtpZYAcFkBv3n0RZCV5-pnzpfYcExub0qfA",
                        "feedName": "Endpoint Security",
                        "fullPathList": [
                            {
                                "tracxnId": "G-aD1-_wRtpZYAcFkBv3n0RZCV5-pnzpfYcExub0qfA",
                                "name": "Endpoint Security",
                                "id": "G-aD1-_wRtpZYAcFkBv3n0RZCV5-pnzpfYcExub0qfA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Endpoint Security>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "G-aD1-_wRtpZYAcFkBv3n0RZCV5-pnzpfYcExub0qfA"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20US%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                        "feedName": "Enterprise Tech - US",
                        "fullPathList": [
                            {
                                "tracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "name": "Enterprise Tech - US",
                                "id": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - US>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "GrfAcARdOkbOGY5cOKiChGpygzedyisbiD-xq_mSYuk"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DThreat%20Management%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DThreat%20Management%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "OgRFD6OkbGkfREF2jCZuAZD9SdHTEp2YsErar5fr124",
                        "feedName": "Threat Management",
                        "fullPathList": [
                            {
                                "tracxnId": "OgRFD6OkbGkfREF2jCZuAZD9SdHTEp2YsErar5fr124",
                                "name": "Threat Management",
                                "id": "OgRFD6OkbGkfREF2jCZuAZD9SdHTEp2YsErar5fr124",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Threat Management>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D3 - Auto Feeds - Trending Themes",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "OgRFD6OkbGkfREF2jCZuAZD9SdHTEp2YsErar5fr124"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    },
                    {
                        "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                        "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "name": "Cybersecurity Challenges",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModel%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20California%7CbusinessModelId%3D60498f11dbbe360bc650b2f3%3ACybersecurity%20Challenges",
                        "feedId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                        "feedName": "Enterprise Tech - California",
                        "fullPathList": [
                            {
                                "tracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "name": "Enterprise Tech - California",
                                "id": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Companies providing platforms which offer security training",
                                "id": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I",
                                "name": "Cybersecurity Training",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                            },
                            {
                                "description": "Companies offering platforms that provide cybersecurity challenges to improve cybersecurity skills",
                                "id": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                                "name": "Cybersecurity Challenges",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - California>Cybersecurity>Cybersecurity Training>Cybersecurity Challenges",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE",
                        "feedTracxnId": "y6NMsKEU_XCxrXzMTJgCvSU3Bt-s3S_myemeH-IrZvk"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    },
                    {
                        "id": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM",
                        "name": "US Tech",
                        "tracxnId": "mEADiw3yscldyxp3KIjMyi5aH10eGc7kqkp4d_RLTOM"
                    },
                    {
                        "id": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8",
                        "name": "Trending Themes in Cybersecurity",
                        "tracxnId": "59wlsc9V44rskTfK_gnzjZgZnxZwzfvJwwcO7F4_MT8"
                    },
                    {
                        "id": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E",
                        "name": "California Tech",
                        "tracxnId": "lc80crre6Ee8XIjKUzoHJ7yjnvrMbqh_ltjc_ass59E"
                    }
                ],
                "description": {
                    "long": "Provider of incident response solutions. It is a technology company that offers products and services focused on digital forensics, cybersecurity, and electronic music production.",
                    "short": "Provider of incident response solutions"
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://www.cmndctrl.io/"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "United States"
                        },
                        "state": {
                            "name": "California"
                        },
                        "city": {
                            "name": "Covina"
                        },
                        "continent": {
                            "name": "North America"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/Screenshot_2024-12-05_101151_36056d58-e60d-41ef-906b-372a3db0ab51.png"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "YES"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 26,
                        "hours": 16,
                        "minutes": 55,
                        "seconds": 42
                    }
                },
                "achievements": [
                    {
                        "name": "Trending Theme",
                        "category": "Market"
                    }
                ],
                "tracxnId": "NIF8hPfjgb7byEP3PR73QmbMMXZyN5AcSXlLhUKaWJM",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Cybersecurity Training",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "ug2bnHlu6trw_hjGia6-ntkrTWy2aasog5zOkgU8z2I"
                        },
                        {
                            "name": "Cybersecurity Challenges",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "HBKRHhp3GLNl35BQJ3E_Wa8kUC20RWK8zmGD2awzMSE"
                        }
                    ]
                ],
                "companyId": "6706cc26587fc96e7a7dd5a7"
            },
            {
                "foundedYear": 2024,
                "id": "4CEq-ZVXzYx9oc5LfyaC2Zw1rFJGkhJu_BlsQrjQWMs",
                "name": "GRAMAX Cybertech",
                "domain": "gramax.ai",
                "location": {
                    "continent": "Asia",
                    "country": "India",
                    "tracxnId": "Kb4MzYHDICbt4Ux-TBzz12cygkkEjiKFvX53DQMWKb8",
                    "countryGroup": [
                        "South Asia",
                        "Asia",
                        "APAC"
                    ],
                    "city": "Delhi",
                    "state": "Delhi",
                    "id": "Kb4MzYHDICbt4Ux-TBzz12cygkkEjiKFvX53DQMWKb8"
                },
                "tracxnUrl": "https://platform.tracxn.com/companies/4CEq-ZVXzYx9oc5LfyaC2Zw1rFJGkhJu_BlsQrjQWMs/gramax.ai",
                "businessModelList": [
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                        "feedName": "Cybersecurity",
                        "fullPathList": [
                            {
                                "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "name": "Cybersecurity",
                                "id": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg",
                                "type": "FEED"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "A1 - Deep Curation",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20India%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Tech%20-%20India%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "9kYvT7FyrJ1jTKbwFxePVe96NxAY1nOJ4VhU8PjP1hU",
                        "feedName": "Enterprise Tech - India",
                        "fullPathList": [
                            {
                                "tracxnId": "9kYvT7FyrJ1jTKbwFxePVe96NxAY1nOJ4VhU8PjP1hU",
                                "name": "Enterprise Tech - India",
                                "id": "9kYvT7FyrJ1jTKbwFxePVe96NxAY1nOJ4VhU8PjP1hU",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Tech - India>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "9kYvT7FyrJ1jTKbwFxePVe96NxAY1nOJ4VhU8PjP1hU"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%20-%20India%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DCybersecurity%20-%20India%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "ZriHLvUu1ON6WYUM35rMZSV34VkXeKgJ8a69Yw3TGrc",
                        "feedName": "Cybersecurity - India",
                        "fullPathList": [
                            {
                                "tracxnId": "ZriHLvUu1ON6WYUM35rMZSV34VkXeKgJ8a69Yw3TGrc",
                                "name": "Cybersecurity - India",
                                "id": "ZriHLvUu1ON6WYUM35rMZSV34VkXeKgJ8a69Yw3TGrc",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Cybersecurity - India>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D1 - Auto Feeds - Geo",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "ZriHLvUu1ON6WYUM35rMZSV34VkXeKgJ8a69Yw3TGrc"
                    },
                    {
                        "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                        "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "name": "Suite",
                        "companiesInEntireTreeUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModel%3D56607831e4b031f08d379f19%3ASuite",
                        "companiesInNodeOnlyUrl": "https://platform.tracxn.com/query/feedview#%7CfeedName%3DEnterprise%20Software%7CbusinessModelId%3D56607831e4b031f08d379f19%3ASuite",
                        "feedId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                        "feedName": "Enterprise Software",
                        "fullPathList": [
                            {
                                "tracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "name": "Enterprise Software",
                                "id": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA",
                                "type": "FEED"
                            },
                            {
                                "description": "Products and cloud-based service which detect, prevent, protect and respond to the cyber threat and attack on business or government organization.",
                                "id": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k",
                                "name": "Cybersecurity",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "kK63woAfuECf66HvwFBUDiDjomVgL60pCUFgBYMeJ2k"
                            },
                            {
                                "description": "Platform that provide security across enterprise including data, infrastructure, access & employs intelligence & analytics",
                                "id": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                                "name": "Suite",
                                "type": "BUSINESS MODEL",
                                "isVisible": true,
                                "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                            }
                        ],
                        "fullPathString": "Enterprise Software>Cybersecurity>Suite",
                        "companyPublishedStatus": "PUBLISHED",
                        "feedPublishedStatus": "PUBLISHED",
                        "feedCurationType": "D2 - Auto Feeds - Sector",
                        "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM",
                        "feedTracxnId": "8DVaq2goAk-gacbVq1DxfqQQ9l2LlAoQhZTuVYdpCbA"
                    }
                ],
                "practiceAreaList": [
                    {
                        "id": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE",
                        "name": "Enterprise Infrastructure",
                        "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                    },
                    {
                        "id": "t6XOVNV-emRwnz0VlvUiPNxAHF80odIMUUo8vtnQLIM",
                        "name": "India Tech",
                        "tracxnId": "t6XOVNV-emRwnz0VlvUiPNxAHF80odIMUUo8vtnQLIM"
                    },
                    {
                        "id": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ",
                        "name": "Enterprise Applications",
                        "tracxnId": "QOdnoozQ7g9gsJ_Z6biYkavpAYHdRiGR-T_Rxv-7kYQ"
                    }
                ],
                "description": {
                    "long": "Provider of cybersecurity suite solutions. It provides cybersecurity services and solutions to protect enterprises from cyber threats. It offers a range of services and products to help enterprises protect themselves from cyber threats and manage cyber risk.",
                    "short": "Provider of cybersecurity suite solutions"
                },
                "contactNumberList": [
                    {
                        "countryCode": "+91",
                        "number": "1161237225"
                    }
                ],
                "emailList": [
                    {
                        "email": "info.gramax@gmrgroup.in"
                    }
                ],
                "employeeInfo": {
                    "employeeList": [
                        {
                            "designation": "CEO",
                            "id": "vzhvR-RRbN6AMoKT85jNItlsgwphqLW47WIasVYG12k",
                            "name": "Bithal Bhardwaj",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/bithal-bhardwaj-622a523"
                            },
                            "shortBio": "Ex-GE, Satyam Computer Services, Neptune Information Solutions. Savitribai Phule Pune University BE",
                            "isKeyPeople": true,
                            "isFoundingMember": false,
                            "tracxnId": "vzhvR-RRbN6AMoKT85jNItlsgwphqLW47WIasVYG12k"
                        },
                        {
                            "designation": "CEO",
                            "id": "vzhvR-RRbN6AMoKT85jNItlsgwphqLW47WIasVYG12k",
                            "name": "Bithal Bhardwaj",
                            "profileLinks": {
                                "linkedinHandle": "https://linkedin.com/in/bithal-bhardwaj-622a523"
                            },
                            "shortBio": "Ex-GE, Satyam Computer Services, Neptune Information Solutions. Savitribai Phule Pune University BE",
                            "isKeyPeople": true,
                            "isFoundingMember": false,
                            "tracxnId": "vzhvR-RRbN6AMoKT85jNItlsgwphqLW47WIasVYG12k"
                        }
                    ]
                },
                "stageDetails": {
                    "isFunded": false,
                    "isAcquired": false,
                    "isPublic": false,
                    "isDeadpooled": false
                },
                "stage": "Unfunded",
                "partOf": {
                    "name": "GMR Group",
                    "domain": "gmrgroup.in",
                    "id": "2LSyJc2Ujjl2PRAZYXqTpddUOqUC5NfbC-4EvUEf004",
                    "tracxnId": "2LSyJc2Ujjl2PRAZYXqTpddUOqUC5NfbC-4EvUEf004"
                },
                "profileLinks": {
                    "blog": "https://gramax.ai/blog",
                    "facebook": "https://facebook.com/gramaxcyb",
                    "linkedIn": "https://linkedin.com/company/gramaxcyb"
                },
                "websiteInfo": {
                    "httpStatus": 200,
                    "httpStatusUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 28
                    },
                    "url": "https://gramax.ai"
                },
                "mobileInfo": {
                    "appCount": 0
                },
                "locations": [
                    {
                        "country": {
                            "name": "India"
                        },
                        "state": {
                            "name": "Delhi"
                        },
                        "city": {
                            "name": "Delhi"
                        },
                        "continent": {
                            "name": "Asia"
                        }
                    }
                ],
                "logos": {
                    "imageUrl": "https://tracxn-data-image.s3.amazonaws.com/logo/company/gramax_c79a5aa9-28b7-4c20-8a3b-8576ba6c0b77.png"
                },
                "companyTrackCloneInfo": {
                    "status": "DISABLED"
                },
                "addresses": [
                    {
                        "type": "Headquarters",
                        "street": "Project Office, New Udaan Bhawan Opp. Terminal 3, Indira Gandhi International Airport New Delhi - 110 037, India",
                        "pinCode": "110 037"
                    }
                ],
                "tracxnScore": 0.0,
                "specialFlagList": [
                    {
                        "name": "Tech",
                        "value": "YES"
                    },
                    {
                        "name": "Consumer",
                        "value": "NO"
                    },
                    {
                        "name": "Enterprise",
                        "value": "YES"
                    },
                    {
                        "name": "Marketplace",
                        "value": "NO"
                    },
                    {
                        "name": "SaaS",
                        "value": "NO"
                    },
                    {
                        "name": "Software",
                        "value": "YES"
                    },
                    {
                        "name": "Tech Hardware",
                        "value": "NO"
                    },
                    {
                        "name": "Social Impact",
                        "value": "NO"
                    },
                    {
                        "name": "Artificial Intelligence",
                        "value": "NO"
                    },
                    {
                        "name": "Blockchain",
                        "value": "NO"
                    }
                ],
                "tracxnTeamScore": 0.0,
                "socketReachability": {
                    "value": "REACHABLE",
                    "lastUpdatedDate": {
                        "year": 2024,
                        "month": 12,
                        "day": 26,
                        "hours": 16,
                        "minutes": 37,
                        "seconds": 32
                    }
                },
                "tracxnId": "4CEq-ZVXzYx9oc5LfyaC2Zw1rFJGkhJu_BlsQrjQWMs",
                "tracxnSizeScore": 0.0,
                "tracxnExecutionScore": 0.0,
                "tracxnGrowthScore": 0.0,
                "sectorList": [
                    [
                        {
                            "name": "Enterprise Infrastructure",
                            "type": "PRACTICE AREA",
                            "tracxnId": "hOcVKpuztUIbPJQlF7j0fGQzi8XZMDUQUTMy6omC9vE"
                        },
                        {
                            "name": "Cybersecurity",
                            "type": "FEED",
                            "tracxnId": "rgJDhL5-vaoMdE9DoeiyMyeK6u8q2_iTE6YB_xDYlBg"
                        },
                        {
                            "name": "Suite",
                            "type": "BUSINESS MODEL",
                            "tracxnId": "Nlc_HLAwQyo4EjB75OLenlYhpOA_gnfl0f4JpYbA8PM"
                        }
                    ]
                ],
                "companyId": "6706ba80f21f13287555f5f7"
            }
        ],
        "total_count": 24047
    }
    
    for (const company of companiesList?.result || []) {
        const processedData = extractRequiredFields(company);
        const employees = processedData?.employeeList?.map((employee) => {
            const { employeeList, ...rest } = processedData; 
            return {
              ...employee,
              ...rest,
            };
          });
          
        if (employees.length > 0) {
            tracxnData.push(employees);
        }
    }

    if (!companiesList?.result?.length) break;
    break;
    from += 1
}

console.log(tracxnData)

if (fileURLToPath(import.meta.url) === process.argv[1]) {
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];

    if (inputFile) {
        // If input file is provided, read from file
        try {
            const jsonData = JSON.parse(readFileSync(inputFile, 'utf8'));
            
            convertTracxnToExcel(jsonData, outputFile || 'tracxn_output.xlsx');
        } catch (error) {
            console.error('Error processing file:', error.message);
            process.exit(1);
        }
    } else {
        // If no input file is provided, use sample data
        convertTracxnToExcel(tracxnData, 'tracxn_output.xlsx');
    }
}

export default convertTracxnToExcel;