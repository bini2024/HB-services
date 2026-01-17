// config.js
export const services = [
    { id: 'travel_doc', icon: '🌍', labels: { en: 'Refugee Travel Doc', am: 'የትራቨል ዶኩመንት', ti: 'ናይ ትራቨል ዶኩመንት' } },
    { id: 'passport', icon: '🛂', labels: { en: 'Passport', am: 'ፓስፖርት', ti: 'ፓስፖርት' } },
    { id: 'citizenship', icon: '🇨🇦', labels: { en: 'Citizenship', am: 'ዜግነት', ti: 'ዜግነት' } },
    { id: 'health_card', icon: '🏥', labels: { en: 'Health Card', am: 'የጤና ካርድ', ti: 'ናይ ጥዕና ካርድ' } },
    { id: 'single_status', icon: '💍', labels: { en: 'Single Status', am: 'ያላገባ ማስረጃ ወረቀት', ti: 'ናይ ሲንግል ወረቀት' } },
    { id: 'marriage_cert', icon: '💑', labels: { en: 'Marriage Cert', am: 'የጋብቻ የምስክር ወረቀት', ti: 'ናይ መርዓ ወረቐት' } },
    { id: 'death_cert', icon: '⚰️', labels: { en: 'Death Cert', am: 'የሞት የምስክር ወረቀት', ti: 'ናይ ሞት ምስክር ወረቐት' } },
    { id: 'sin_card', icon: '🔢', labels: { en: 'SIN Number', am: 'የSIN ቁጥር', ti: 'ናይ SIN ቁጽሪ' } },
    { id: 'ei_benefit', icon: '💼', labels: { en: 'Employment Insurance', am: 'የስራ አጥነት(EI)', ti: 'ናይ ስራሕ ኢንሹራንስ(EI)' } },
    { id: 'oas', icon: '👵', labels: { en: 'Old Age Security', am: 'የጡረታ', ti: 'ናይ ጡረታ' } },
    { id: 'lost_passport', icon: '❌', labels: { en: 'Lost/Stolen Passport', am: 'የጠፋ ፓስፖርት', ti: 'ዝጠፍአ ፓስፖርት' } },
    { 
        id: 'air_ticket', 
        icon: '✈️', 
        labels: { 
            en: 'Air Ticket Booking', 
            am: 'የኣየር ትኬት', 
            ti: 'ኣየር ቲኬት ምቁራጽ' 
        } 
    }
];

// PASTE YOUR FULL specificFields OBJECT HERE. 
// I am abbreviating it for space, but you must paste the WHOLE object from your original code here.
export const specificFields = {
  'travel_doc': [
        // ===============================
        // SECTION 1: PERSONAL DETAILS
        // ===============================
        { type: 'header', label: { en: 'Personal Details', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'uci_number', 
            type: 'text', 
            required: true, 
            label: { en: 'UCI Number (8 or 10 digits)', am: 'UCI ቁጥር (ከPR/Refugee ወረቀት ላይ)', ti: 'UCI ቁጽሪ' },
            placeholder: { en: '0000-0000 or 00-0000-0000', am: '0000-0000', ti: '0000-0000' }
        },
        { 
            name: 'surname', 
            type: 'text', 
            required: true, 
            label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም (አያት)', ti: 'ሽም ኣባሓጎ' } 
        },
        { 
            name: 'given_names', 
            type: 'text', 
            required: true, 
            label: { en: 'Given Names (First & Father\'s Name)', am: 'የክርስትና እና የአባት ስም', ti: 'ስምን ስም ኣቦን' } 
        },
        { 
            name: 'parent_birth_surname', 
            type: 'text', 
            label: { en: 'Mother\'s Maiden Name (Surname at Birth)', am: 'የእናት የትውልድ ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'birth_city', 
            type: 'text', 
            required: true, 
            label: { en: 'City of Birth', am: 'የትውልድ ከተማ', ti: 'ዝተወለድካሉ ከተማ' } 
        },
        { 
            name: 'birth_country', 
            type: 'text', 
            required: true, 
            label: { en: 'Country of Birth', am: 'የትውልድ አገር', ti: 'ዝተወለድካሉ ሃገር' } 
        },
        { 
            name: 'sex', 
            type: 'select', 
            required: true, 
            options: ['Female', 'Male', 'X (Another Gender)'], 
            label: { en: 'Sex', am: 'ጾታ', ti: 'ጾታ' } 
        },
        { 
            name: 'maritalStatus', 
            type: 'select', 
            options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Common-Law'], 
            label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } 
        },
        // IMPROVEMENT: Dropdown prevents spelling errors
        { 
            name: 'eye_color', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Hazel', 'Blue', 'Green', 'Grey'],
            label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } 
        },
        { 
            name: 'height', 
            type: 'text', 
            required: true, 
            label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሴንቲ ሜተር)' },
            placeholder: { en: 'e.g. 175 cm', am: 'ምሳሌ፡ 175', ti: 'ኣብነት: 175' }
        },

        // ===============================
        // SECTION 2: CONTACT & IMMIGRATION
        // ===============================
        { type: 'header', label: { en: 'Contact & Status', am: 'አድራሻ እና ስቴትስ', ti: 'ኣድራሻን ኩነታትን' } },

        { 
            name: 'phone_primary', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ቴሌፎን' } 
        },
        { 
            name: 'email', 
            type: 'email', 
            required: true, 
            label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢሜይል' } 
        },
        { 
            name: 'home_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address (Full)', am: 'የአሁን መኖሪያ አድራሻ (ሙሉ)', ti: 'ናይ ሕጂ ኣድራሻ (ሙሉእ)' } 
        },
        { 
            name: 'immigration_doc_type', 
            type: 'select', 
            required: true, 
            options: ['Permanent Resident Card', 'Notice of Decision (Refugee)', 'Verification of Status'], 
            label: { en: 'Immigration Document Used', am: 'የሚጠቀሙት የኢሚግሬሽን ሰነድ', ti: 'ትጥቀሙሉ ናይ ኢሚግሬሽን ሰነድ' } 
        },
        { 
            name: 'immigration_doc_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Document Number', am: 'የሰነዱ ቁጥር', ti: 'ቁጽሪ ሰነድ' } 
        },
        { 
            name: 'citizen_of', 
            type: 'text', 
            required: true, 
            label: { en: 'Citizen of which country?', am: 'ዜግነትዎ የየት ሀገር ነው?', ti: 'ዜጋ ናይ ኣየነይቲ ሃገር ኢኩም?' } 
        },

        // ===============================
        // SECTION 3: ADDRESS HISTORY (REPEATER)
        // ===============================
        // IMPROVEMENT: Repeater ensures they give dates for every address
        { type: 'header', label: { en: 'Address History (Last 2 Years)', am: 'የአድራሻ ታሪክ (2 ዓመት)', ti: 'ታሪክ ኣድራሻ (2 ዓመት)' } },

        { 
            name: 'address_history', 
            type: 'repeater', 
            label: { en: 'List all addresses where you lived in the last 2 years (No Gaps)', am: 'ባለፉት 2 ዓመታት የኖሩባቸውን አድራሻዎች በሙሉ ይዘርዝሩ', ti: 'ኣብ ዝሓለፈ 2 ዓመታት ዝነበርኩሎም ኣድራሻታት ብሙሉኡ ዘርዝሩ' },
            fields: [
                { name: 'addr_from', type: 'date', label: { en: 'From', am: 'ከ', ti: 'ካብ' } },
                { name: 'addr_to', type: 'date', label: { en: 'To', am: 'እስከ', ti: 'ክሳብ' } },
                { name: 'full_address', type: 'text', label: { en: 'Full Address (Street, City)', am: 'ሙሉ አድራሻ', ti: 'ሙሉእ ኣድራሻ' } }
            ]
        },

        // ===============================
        // SECTION 4: GUARANTOR
        // ===============================
        { type: 'header', label: { en: 'Guarantor', am: 'ዋስ', ti: 'ዋሕስ' } },

        { 
            name: 'guarantor_full_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Name', am: 'የዋስ ስም', ti: 'ስም ዋሕስ' } 
        },
        { 
            name: 'guarantor_ppt_num', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Passport Number', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋሕስ' } 
        },
        { 
            name: 'guarantor_years', 
            type: 'number', 
            required: true, 
            label: { en: 'Years Known (Must be > 6 months)', am: 'ለስንት ዓመት ያውቅዎታል?', ti: 'ንክንደይ ዓመት ይፈልጠኩም?' } 
        },
        { 
            name: 'guarantor_phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Guarantor Phone', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ቴሌፎን ዋሕስ' } 
        },

        // ===============================
        // SECTION 5: REFERENCES
        // ===============================
        // IMPROVEMENT: Split fields to ensure we get phone numbers
        { type: 'header', label: { en: 'References', am: 'ምስክሮች', ti: 'ምስክሮች' } },

        // Reference 1
        { name: 'ref1_name', type: 'text', required: true, label: { en: 'Reference 1 Name', am: 'ምስክር 1 ስም', ti: 'ምስክር 1 ስም' } },
        { name: 'ref1_relation', type: 'text', required: true, label: { en: 'Relationship (Not Family)', am: 'ግንኙነት (ቤተሰብ ያልሆነ)', ti: 'ዝምድና (ቤተሰብ ዘይኮነ)' } },
        { name: 'ref1_phone', type: 'tel', required: true, label: { en: 'Reference 1 Phone', am: 'ምስክር 1 ስልክ', ti: 'ምስክር 1 ስልክ' } },

        // Reference 2
        { name: 'ref2_name', type: 'text', required: true, label: { en: 'Reference 2 Name', am: 'ምስክር 2 ስም', ti: 'ምስክር 2 ስም' } },
        { name: 'ref2_relation', type: 'text', required: true, label: { en: 'Relationship (Not Family)', am: 'ግንኙነት (ቤተሰብ ያልሆነ)', ti: 'ዝምድና (ቤተሰብ ዘይኮነ)' } },
        { name: 'ref2_phone', type: 'tel', required: true, label: { en: 'Reference 2 Phone', am: 'ምስክር 2 ስልክ', ti: 'ምስክር 2 ስልክ' } },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

   'passport': [
        // ===============================
        // SECTION 1: PASSPORT DETAILS
        // ===============================
        { type: 'header', label: { en: 'Passport Details', am: 'የፓስፖርት ዝርዝር', ti: 'ዝርዝር ፓስፖርት' } },

        { 
            name: 'passport_validity', 
            type: 'select', 
            required: true, 
            options: ['5 Years (Age 16+)', '10 Years (Age 16+)'], 
            label: { en: 'Validity Period', am: 'የአገልግሎት ዘመን', ti: 'ግዜ ኣገልግሎት' } 
        },

        // ===============================
        // SECTION 2: PERSONAL INFORMATION
        // ===============================
        { type: 'header', label: { en: 'Personal Information', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'surname', 
            type: 'text', 
            required: true, 
            label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም (አያት)', ti: 'ሽም ኣባሓጎ' } 
        },
        { 
            name: 'given_names', 
            type: 'text', 
            required: true, 
            label: { en: 'Given Names', am: 'የክርስትና እና የአባት ስም', ti: 'ስምን ስም ኣቦን' } 
        },
        { 
            name: 'parent_surname_birth', 
            type: 'text', 
            required: true, 
            label: { en: 'Mother\'s Maiden Name (Surname at Birth)', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'birth_city', 
            type: 'text', 
            required: true, 
            label: { en: 'City of Birth', am: 'የትውልድ ከተማ', ti: 'ዝተወለድካሉ ከተማ' } 
        },
        { 
            name: 'birth_country', 
            type: 'text', 
            required: true, 
            label: { en: 'Country of Birth', am: 'የትውልድ አገር', ti: 'ዝተወለድካሉ ሃገር' } 
        },
        { 
            name: 'sex', 
            type: 'select', 
            required: true, 
            options: ['Female', 'Male', 'X (Another Gender)'], 
            label: { en: 'Sex', am: 'ጾታ', ti: 'ጾታ' } 
        },
        { 
            name: 'eye_color', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Hazel', 'Blue', 'Green', 'Grey'], 
            label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } 
        },
        { 
            name: 'hair_color', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Blond', 'Red', 'Grey', 'White', 'Bald'], 
            label: { en: 'Hair Colour', am: 'የፀጉር ቀለም', ti: 'ሕብሪ ፀጉሪ' } 
        },
        { 
            name: 'height', 
            type: 'text', 
            required: true, 
            label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሴሜ)' },
            placeholder: { en: 'e.g. 175 cm', am: '175', ti: '175' }
        },

        // ===============================
        // SECTION 3: CITIZENSHIP & ID
        // ===============================
        { type: 'header', label: { en: 'Citizenship Proof & ID', am: 'ዜግነት እና መታወቂያ', ti: 'ዜግነትን መታወቕን' } },

        { 
            name: 'citizenship_doc_type', 
            type: 'select', 
            required: true, 
            options: ['Birth Certificate (Canada)', 'Citizenship Certificate'], 
            label: { en: 'Proof of Citizenship', am: 'የዜግነት ማረጋገጫ', ti: 'መረጋገጺ ዜግነት' } 
        },
        { 
            name: 'citizenship_doc_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Certificate Number', am: 'የሰርተፍኬት ቁጥር', ti: 'ቁጽሪ ሰርተፍኬት' } 
        },
        { 
            name: 'citizenship_issue_date', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Issue', am: 'የተሰጠበት ቀን', ti: 'ዝተዋህበሉ ዕለት' } 
        },
        { 
            name: 'id_type', 
            type: 'text', 
            required: true, 
            label: { en: 'Supporting ID (e.g. Driver\'s License)', am: 'መታወቂያ (መንጃ ፈቃድ)', ti: 'መታወቒ (መንጃ ፍቃድ)' } 
        },
        { 
            name: 'id_number', 
            type: 'text', 
            required: true, 
            label: { en: 'ID Number', am: 'የመታወቂያ ቁጥር', ti: 'ቁጽሪ መታወቒ' } 
        },
        { 
            name: 'id_expiry', 
            type: 'date', 
            required: true, 
            label: { en: 'ID Expiry Date', am: 'የሚያበቃበት ቀን', ti: 'ዝወድቀሉ ዕለት' } 
        },

        // ===============================
        // SECTION 4: ADDRESS HISTORY (REPEATER)
        // ===============================
        { type: 'header', label: { en: 'Address History (Last 2 Years)', am: 'የአድራሻ ታሪክ (2 ዓመት)', ti: 'ታሪክ ኣድራሻ (2 ዓመት)' } },

        { 
            name: 'home_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ሕጂ ኣድራሻ' } 
        },
        { 
            name: 'address_history', 
            type: 'repeater', 
            label: { en: 'Previous Addresses (No Gaps)', am: 'የቀድሞ አድራሻዎች (ያለ ክፍተት)', ti: 'ዝነበረኩም ኣድራሻታት (ብዘይ ክፍተት)' },
            fields: [
                { name: 'addr_from', type: 'date', label: { en: 'From', am: 'ከ', ti: 'ካብ' } },
                { name: 'addr_to', type: 'date', label: { en: 'To', am: 'እስከ', ti: 'ክሳብ' } },
                { name: 'full_address', type: 'text', label: { en: 'Address (Street, City)', am: 'አድራሻ', ti: 'ኣድራሻ' } }
            ]
        },

        // ===============================
        // SECTION 5: OCCUPATION HISTORY (REPEATER)
        // ===============================
        { type: 'header', label: { en: 'Work/School History (2 Years)', am: 'የስራ/ትምህርት ታሪክ', ti: 'ታሪክ ስራሕ/ትምህርቲ' } },

        { 
            name: 'occupation_history', 
            type: 'repeater', 
            label: { en: 'List Work or School (No Gaps)', am: 'ስራ ወይም ትምህርት ይዘርዝሩ', ti: 'ስራሕ ወይ ትምህርቲ ዘርዝሩ' },
            fields: [
                { name: 'occ_from', type: 'date', label: { en: 'From', am: 'ከ', ti: 'ካብ' } },
                { name: 'occ_to', type: 'date', label: { en: 'To', am: 'እስከ', ti: 'ክሳብ' } },
                { name: 'employer', type: 'text', label: { en: 'Employer/School Name', am: 'የአሰሪ/ትምህርት ቤት ስም', ti: 'ስም ትካል/ትምህርቲ' } }
            ]
        },

        // ===============================
        // SECTION 6: GUARANTOR
        // ===============================
        { type: 'header', label: { en: 'Guarantor', am: 'ዋስ', ti: 'ዋሕስ' } },

        { 
            name: 'guarantor_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Name', am: 'የዋስ ስም', ti: 'ስም ዋሕስ' } 
        },
        { 
            name: 'guarantor_ppt_num', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Passport #', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋሕስ' } 
        },
        { 
            name: 'guarantor_issue_date', 
            type: 'date', 
            required: true, 
            label: { en: 'Passport Issue Date', am: 'ፓስፖርቱ የተሰጠበት ቀን', ti: 'ፓስፖርት ዝተወሃበሉ ዕለት' } 
        },
        { 
            name: 'guarantor_phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Guarantor Phone', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ዋሕስ' } 
        },
        { 
            name: 'guarantor_years', 
            type: 'number', 
            required: true, 
            label: { en: 'Years Known', am: 'ለስንት ዓመት ያውቅዎታል?', ti: 'ንክንደይ ዓመት ይፈልጠኩም?' } 
        },

        // ===============================
        // SECTION 7: REFERENCES
        // ===============================
        { type: 'header', label: { en: 'References', am: 'ምስክሮች', ti: 'ምስክሮች' } },

        { name: 'ref1_name', type: 'text', required: true, label: { en: 'Reference 1 Name', am: 'ምስክር 1 ስም', ti: 'ምስክር 1 ስም' } },
        { name: 'ref1_phone', type: 'tel', required: true, label: { en: 'Reference 1 Phone', am: 'ምስክር 1 ስልክ', ti: 'ምስክር 1 ስልክ' } },
        { name: 'ref1_relation', type: 'text', required: true, label: { en: 'Relationship', am: 'ግንኙነት', ti: 'ዝምድና' } },

        { name: 'ref2_name', type: 'text', required: true, label: { en: 'Reference 2 Name', am: 'ምስክር 2 ስም', ti: 'ምስክር 2 ስም' } },
        { name: 'ref2_phone', type: 'tel', required: true, label: { en: 'Reference 2 Phone', am: 'ምስክር 2 ስልክ', ti: 'ምስክር 2 ስልክ' } },
        { name: 'ref2_relation', type: 'text', required: true, label: { en: 'Relationship', am: 'ግንኙነት', ti: 'ዝምድና' } },

        // ===============================
        // SECTION 8: EMERGENCY CONTACT
        // ===============================
        { type: 'header', label: { en: 'Emergency Contact', am: 'የአደጋ ጊዜ ተጠሪ', ti: 'ናይ ህጹጽ እዋን ተጸዋዒ' } },

        { 
            name: 'emergency_contact', 
            type: 'textarea', 
            label: { en: 'Full Name, Relation, Phone, Address', am: 'ስም፣ ግንኙነት፣ ስልክ፣ አድራሻ', ti: 'ስም፣ ዝምድና፣ ስልክ፣ ኣድራሻ' },
            placeholder: { en: 'John Doe, Brother, 416-555-0101, 123 Main St', am: '', ti: '' }
        },
        
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

   'citizenship': [
        // ===============================
        // SECTION 1: PERSONAL DETAILS
        // ===============================
        { type: 'header', label: { en: 'Identity & Status', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'uci_number', 
            type: 'text', 
            required: true, 
            label: { en: 'UCI Number (From PR Card)', am: 'UCI ቁጥር (ከPR ካርድ ላይ)', ti: 'UCI ቁጽሪ' },
            placeholder: { en: '0000-0000', am: '0000-0000', ti: '0000-0000' }
        },
        { 
            name: 'full_name_pr', 
            type: 'text', 
            required: true, 
            label: { en: 'Full Name (Exactly as on PR Card)', am: 'ሙሉ ስም (ልክ በ PR ካርድ ላይ እንዳለው)', ti: 'ሙሉእ ስም (ከምቲ ኣብ PR ካርድ ዘሎ)' } 
        },
        { 
            name: 'name_change', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Name Changed since PR?', am: 'PR ካገኙ በኋላ ስም ቀይረዋል?', ti: 'PR ካብ እትረክብ ስምካ ቀይርካ ዶ?' } 
        },
        { 
            name: 'gender', 
            type: 'select', 
            required: true, 
            options: ['Male', 'Female', 'X (Another Gender)'], 
            label: { en: 'Gender', am: 'ጾታ', ti: 'ጾታ' } 
        },
        { 
            name: 'height', 
            type: 'text', 
            required: true, 
            label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሴንቲ ሜተር)' },
            placeholder: { en: 'e.g. 175 cm', am: '175', ti: '175' }
        },
        { 
            name: 'eye_colour', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Hazel', 'Blue', 'Green', 'Grey'], 
            label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } 
        },
        { 
            name: 'maritalStatus', 
            type: 'select', 
            options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Common-Law'], 
            label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } 
        },
        { 
            name: 'date_of_birth', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'place_of_birth_city', 
            type: 'text', 
            required: true, 
            label: { en: 'City of Birth', am: 'የተወለዱበት ከተማ', ti: 'ዝተወለድኩምሉ ከተማ' } 
        },
        { 
            name: 'place_of_birth_country', 
            type: 'text', 
            required: true, 
            label: { en: 'Country of Birth', am: 'የተወለዱበት ሀገር', ti: 'ዝተወለድኩምሉ ሃገር' } 
        },

        // ===============================
        // SECTION 2: CONTACT INFO
        // ===============================
        { type: 'header', label: { en: 'Contact Information', am: 'አድራሻ', ti: 'ኣድራሻ' } },

        { 
            name: 'phone_number', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ቴሌፎን' } 
        },
        { 
            name: 'email_address', 
            type: 'email', 
            required: true, 
            label: { en: 'Email Address', am: 'ኢሜይል', ti: 'ኢሜይል' } 
        },
        { 
            name: 'home_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ሕጂ ኣድራሻ' } 
        },

        // ===============================
        // SECTION 3: PRESENCE (5 YEARS)
        // ===============================
        { type: 'header', label: { en: 'Physical Presence (5 Years)', am: 'የአድራሻ እና ስራ ታሪክ (5 ዓመት)', ti: 'ታሪክ ኣድራሻን ስራሕን (5 ዓመት)' } },

        // Address History Repeater
        { 
            name: 'address_history', 
            type: 'repeater', 
            label: { en: 'Address History (Inside & Outside Canada) - NO GAPS', am: 'የአድራሻ ታሪክ (ያለ ክፍተት)', ti: 'ታሪክ ኣድራሻ (ብዘይ ክፍተት)' },
            fields: [
                { name: 'from_date', type: 'date', label: { en: 'From', am: 'ከ', ti: 'ካብ' } },
                { name: 'to_date', type: 'date', label: { en: 'To', am: 'እስከ', ti: 'ክሳብ' } },
                { name: 'address', type: 'text', label: { en: 'Address (City, Country)', am: 'ከተማ እና ሀገር', ti: 'ከተማን ሃገርን' } }
            ]
        },

        // Activity History Repeater
        { 
            name: 'activity_history', 
            type: 'repeater', 
            label: { en: 'Work & Education History (If unemployed, list "Unemployed")', am: 'የስራ/ትምህርት ታሪክ (ካልሰሩ "ስራ አጥ" ይበሉ)', ti: 'ታሪክ ስራሕ/ትምህርቲ (ዘይሰርሑ እንተኮይኖም "ስራሕ ኣይነበረን")' },
            fields: [
                { name: 'from_date', type: 'date', label: { en: 'From', am: 'ከ', ti: 'ካብ' } },
                { name: 'to_date', type: 'date', label: { en: 'To', am: 'እስከ', ti: 'ክሳብ' } },
                { name: 'activity_type', type: 'select', options: ['Work', 'Education', 'Unemployed', 'Homemaker', 'Retired'], label: { en: 'Type', am: 'ዓይነት', ti: 'ዓይነት' } },
                { name: 'details', type: 'text', label: { en: 'Employer/School Name', am: 'ስም', ti: 'ስም' } }
            ]
        },

        // ===============================
        // SECTION 4: TAX & LANGUAGE
        // ===============================
        { type: 'header', label: { en: 'Tax & Language', am: 'ታክስ እና ቋንቋ', ti: 'ግብርን ቋንቋን' } },

        { 
            name: 'sin_number', 
            type: 'text', 
            required: true, 
            label: { en: 'SIN Number', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } 
        },
        { 
            name: 'tax_filing_history', 
            type: 'checkbox_group', 
            options: ['2024', '2023', '2022', '2021', '2020'], 
            label: { en: 'Years Income Tax Filed (Must be 3 of last 5)', am: 'ግብር የከፈሉባቸው ዓመታት', ti: 'ግብሪ ዝከፈልኩምለን ዓመታት' } 
        },
        { 
            name: 'language_proof_type', 
            type: 'select', 
            required: true, 
            options: [
                'Diploma/Degree (English/French)',
                'CELPIP / IELTS / TEF Test Results',
                'LINC / CLIC Certificate',
                'Age Exempt (Under 18 or Over 54)',
                'None'
            ], 
            label: { en: 'Proof of Language (Age 18-54)', am: 'የቋንቋ ማረጋገጫ', ti: 'መረጋገጺ ቋንቋ' } 
        },

        // ===============================
        // SECTION 5: PROHIBITIONS (LEGAL)
        // ===============================
        { type: 'header', label: { en: 'Prohibitions (Yes/No)', am: 'ህጋዊ ጥያቄዎች', ti: 'ሕጋዊ ሕቶታት' } },

        { 
            name: 'crime_inside_canada', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Charged/Convicted of crime inside Canada?', am: 'በካናዳ ውስጥ በወንጀል ተከሰው ያውቃሉ?', ti: 'ኣብ ካናዳ ብገበን ተከሰስካ/ኪ ትፈልጥ/ጢ ዶ?' } 
        },
        { 
            name: 'crime_outside_canada', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Charged/Convicted of crime OUTSIDE Canada?', am: 'ከካናዳ ውጭ በወንጀል ተከሰው ያውቃሉ?', ti: 'ካብ ካናዳ ወጻኢ ብገበን ተከሰስካ/ኪ ትፈልጥ/ጢ ዶ?' } 
        },
        { 
            name: 'under_removal_order', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Under removal order (Asked to leave Canada)?', am: 'ከካናዳ እንዲወጡ ታዘዋል?', ti: 'ካብ ካናዳ ክትወጹ ተኣዚዝኩም ዶ?' } 
        },
        { 
            name: 'other_citizenships', 
            type: 'select', 
            options: ['No', 'Yes'], 
            label: { en: 'Citizen of another country?', am: 'የሌላ ሀገር ዜግነት አለዎት?', ti: 'ናይ ካልእ ሃገር ዜግነት አለኩም ዶ?' } 
        },
        // 183 Day Rule - Triggers Police Cert Request
        { 
            name: 'lived_outside_183_days', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Lived in another country for 6+ months (last 4 years)?', am: 'ባለፉት 4 ዓመታት ውስጥ በሌላ ሀገር ለ6 ወር ኖረዋል?', ti: 'ኣብ ዝሓለፈ 4 ዓመታት ኣብ ካልእ ሃገር ን6 ወር ተቀሚጥኩም ዶ?' } 
        },

        // ===============================
        // SECTION 6: CONSENT
        // ===============================
        { type: 'header', label: { en: 'Declaration', am: 'ስምምነት', ti: 'ስምምዕ' } },

        { 
            name: 'elections_canada_consent', 
            type: 'select', 
            options: ['Yes', 'No'], 
            label: { en: 'Share info with Elections Canada?', am: 'መረጃዎ ለምርጫ ቦርድ እንዲሰጥ ይፈቅዳሉ?', ti: 'ሓበሬታኩም ንቦርድ ምርጫ ክወሃብ ትፈቅዱ ዶ?' } 
        },
        { 
            name: 'declaration_truth', 
            type: 'checkbox', 
            required: true, 
            label: { en: 'I declare that the information is true and complete.', am: 'የሰጠሁት መረጃ እውነት እና የተሟላ መሆኑን አረጋግጣለሁ።', ti: 'ዝሃብክዎ ሓበሬታ ሓቂን ዝተማልአን ምዃኑ የረጋግጽ።' } 
        },
        
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

   'health_card': [ // Based on OHIP 0265-82
        // ===============================
        // SECTION 1: APPLICANT DETAILS
        // ===============================
        { type: 'header', label: { en: 'Personal Information', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'surname', 
            type: 'text', 
            required: true, 
            label: { en: 'Last Name (Surname)', am: 'የቤተሰብ ስም', ti: 'ሽም ኣባሓጎ' } 
        },
        { 
            name: 'given_names', 
            type: 'text', 
            required: true, 
            label: { en: 'First & Middle Names', am: 'የክርስትና ስም', ti: 'ስም' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } 
        },
        { 
            name: 'sex', 
            type: 'select', 
            required: true, 
            options: ['Male', 'Female', 'X'], 
            label: { en: 'Sex', am: 'ጾታ', ti: 'ጾታ' } 
        },

        // ===============================
        // SECTION 2: CONTACT & ADDRESS
        // ===============================
        { type: 'header', label: { en: 'Contact Information', am: 'አድራሻ', ti: 'ኣድራሻ' } },

        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'current_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address (Street, Apt, City, Postal Code)', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ገዛ አድራሻ (መንገዲ፣ ቁጽሪ ገዛ፣ ከተማ)' } 
        },
        { 
            name: 'mailing_address', 
            type: 'textarea', 
            label: { en: 'Mailing Address (If different)', am: 'የፖስታ አድራሻ (ከላይ ካለው የተለየ ከሆነ)', ti: 'ናይ ፖስታ አድራሻ (ካብቲ ላዕሊ ዝተፈልየ እንተኾይኑ)' } 
        },

        // ===============================
        // SECTION 3: REQUIRED DOCUMENTS (List 1, 2, 3)
        // ===============================
        { type: 'header', label: { en: 'Required Documents', am: 'የሚያስፈልጉ ሰነዶች', ti: 'ዝድለዩ ሰነዳት' } },

        // LIST 1: Citizenship / Immigration Status
        { 
            name: 'status_doc', 
            type: 'select', 
            required: true, 
            options: ['Permanent Resident Card', 'Confirmation of PR (COPR)', 'Work Permit', 'Canadian Citizenship Certificate', 'Canadian Passport', 'Refugee Protection Claimant Document'], 
            label: { en: '1. Proof of Status (Immigration Doc)', am: '1. የኢሚግሬሽን ሰነድ (Status)', ti: '1. ናይ ኢሚግሬሽን ሰነድ' } 
        },
        
        // LIST 2: Residency (Address)
        { 
            name: 'residency_doc', 
            type: 'select', 
            required: true, 
            options: ['Driver\'s License', 'Bank Statement', 'Utility Bill', 'Lease/Rental Agreement', 'Pay Stub (With Address)', 'Employment Letter'], 
            label: { en: '2. Proof of Residency (Address)', am: '2. የአድራሻ ማረጋገጫ', ti: '2. ናይ ኣድራሻ መረጋገጺ' } 
        },

        // LIST 3: Identity (Signature/Photo)
        { 
            name: 'identity_doc', 
            type: 'select', 
            required: true, 
            options: ['Passport (Foreign)', 'Credit Card', 'Driver\'s License', 'Student ID', 'Employee ID'], 
            label: { en: '3. Support of Identity (Name & Signature)', am: '3. ማንነት ማረጋገጫ (ከፎቶ/ፊርማ ጋር)', ti: '3. መንነት መረጋገጺ (ምስ ፎቶ/ፊርማ)' } 
        },

        // ===============================
        // SECTION 4: ARRIVAL HISTORY
        // ===============================
        { type: 'header', label: { en: 'Arrival Dates', am: 'የገቡበት ቀን', ti: 'ዝኣተውሉ ዕለት' } },

        { 
            name: 'arrival_date_canada', 
            type: 'date', 
            label: { en: 'Date Arrived in Canada', am: 'ካናዳ የገቡበት ቀን', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } 
        },
        { 
            name: 'arrival_date_ontario', 
            type: 'date', 
            label: { en: 'Date Arrived in Ontario', am: 'ኦንታሪዮ የገቡበት ቀን', ti: 'ናብ ኦንታሪዮ ዝኣተውሉ ዕለት' } 
        },
        { 
            name: 'absence_ontario', 
            type: 'select', 
            options: ['No', 'Yes'], 
            label: { en: 'Have you been out of Ontario for >30 days since arriving?', am: 'ኦንታሪዮ ከገቡ በኋላ ከ30 ቀናት በላይ ወጥተው ያውቃሉ?', ti: 'ናብ ኦንታሪዮ ካብ ትኣትዉ ን 30 መዓልታት ዝኸውን ወጺእኩም ትፈልጡ ዶ?' } 
        },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

  'single_status': [ 
        // ===============================
        // SECTION 1: APPLICANT DETAILS
        // ===============================
        { type: 'header', label: { en: 'Applicant Details', am: 'የአመልካች መረጃ', ti: 'ሓበሬታ ኣመልካቲ' } },

        { 
            name: 'full_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Full Name (As per Passport)', am: 'ሙሉ ስም (በፓስፖርት ላይ እንዳለው)', ti: 'ሙሉእ ስም (ከምቲ ኣብ ፓስፖርት ዘሎ)' } 
        },
        { 
            name: 'occupation', 
            type: 'text', 
            required: true, 
            label: { en: 'Occupation', am: 'የስራ ድርሻ/ሙያ', ti: 'ስራሕ/ሞያ' } 
        },
        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'current_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ሕጂ ኣድራሻ' } 
        },

        // ===============================
        // SECTION 2: PARENTS
        // ===============================
        { type: 'header', label: { en: 'Parental Information', am: 'የወላጆች መረጃ', ti: 'ሓበሬታ ወለዲ' } },

        { 
            name: 'father_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Father\'s Full Name', am: 'የአባት ሙሉ ስም', ti: 'ናይ ኣቦ ሙሉእ ስም' } 
        },
        { 
            name: 'mother_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Mother\'s Full Name', am: 'የእናት ሙሉ ስም', ti: 'ናይ ኣደ ሙሉእ ስም' } 
        },

        // ===============================
        // SECTION 3: MARITAL STATUS
        // ===============================
        { type: 'header', label: { en: 'Current Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } },

        { 
            name: 'marital_status', 
            type: 'select', 
            required: true, 
            options: ['Never Married', 'Divorced', 'Widowed'], 
            label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } 
        },
        { 
            name: 'previous_marriage_end_date', 
            type: 'date', 
            label: { en: 'Date Ended (If Divorced/Widowed)', am: 'የተፋቱበት/የሞተበት ቀን', ti: 'ዝተፋታሕኩምሉ/ዝሞተሉ ዕለት' } 
        },
        { 
            name: 'divorce_file_number', 
            type: 'text', 
            label: { en: 'Court File No. (If Divorced)', am: 'የፍርድ ቤት መዝገብ ቁጥር', ti: 'ናይ ቤት ፍርዲ መዝገብ ቁጽሪ' } 
        },

        // ===============================
        // SECTION 4: FUTURE PLANS
        // ===============================
        { type: 'header', label: { en: 'Marriage Plans', am: 'የጋብቻ ዕቅድ', ti: 'መደብ መርዓ' } },

        { 
            name: 'marriage_country', 
            type: 'text', 
            required: true, 
            label: { en: 'Country of Marriage', am: 'ጋብቻው የሚፈጸምበት አገር', ti: 'መርዓ ዝግበረሉ ሃገር' } 
        },
        
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

   'marriage_cert': [ // Service Ontario
        // ===============================
        // SECTION 1: MARRIAGE DETAILS
        // ===============================
        { type: 'header', label: { en: 'Marriage Details', am: 'የጋብቻው ዝርዝር', ti: 'ዝርዝር መርዓ' } },

        { 
            name: 'marriage_date', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Marriage', am: 'ጋብቻው የተፈጸመበት ቀን', ti: 'ዝተመርዓዉሉ ዕለት' } 
        },
        { 
            name: 'marriage_city', 
            type: 'text', 
            required: true, 
            label: { en: 'City/Town of Marriage', am: 'ጋብቻው የተፈጸመበት ከተማ', ti: 'መርዓ ዝተፈጸመሉ ከተማ' } 
        },

        // ===============================
        // SECTION 2: PERSON 1 (GROOM)
        // ===============================
        { type: 'header', label: { en: 'Person 1 (Groom)', am: 'አመልካች 1 (ሙሽራ)', ti: 'መመርዓዊ' } },

        { 
            name: 'groom_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Full Name (Before Marriage)', am: 'ሙሉ ስም (ከጋብቻ በፊት)', ti: 'ሙሉእ ስም (ቅድሚ መርዓ)' } 
        },
        { 
            name: 'groom_dob', 
            type: 'date', 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } 
        },
        { 
            name: 'groom_birthplace', 
            type: 'text', 
            label: { en: 'Place of Birth (City, Country)', am: 'የትውልድ ቦታ', ti: 'ዝተወለድኩምሉ ቦታ' } 
        },

        // ===============================
        // SECTION 3: PERSON 2 (BRIDE)
        // ===============================
        { type: 'header', label: { en: 'Person 2 (Bride)', am: 'አመልካች 2 (ሙሽሪት)', ti: 'መመርዓዊት' } },

        { 
            name: 'bride_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Full Name (Before Marriage)', am: 'ሙሉ ስም (ከጋብቻ በፊት)', ti: 'ሙሉእ ስም (ቅድሚ መርዓ)' } 
        },
        { 
            name: 'bride_dob', 
            type: 'date', 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } 
        },
        { 
            name: 'bride_birthplace', 
            type: 'text', 
            label: { en: 'Place of Birth (City, Country)', am: 'የትውልድ ቦታ', ti: 'ዝተወለድኩምሉ ቦታ' } 
        },

        // ===============================
        // SECTION 4: DELIVERY & CONTACT
        // ===============================
        { type: 'header', label: { en: 'Delivery & Contact', am: 'አድራሻ እና ስልክ', ti: 'ኣድራሻን ስልክን' } },

        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'mailing_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Mailing Address (For the Certificate)', am: 'የፖስታ አድራሻ (ሰርተፍኬቱ የሚላክበት)', ti: 'ናይ ፖስታ ኣድራሻ (ሰርተፍኬት ዝለኣከሉ)' } 
        },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

    'death_cert': [
        { name: 'applicant_name', type: 'text', required: true, label: { en: 'Your Full Name (Applicant)', am: 'የአመልካች ስም', ti: 'ናይ ኣመልካቲ ስም' } },
        { name: 'applicant_phone', type: 'tel', required: true, label: { en: 'Your Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } },
        { name: 'deceased_name', type: 'text', required: true, label: { en: 'Deceased Full Name', am: 'የሟች ሙሉ ስም', ti: 'ሙሉእ ሽም መዋቲ' } },
        { name: 'date_death', type: 'date', label: { en: 'Date of Death', am: 'የሞቱበት ቀን', ti: 'ዝሞትሉ ዕለት' } },
        { name: 'place_death', type: 'text', label: { en: 'Place of Death (City)', am: 'የሞቱበት ከተማ', ti: 'ዝሞትሉ ከተማ' } },
        { name: 'applicant_relationship', type: 'text', label: { en: 'Your Relationship to Deceased', am: 'ከሟች ጋር ያሎት ዝምድና', ti: 'ምስ መዋቲ ዘለኩም ዝምድና' } },
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Information', am: 'ተጨማሪ መረጃ', ti: 'ተወሳኪ ሓበሬታ' }, 
            placeholder: { en: 'Please provide any additional information here...', am: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...', ti: 'እባክዎ ተጨማሪ መረጃዎትን እዚህ ያስገቡ...' } 
        }
    ],

    'sin_card': [
        // ===============================
        // SECTION 1: APPLICANT DETAILS
        // ===============================
        { type: 'header', label: { en: 'Applicant Information', am: 'የአመልካች መረጃ', ti: 'ሓበሬታ ኣመልካቲ' } },

        { 
            name: 'surname', 
            type: 'text', 
            required: true, 
            label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም', ti: 'ሽም ኣባሓጎ' } 
        },
        { 
            name: 'given_names', 
            type: 'text', 
            required: true, 
            label: { en: 'Given Names', am: 'የክርስትና ስም', ti: 'ስም' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'is_twin', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Are you a twin, triplet, etc?', am: 'መንታ ነዎት?', ti: 'መንታ ዲኹም?' } 
        },
        { 
            name: 'other_names', 
            type: 'text', 
            label: { en: 'Other Names Used (e.g. Maiden Name)', am: 'ሌላ የሚጠቀሙት ስም (ካለ)', ti: 'ካልእ እትጥቀሙሉ ስም (እንተልዩ)' } 
        },

        // ===============================
        // SECTION 2: PLACE OF BIRTH
        // ===============================
        { type: 'header', label: { en: 'Place of Birth', am: 'የትውልድ ቦታ', ti: 'ዝተወለድካሉ ቦታ' } },

        { 
            name: 'birth_city', 
            type: 'text', 
            required: true, 
            label: { en: 'City/Town', am: 'ከተማ', ti: 'ከተማ' } 
        },
        { 
            name: 'birth_country', 
            type: 'text', 
            required: true, 
            label: { en: 'Country', am: 'አገር', ti: 'ሃገር' } 
        },

        // ===============================
        // SECTION 3: PARENTS
        // ===============================
        { type: 'header', label: { en: 'Parent Information', am: 'የወላጆች መረጃ', ti: 'ሓበሬታ ወለዲ' } },

        { 
            name: 'mother_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Mother\'s Maiden Name (Surname at Birth)', am: 'የእናት ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } 
        },
        { 
            name: 'father_name', 
            type: 'text', 
            label: { en: 'Father\'s Full Name', am: 'የአባት ሙሉ ስም', ti: 'ናይ ኣቦ ሙሉእ ስም' } 
        },

        // ===============================
        // SECTION 4: STATUS & CONTACT
        // ===============================
        { type: 'header', label: { en: 'Status & Contact', am: 'ሰነድ እና አድራሻ', ti: 'ሰነድን ኣድራሻን' } },

        { 
            name: 'status_doc_type', 
            type: 'select', 
            required: true, 
            options: ['Permanent Resident Card', 'Confirmation of PR', 'Work Permit', 'Study Permit', 'Refugee Protection Claimant Doc'], 
            label: { en: 'Primary Identity Document', am: 'መታወቂያ ሰነድ አይነት', ti: 'ዓይነት መታወቒ' } 
        },
        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'mailing_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Mailing Address (For SIN Card)', am: 'የፖስታ አድራሻ (SIN የሚላክበት)', ti: 'ናይ ፖስታ ኣድራሻ (SIN ዝለኣከሉ)' } 
        },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],
    
    'ei_benefit': [
        // ===============================
        // SECTION 1: PERSONAL INFORMATION
        // ===============================
        { type: 'header', label: { en: 'Personal Information', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'sin_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Social Insurance Number (SIN)', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } 
        },
        { 
            name: 'date_of_birth', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } 
        },
        { 
            name: 'mother_maiden_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Mother\'s Maiden Name', am: 'የእናት የቤተሰብ ስም (ከጋብቻ በፊት)', ti: 'ሽም ኣደ (ቅድሚ መውስቦ)' } 
        },
        { 
            name: 'gender', 
            type: 'select', 
            required: true, 
            options: ['Male', 'Female', 'Another Gender'], 
            label: { en: 'Gender', am: 'ጾታ', ti: 'ጾታ' } 
        },

        // ===============================
        // SECTION 2: ADDRESS
        // ===============================
        { type: 'header', label: { en: 'Address (For Access Code)', am: 'አድራሻ (ኮድ የሚላክበት)', ti: 'ኣድራሻ (ኮድ ዝለኣከሉ)' } },

        { 
            name: 'applicant_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Mailing Address (Street, City, Postal Code)', am: 'የፖስታ አድራሻ', ti: 'ናይ ፖስታ ኣድራሻ' } 
        },

        // ===============================
        // SECTION 3: LAST EMPLOYER (MOST IMPORTANT)
        // ===============================
        { type: 'header', label: { en: 'Last Employment Details', am: 'የመጨረሻው ስራ ዝርዝር', ti: 'ዝርዝር ናይ መወዳእታ ስራሕ' } },

        { 
            name: 'last_employer_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Last Employer Name', am: 'የመጨረሻው አሰሪ ስም', ti: 'ስም ናይ መወዳእታ ኣሰራሒ' } 
        },
        { 
            name: 'first_day_worked', 
            type: 'date', 
            required: true, 
            label: { en: 'First Day Worked', am: 'የጀመሩበት ቀን', ti: 'ዝጀመርኩምሉ ዕለት' } 
        },
        { 
            name: 'last_day_worked', 
            type: 'date', 
            required: true, 
            label: { en: 'Last Day Worked', am: 'የመጨረሻ የስራ ቀን', ti: 'ዝወጻእኩምሉ ዕለት' } 
        },
        { 
            name: 'reason_for_separation', 
            type: 'select', 
            required: true, 
            options: [
                'Shortage of Work / Layoff',
                'Illness or Injury',
                'Pregnancy / Maternity',
                'Quit',
                'Fired / Dismissed',
                'Apprentice Training',
                'Other'
            ], 
            label: { en: 'Reason for Stopping', am: 'ስራ ያቆሙበት ምክንያት', ti: 'ምኽንያት ምቁራጽ ስራሕ' } 
        },
        { 
            name: 'return_to_work', 
            type: 'select', 
            options: ['Unknown', 'Yes', 'No'], 
            label: { en: 'Expect to return?', am: 'ይመለሳሉ ተብሎ ይጠበቃል?', ti: 'ክትምለሱ ትጽበዩ ዶ?' } 
        },

        // ===============================
        // SECTION 4: WORK HISTORY (REPEATER)
        // ===============================
        { type: 'header', label: { en: 'Other Employers (Last 52 Weeks)', am: 'ሌሎች አሰሪዎች (ባለፈው 1 ዓመት)', ti: 'ካልኦት ኣሰርሕቲ (ኣብ ዝሓለፈ 1 ዓመት)' } },

        { 
            name: 'work_history', 
            type: 'repeater', 
            label: { en: 'List all OTHER jobs in the last 52 weeks', am: 'ባለፉት 52 ሳምንታት የሰሩባቸውን ሌሎች ስራዎች ይዘርዝሩ', ti: 'ኣብ ዝሓለፈ 52 ሰሙናት ዝሰርሕኩምሎም ካልኦት ስራሓቲ ዘርዝሩ' },
            fields: [
                { name: 'employer_name', type: 'text', label: { en: 'Employer Name', am: 'የአሰሪ ስም', ti: 'ስም ኣሰራሒ' } },
                { name: 'start_date', type: 'date', label: { en: 'Start Date', am: 'የጀመሩበት', ti: 'ዝጀመርኩምሉ' } },
                { name: 'end_date', type: 'date', label: { en: 'End Date', am: 'ያበቃበት', ti: 'ዝወደኩምሉ' } }
            ]
        },

        // ===============================
        // SECTION 5: FINANCIAL & TAX
        // ===============================
        { type: 'header', label: { en: 'Financial Details', am: 'የገንዘብ መረጃ', ti: 'ፋይናንሳዊ ሓበሬታ' } },

        { 
            name: 'vacation_pay', 
            type: 'number', 
            label: { en: 'Vacation Pay Received ($)', am: 'የዕረፍት ክፍያ ($)', ti: 'ክፍሊት ዕረፍቲ ($)' } 
        },
        { 
            name: 'receiving_pension', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Receiving Pension (CPP, etc)?', am: 'ጡረታ ያገኛሉ?', ti: 'ጡረታ ትወስዱ ዶ?' } 
        },
        { 
            name: 'tax_preference', 
            type: 'select', 
            required: true, 
            options: ['Basic Personal Amount', 'Basic + Spousal Amount'], 
            label: { en: 'Income Tax Claim', am: 'የግብር አቆራረጥ', ti: 'ኣቆራርጻ ግብሪ' } 
        },

        // ===============================
        // SECTION 6: DIRECT DEPOSIT
        // ===============================
        { type: 'header', label: { en: 'Direct Deposit', am: 'ቀጥታ ክፍያ (ባንክ)', ti: 'ቀጥታ መውሮ (ባንኪ)' } },

        { 
            name: 'bank_institution_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Institution No. (3 digits)', am: 'የባንክ ቁጥር (3)', ti: 'ቁጽሪ ባንኪ (3)' },
            placeholder: { en: '003', am: '003', ti: '003' } 
        },
        { 
            name: 'bank_transit_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Transit No. (5 digits)', am: 'ትራንዚት ቁጥር (5)', ti: 'ትራንዚት ቁጽሪ (5)' },
            placeholder: { en: '12345', am: '12345', ti: '12345' } 
        },
        { 
            name: 'bank_account_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Account Number', am: 'የሂሳብ ቁጥር', ti: 'ቁጽሪ ሕሳብ' },
            placeholder: { en: '1234567', am: '1234567', ti: '1234567' } 
        },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],
    'oas': [
        // ===============================
        // SECTION 1: APPLICANT INFORMATION
        // ===============================
        { type: 'header', label: { en: 'Personal Details', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'sin_number', 
            type: 'text', 
            required: true, 
            label: { en: 'Social Insurance Number (SIN)', am: 'SIN ቁጥር', ti: 'SIN ቁጽሪ' } 
        },
        { 
            name: 'full_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Full Legal Name', am: 'ሙሉ ህጋዊ ስም', ti: 'ሙሉእ ሕጋዊ ስም' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'place_of_birth', 
            type: 'text', 
            required: true, 
            label: { en: 'Place of Birth (City, Country)', am: 'የትውልድ ቦታ', ti: 'ዝተወለድካሉ ቦታ' } 
        },

        // ===============================
        // SECTION 2: CONTACT & ADDRESS
        // ===============================
        { type: 'header', label: { en: 'Contact Information', am: 'አድራሻ', ti: 'ኣድራሻ' } },

        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'current_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ገዛ አድራሻ' } 
        },

        // ===============================
        // SECTION 3: CANADIAN RESIDENCY
        // ===============================
        { type: 'header', label: { en: 'Residency History', am: 'የነዋሪነት ታሪክ', ti: 'ታሪክ መንበሪ' } },

        { 
            name: 'status_in_canada', 
            type: 'select', 
            required: true, 
            options: ['Canadian Citizen', 'Permanent Resident'], 
            label: { en: 'Legal Status', am: 'ህጋዊ ሁኔታ', ti: 'ሕጋዊ ኩነታት' } 
        },
        { 
            name: 'date_entered_canada', 
            type: 'date', 
            required: true, 
            label: { en: 'First Date Entered Canada', am: 'ካናዳ የገቡበት ቀን (የመጀመሪያ)', ti: 'ናብ ካናዳ ዝኣተውሉ ዕለት' } 
        },
        { 
            name: 'lived_outside_canada', 
            type: 'select', 
            required: true, 
            options: ['No', 'Yes'], 
            label: { en: 'Have you lived outside Canada since age 18?', am: 'ከ18 ዓመትዎ በኋላ ከካናዳ ውጭ ኖረዋል?', ti: 'ካብ 18 ዓመትኩም ንደሓር ካብ ካናዳ ወጻኢ ዶ ኔርኩም?' } 
        },
        { 
            name: 'countries_lived', 
            type: 'textarea', 
            label: { en: 'If Yes: List Countries and Dates', am: 'አዎ ከሆነ፡ አገሮችን እና ቀኖችን ይጥቀሱ', ti: 'እወ እንተኮይኑ፡ ሃገራትን ዕለታትን ጥቀሱ' } 
        },

        // ===============================
        // SECTION 4: SPOUSE (FOR GIS BENEFIT)
        // ===============================
        { type: 'header', label: { en: 'Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } },

        { 
            name: 'marital_status', 
            type: 'select', 
            required: true, 
            options: ['Married', 'Single', 'Widowed', 'Divorced', 'Common-Law', 'Separated'], 
            label: { en: 'Current Marital Status', am: 'የጋብቻ ሁኔታ', ti: 'ኩነታት ሓዳር' } 
        },
        { 
            name: 'spouse_full_name', 
            type: 'text', 
            label: { en: 'Spouse Full Name (If married/common-law)', am: 'የባለቤት ሙሉ ስም', ti: 'ሙሉእ ስም መጻምድቲ' } 
        },
        { 
            name: 'spouse_dob', 
            type: 'date', 
            label: { en: 'Spouse Date of Birth', am: 'የባለቤት የትውልድ ቀን', ti: 'ዕለት ልደት መጻምድቲ' } 
        },
        { 
            name: 'spouse_sin', 
            type: 'text', 
            label: { en: 'Spouse SIN', am: 'የባለቤት SIN ቁጥር', ti: 'SIN ቁጽሪ መጻምድቲ' } 
        },

        // ===============================
        // SECTION 5: PAYMENT (DIRECT DEPOSIT)
        // ===============================
        { type: 'header', label: { en: 'Payment Details', am: 'ክፍያ (Direct Deposit)', ti: 'ክፍሊት (Direct Deposit)' } },

        { 
            name: 'bank_institution_number', 
            type: 'text', 
            label: { en: 'Institution No. (3 digits)', am: 'የባንክ ቁጥር (3)', ti: 'ቁጽሪ ባንኪ (3)' },
            placeholder: { en: '003', am: '003', ti: '003' } 
        },
        { 
            name: 'bank_transit_number', 
            type: 'text', 
            label: { en: 'Transit No. (5 digits)', am: 'ትራንዚት ቁጥር (5)', ti: 'ትራንዚት ቁጽሪ (5)' },
            placeholder: { en: '12345', am: '12345', ti: '12345' } 
        },
        { 
            name: 'bank_account_number', 
            type: 'text', 
            label: { en: 'Account Number', am: 'የሂሳብ ቁጥር', ti: 'ቁጽሪ ሕሳብ' } 
        },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],

    'air_ticket': [
        // ===============================
        // SECTION 1: FLIGHT DETAILS
        // ===============================
        { type: 'header', label: { en: 'Flight Details', am: 'የበረራ መረጃ', ti: 'ሓበሬታ በረራ' } },

        { 
            name: 'trip_type', 
            type: 'select', 
            required: true, 
            options: ['Round Trip', 'One Way'], 
            label: { en: 'Trip Type', am: 'የጉዞ ዓይነት', ti: 'ዓይነት ጉዕዞ' } 
        },
        { 
            name: 'departure_date', 
            type: 'date', 
            required: true, 
            label: { en: 'Departure Date', am: 'የሚሄዱበት ቀን', ti: 'ዝብገሱሉ ዕለት' } 
        },
        { 
            name: 'return_date', 
            type: 'date', 
            label: { en: 'Return Date (If Round Trip)', am: 'የሚመለሱበት ቀን (ደርሶ መልስ ከሆነ)', ti: 'ዝምለሱሉ ዕለት (ምምላስ እንተኾይኑ)' } 
        },
        { 
            name: 'departure_city', 
            type: 'text', 
            required: true, 
            label: { en: 'Departure City (From)', am: 'መነሻ ከተማ', ti: 'መበገሲ ከተማ' } 
        },
        { 
            name: 'destination_city', 
            type: 'text', 
            required: true, 
            label: { en: 'Destination City (To)', am: 'መድረሻ ከተማ', ti: 'መዕለቢ ከተማ' } 
        },

        // ===============================
        // SECTION 2: PASSENGERS
        // ===============================
        { type: 'header', label: { en: 'Traveler Information', am: 'የመንገደኞች መረጃ', ti: 'ሓበሬታ ተጓዓዝቲ' } },

        { 
            name: 'travelers_list', 
            type: 'repeater', 
            label: { en: 'List All Passengers (Name & DOB)', am: 'የሁሉንም መንገደኞች ስም እና ልደት ቀን ያስገቡ', ti: 'ናይ ኩሎም ተጓዓዝቲ ስምን ዕለተ ልደትን የእትዉ' },
            fields: [
                { name: 'full_name', type: 'text', label: { en: 'Full Name (As per Passport)', am: 'ሙሉ ስም (እንደ ፓስፖርቱ)', ti: 'ሙሉእ ስም (ከምቲ ፓስፖርት)' } },
                { name: 'dob', type: 'date', label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለት ልደት' } }
            ]
        },

        // ===============================
        // SECTION 3: BOOKING CONTACT
        // ===============================
        // CRITICAL: Who do we send the ticket to?
        { type: 'header', label: { en: 'Booking Contact', am: 'ቲኬት ተቀባይ', ti: 'ቲኬት ተቀባሊ' } },

        { 
            name: 'contact_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Contact Person Name', am: 'ቲኬት የሚቀበለው ሰው ስም', ti: 'ቲኬት ዝቅበል ሰብ ስም' } 
        },
        { 
            name: 'contact_phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'contact_email', 
            type: 'email', 
            required: true, 
            label: { en: 'Email to send ticket', am: 'ቲኬት የሚላክበት ኢሜይል', ti: 'ቲኬት ዝለኣከሉ ኢሜይል' } 
        },

        // ===============================
        // SECTION 4: PREFERENCES
        // ===============================
        { type: 'header', label: { en: 'Preferences', am: 'ምርጫዎች', ti: 'ምርጫታት' } },

        { 
            name: 'airline_preference', 
            type: 'text', 
            label: { en: 'Preferred Airline (Optional)', am: 'የሚመርጡት አየር መንገድ (ካለ)', ti: 'ትመርጽዎ መንገዲ ኣየር (እንተልዩ)' } 
        },
        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { 
                en: 'Special Requests (Meals, Wheelchair, etc.)', 
                am: 'ልዩ ጥያቄ (ምግብ፣ ዊልቸር...)', 
                ti: 'ፍሉይ ጠለብ (መግቢ፣ ዊልቸር...)' 
            } 
        }
    ],

   'lost_passport': [
        // ===============================
        // SECTION 1: APPLICATION TYPE
        // ===============================
        { type: 'header', label: { en: 'Application Details', am: 'የማመልከቻው ዝርዝር', ti: 'ዝርዝር መመልከቲ' } },

        { 
            name: 'application_type', 
            type: 'select', 
            required: true, 
            options: ['Replace Lost/Stolen Passport', 'Replace Damaged Passport'], 
            label: { en: 'Reason for Application', am: 'የማመልከቻው ምክንያት', ti: 'ምኽንያት መመልከቲ' } 
        },
        { 
            name: 'passport_validity', 
            type: 'select', 
            required: true, 
            options: ['5 Years', '10 Years'], 
            label: { en: 'New Passport Validity', am: 'አዲሱ ፓስፖርት የሚያገለግለው', ti: 'ሓድሽ ፓስፖርት ዘገልግለሉ' } 
        },

        // ===============================
        // SECTION 2: PERSONAL INFORMATION
        // ===============================
        { type: 'header', label: { en: 'Personal Information', am: 'የግል መረጃ', ti: 'ውልቃዊ ሓበሬታ' } },

        { 
            name: 'surname', 
            type: 'text', 
            required: true, 
            label: { en: 'Surname (Last Name)', am: 'የቤተሰብ ስም', ti: 'ሽም ኣባሓጎ' } 
        },
        { 
            name: 'given_names', 
            type: 'text', 
            required: true, 
            label: { en: 'Given Names', am: 'የክርስትና ስም', ti: 'ስም' } 
        },
        { 
            name: 'dob', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Birth', am: 'የትውልድ ቀን', ti: 'ዕለተ ልደት' } 
        },
        { 
            name: 'birth_place', 
            type: 'text', 
            required: true, 
            label: { en: 'Place of Birth (City, Country)', am: 'የትውልድ ቦታ', ti: 'ዝተወለድካሉ ቦታ' } 
        },
        { 
            name: 'sex', 
            type: 'select', 
            required: true, 
            options: ['F', 'M', 'X'], 
            label: { en: 'Sex', am: 'ጾታ', ti: 'ጾታ' } 
        },
        { 
            name: 'eye_color', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Hazel', 'Blue', 'Green', 'Grey'], 
            label: { en: 'Eye Colour', am: 'የአይን ቀለም', ti: 'ሕብሪ ዓይኒ' } 
        },
        { 
            name: 'hair_color', 
            type: 'select', 
            required: true, 
            options: ['Black', 'Dark Brown', 'Brown', 'Blond', 'Red', 'Grey', 'White', 'Bald'], 
            label: { en: 'Hair Colour', am: 'የፀጉር ቀለም', ti: 'ሕብሪ ፀጉሪ' } 
        },
        { 
            name: 'height', 
            type: 'text', 
            required: true, 
            label: { en: 'Height (cm)', am: 'ቁመት (ሴሜ)', ti: 'ቁመት (ሴሜ)' },
            placeholder: { en: '175', am: '175', ti: '175' }
        },

        // ===============================
        // SECTION 3: LOST / STOLEN DETAILS
        // ===============================
        { type: 'header', label: { en: 'Details of Loss/Theft', am: 'የጠፋበት/የተሰረቀበት ዝርዝር', ti: 'ዝርዝር ምጥፋእ/ምስራቕ' } },

        { 
            name: 'lost_passport_number', 
            type: 'text', 
            label: { en: 'Lost Passport Number (if known)', am: 'የጠፋው ፓስፖርት ቁጥር (የሚያውቁት ከሆነ)', ti: 'ቁጽሪ ናይ ዝጠፍአ ፓስፖርት (ትፈልጥዎ እንተኾንኩም)' } 
        },
        { 
            name: 'date_of_loss', 
            type: 'date', 
            required: true, 
            label: { en: 'Date of Loss/Theft', am: 'የጠፋበት ወይም የተሰረቀበት ቀን', ti: 'ዝጠፍኣሉ ወይ ዝተሰርቀሉ ዕለት' } 
        },
        { 
            name: 'location_of_loss', 
            type: 'text', 
            required: true, 
            label: { en: 'Location (City, Country)', am: 'የጠፋበት ቦታ (ከተማ፣ አገር)', ti: 'ዝጠፍኣሉ ቦታ (ከተማ፣ ሃገር)' } 
        },
        { 
            name: 'police_report_filed', 
            type: 'select', 
            required: true, 
            options: ['Yes', 'No'], 
            label: { en: 'Did you file a police report?', am: 'ለፖሊስ አሳውቀዋል?', ti: 'ንፖሊስ ሓቢርኩም ዶ?' } 
        },
        { 
            name: 'police_file_number', 
            type: 'text', 
            label: { en: 'Police File Number (If Yes)', am: 'የፖሊስ መዝገብ ቁጥር', ti: 'ናይ ፖሊስ መዝገብ ቁጽሪ' } 
        },
        { 
            name: 'loss_explanation', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Explain EXACTLY how it was lost/stolen', am: 'እንዴት እንደጠፋ በዝርዝር ያስረዱ', ti: 'ብኸመይ ከምዝጠፍአ ብዝርዝር ግለጹ' },
            placeholder: { en: 'I was on the subway at 5 PM...', am: '', ti: '' }
        },

        // ===============================
        // SECTION 4: CITIZENSHIP & ID
        // ===============================
        { type: 'header', label: { en: 'Citizenship & ID', am: 'ዜግነት እና መታወቂያ', ti: 'ዜግነትን መታወቕን' } },

        { 
            name: 'citizenship_doc_type', 
            type: 'select', 
            required: true, 
            options: ['Birth Certificate (Canada)', 'Citizenship Certificate'], 
            label: { en: 'Proof of Citizenship', am: 'የዜግነት ማረጋገጫ', ti: 'መረጋገጺ ዜግነት' } 
        },
        { 
            name: 'id_type', 
            type: 'text', 
            required: true, 
            label: { en: 'Supporting ID (e.g. Driver\'s License)', am: 'መታወቂያ (መንጃ ፈቃድ)', ti: 'መታወቒ (መንጃ ፍቃድ)' } 
        },
        { 
            name: 'id_number', 
            type: 'text', 
            required: true, 
            label: { en: 'ID Number', am: 'የመታወቂያ ቁጥር', ti: 'ቁጽሪ መታወቒ' } 
        },

        // ===============================
        // SECTION 5: CONTACT & ADDRESS
        // ===============================
        { type: 'header', label: { en: 'Contact Info', am: 'አድራሻ', ti: 'ኣድራሻ' } },

        { 
            name: 'phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Phone Number', am: 'ስልክ ቁጥር', ti: 'ቁጽሪ ተሌፎን' } 
        },
        { 
            name: 'home_address', 
            type: 'textarea', 
            required: true, 
            label: { en: 'Current Home Address', am: 'የአሁን መኖሪያ አድራሻ', ti: 'ናይ ሕጂ ኣድራሻ' } 
        },

        // ===============================
        // SECTION 6: GUARANTOR
        // ===============================
        { type: 'header', label: { en: 'Guarantor', am: 'ዋስ', ti: 'ዋሕስ' } },

        { 
            name: 'guarantor_name', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Name', am: 'የዋስ ስም', ti: 'ስም ዋሕስ' } 
        },
        { 
            name: 'guarantor_ppt_num', 
            type: 'text', 
            required: true, 
            label: { en: 'Guarantor Passport #', am: 'የዋስ ፓስፖርት ቁጥር', ti: 'ቁጽሪ ፓስፖርት ዋሕስ' } 
        },
        { 
            name: 'guarantor_issue_date', 
            type: 'date', 
            required: true, 
            label: { en: 'Passport Issue Date', am: 'ፓስፖርቱ የተሰጠበት ቀን', ti: 'ፓስፖርት ዝተወሃበሉ ዕለት' } 
        },
        { 
            name: 'guarantor_phone', 
            type: 'tel', 
            required: true, 
            label: { en: 'Guarantor Phone', am: 'የዋስ ስልክ', ti: 'ቁጽሪ ዋሕስ' } 
        },

        // ===============================
        // SECTION 7: REFERENCES
        // ===============================
        { type: 'header', label: { en: 'References', am: 'ምስክሮች', ti: 'ምስክሮች' } },

        { name: 'ref1_name', type: 'text', required: true, label: { en: 'Reference 1 Name', am: 'ምስክር 1 ስም', ti: 'ምስክር 1 ስም' } },
        { name: 'ref1_phone', type: 'tel', required: true, label: { en: 'Reference 1 Phone', am: 'ምስክር 1 ስልክ', ti: 'ምስክር 1 ስልክ' } },
        { name: 'ref2_name', type: 'text', required: true, label: { en: 'Reference 2 Name', am: 'ምስክር 2 ስም', ti: 'ምስክር 2 ስም' } },
        { name: 'ref2_phone', type: 'tel', required: true, label: { en: 'Reference 2 Phone', am: 'ምስክር 2 ስልክ', ti: 'ምስክር 2 ስልክ' } },

        { 
            name: 'additionalInformation', 
            type: 'textarea', 
            label: { en: 'Additional Notes', am: 'ተጨማሪ ማስታወሻ', ti: 'ተወሳኪ ሓበሬታ' } 
        }
    ],
};

// ... (Make sure you copied the whole specificFields object into here) ...
