-- Insert sample schemes for MySQL
INSERT INTO schemes (scheme_id, scheme_code, name_en, name_hi, name_ta, name_te, name_bn, description_en, description_hi, category, level, department, benefit_amount, is_ongoing) VALUES
(UUID(), 'PM-KISAN', 'PM-KISAN Samman Nidhi', 'पीएम-किसान सम्मान निधि', 'பிரதமர் கிசான் சம்மான் நிதி', 'పిఎం-కిసాన్ సమ్మాన్ నిధి', 'পিএম-কিষাণ সম্মান নিধি', 'Direct income support of ₹6000 per year to small and marginal farmers', 'छोटे और सीमांत किसानों को प्रति वर्ष ₹6000 की प्रत्यक्ष आय सहायता', 'Agriculture', 'Central', 'Ministry of Agriculture', 6000.00, TRUE),

(UUID(), 'POST-MATRIC', 'Post Matric Scholarship for SC Students', 'एससी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति', 'எஸ்சி மாணவர்களுக்கான பிந்தைய மெட்ரிக் உதவித்தொகை', 'ఎస్సీ విద్యార్థులకు పోస్ట్ మెట్రిక్ స్కాలర్‌షిప్', 'এসসি শিক্ষার্থীদের জন্য পোস্ট ম্যাট্রিক বৃত্তি', 'Financial assistance for SC students pursuing higher education', 'उच्च शिक्षा प्राप्त करने वाले एससी छात्रों के लिए वित्तीय सहायता', 'Education', 'Central', 'Ministry of Social Justice', 50000.00, TRUE),

(UUID(), 'AYUSHMAN', 'Ayushman Bharat - PM-JAY', 'आयुष्मान भारत - पीएम-जेएवाई', 'ஆயுஷ்மான் பாரத் - பிஎம்-ஜேஏஒய்', 'ఆయుష్మాన్ భారత్ - పిఎం-జేఏవై', 'আয়ুষ্মান ভারত - পিএম-জেএওয়াই', 'Health insurance coverage of ₹5 lakh per family per year', 'प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा कवरेज', 'Healthcare', 'Central', 'Ministry of Health', 500000.00, TRUE),

(UUID(), 'PM-AWAS', 'Pradhan Mantri Awas Yojana', 'प्रधानमंत्री आवास योजना', 'பிரதமர் ஆவாஸ் யோஜனா', 'ప్రధాన మంత్రి ఆవాస్ యోజన', 'প্রধানমন্ত্রী আবাস যোজনা', 'Housing for all with financial assistance for construction', 'निर्माण के लिए वित्तीय सहायता के साथ सभी के लिए आवास', 'Housing', 'Central', 'Ministry of Housing', 120000.00, TRUE),

(UUID(), 'MGNREGA', 'Mahatma Gandhi NREGA', 'महात्मा गांधी नरेगा', 'மகாத்மா காந்தி என்ஆர்இஜிஏ', 'మహాత్మా గాంధీ ఎన్ఆర్ఇజిఏ', 'মহাত্মা গান্ধী এনআরইজিএ', '100 days of guaranteed wage employment in rural areas', 'ग्रामीण क्षेत्रों में 100 दिनों की गारंटीकृत मजदूरी रोजगार', 'Employment', 'Central', 'Ministry of Rural Development', 20000.00, TRUE);
