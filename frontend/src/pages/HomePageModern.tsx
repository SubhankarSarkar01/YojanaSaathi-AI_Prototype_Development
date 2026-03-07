import { useTranslation } from 'react-i18next'
import { Bot, Sparkles, FileText, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export default function HomePageModern() {
  const { i18n } = useTranslation()
  const [schemes, setSchemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real schemes from database
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await apiClient.get('/schemes')
        if (response.data.status === 'success') {
          setSchemes(response.data.data.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching schemes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [])

  const features = [
    {
      icon: <Sparkles className="w-10 h-10" />,
      iconBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
      title: i18n.language === 'hi' ? 'योजनाएं खोजें और आवेदन करें' : i18n.language === 'bn' ? 'প্রকল্প খুঁজুন এবং আবেদন করুন' : 'Find & Apply for Schemes',
      description: i18n.language === 'hi' 
        ? 'अपनी पात्रता के आधार पर सरकारी योजनाओं को खोजें और तुरंत आवेदन करें'
        : i18n.language === 'bn'
        ? 'আপনার যোগ্যতার ভিত্তিতে সরকারি প্রকল্প খুঁজুন এবং তাৎক্ষণিক আবেদন করুন'
        : 'Discover government schemes based on your eligibility and apply instantly',
      label: i18n.language === 'hi' ? 'योजना खोज' : i18n.language === 'bn' ? 'প্রকল্প অনুসন্ধান' : 'Scheme Discovery',
      link: '/schemes'
    },
    {
      icon: <Bot className="w-10 h-10" />,
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-500',
      title: i18n.language === 'hi' ? 'AI सहायक से पूछें' : i18n.language === 'bn' ? 'AI সহায়ককে জিজ্ঞাসা করুন' : 'Ask AI Assistant',
      description: i18n.language === 'hi'
        ? 'योजनाओं, पात्रता और आवेदन प्रक्रिया के बारे में AI से सवाल पूछें'
        : i18n.language === 'bn'
        ? 'প্রকল্প, যোগ্যতা এবং আবেদন প্রক্রিয়া সম্পর্কে AI-কে প্রশ্ন করুন'
        : 'Get instant answers about schemes, eligibility, and application process from AI',
      label: i18n.language === 'hi' ? 'AI सहायता' : i18n.language === 'bn' ? 'AI সহায়তা' : 'AI Assistance',
      link: '/schemes',
      action: 'openChatbot'
    },
    {
      icon: <FileText className="w-10 h-10" />,
      iconBg: 'bg-gradient-to-br from-green-400 to-green-500',
      title: i18n.language === 'hi' ? 'अपनी प्रोफ़ाइल बनाएं' : i18n.language === 'bn' ? 'আপনার প্রোফাইল তৈরি করুন' : 'Create Your Profile',
      description: i18n.language === 'hi'
        ? 'अपनी जानकारी सहेजें और व्यक्तिगत योजना सिफारिशें प्राप्त करें'
        : i18n.language === 'bn'
        ? 'আপনার তথ্য সংরক্ষণ করুন এবং ব্যক্তিগত প্রকল্প সুপারিশ পান'
        : 'Save your information and get personalized scheme recommendations',
      label: i18n.language === 'hi' ? 'प्रोफ़ाइल प्रबंधन' : i18n.language === 'bn' ? 'প্রোফাইল ব্যবস্থাপনা' : 'Profile Management',
      link: '/profile/create'
    },
  ]

  const benefits = [
    i18n.language === 'hi' ? '13 भारतीय भाषाओं में उपलब्ध' : i18n.language === 'bn' ? '১৩টি ভারতীয় ভাষায় উপলব্ধ' : 'Available in 13 Indian languages',
    i18n.language === 'hi' ? 'आवाज से खोज सुविधा' : i18n.language === 'bn' ? 'ভয়েস সার্চ সক্ষম' : 'Voice search enabled',
    i18n.language === 'hi' ? 'AI-संचालित सिफारिशें' : i18n.language === 'bn' ? 'AI-চালিত সুপারিশ' : 'AI-powered recommendations',
    i18n.language === 'hi' ? 'सुरक्षित दस्तावेज़ अपलोड' : i18n.language === 'bn' ? 'নিরাপদ নথি আপলোড' : 'Secure document upload',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Background Image */}
      <section className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Background Image with Overlay - Only for Hero Section */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${window.location.origin}/hero-background.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Heading - Match reference exactly */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {i18n.language === 'hi' 
              ? 'योजना साथी AI के साथ नागरिकों को सशक्त बनाना'
              : i18n.language === 'bn'
              ? 'যোজনা সাথী AI এর সাথে নাগরিকদের ক্ষমতায়ন'
              : 'Empowering Citizens with Yojana Saathi AI'}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            {i18n.language === 'hi'
              ? 'अपनी भाषा में सरकारी योजनाओं को आसानी से खोजें और आवेदन करें।'
              : i18n.language === 'bn'
              ? 'আপনার নিজের ভাষায় সহজেই সরকারি প্রকল্প খুঁজুন এবং আবেদন করুন।'
              : 'Find and apply for government schemes effortlessly in your own language.'}
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                onClick={(e) => {
                  if (feature.action === 'openChatbot') {
                    e.preventDefault()
                    // Trigger chatbot open (you'll need to implement this)
                    const chatbotButton = document.querySelector('[data-chatbot-trigger]') as HTMLElement
                    if (chatbotButton) chatbotButton.click()
                  }
                }}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="text-sm font-semibold text-gray-400 group-hover:text-orange-500 transition-colors">
                  {feature.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/schemes"
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {i18n.language === 'hi' ? 'योजनाएं खोजें' : 'Browse Schemes'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/profile/create"
              className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-300"
            >
              {i18n.language === 'hi' ? 'प्रोफ़ाइल बनाएं' : 'Create Profile'}
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Category Section with Auto-Slide */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          {i18n.language === 'hi' ? 'श्रेणी के अनुसार ब्राउज़ करें' : i18n.language === 'bn' ? 'বিভাগ অনুসারে ব্রাউজ করুন' : 'Browse by Category'}
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll">
            {/* Category Cards - Duplicated for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6">
                {/* Employment */}
                <Link
                  to="/schemes?category=Employment"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'रोजगार' : i18n.language === 'bn' ? 'কর্মসংস্থান' : 'Employment'}
                  </h3>
                </Link>

                {/* Housing */}
                <Link
                  to="/schemes?category=Housing"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'आवास' : i18n.language === 'bn' ? 'আবাসন' : 'Housing'}
                  </h3>
                </Link>

                {/* Social Welfare */}
                <Link
                  to="/schemes?category=Social Welfare"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">❤️</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'सामाजिक कल्याण' : i18n.language === 'bn' ? 'সামাজিক কল্যাণ' : 'Social Welfare'}
                  </h3>
                </Link>

                {/* Agriculture */}
                <Link
                  to="/schemes?category=Agriculture"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🌾</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'कृषि' : i18n.language === 'bn' ? 'কৃষি' : 'Agriculture'}
                  </h3>
                </Link>

                {/* Education */}
                <Link
                  to="/schemes?category=Education"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'शिक्षा' : i18n.language === 'bn' ? 'শিক্ষা' : 'Education'}
                  </h3>
                </Link>

                {/* Healthcare */}
                <Link
                  to="/schemes?category=Healthcare"
                  className="group flex-shrink-0 w-40 bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🏥</span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {i18n.language === 'hi' ? 'स्वास्थ्य' : i18n.language === 'bn' ? 'স্বাস্থ্যসেবা' : 'Healthcare'}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Schemes Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            {i18n.language === 'hi' ? 'लोकप्रिय योजनाएं' : i18n.language === 'bn' ? 'জনপ্রিয় প্রকল্প' : 'Trending Schemes'}
          </h2>
          <Link
            to="/schemes"
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 group"
          >
            {i18n.language === 'hi' ? 'सभी देखें' : i18n.language === 'bn' ? 'সব দেখুন' : 'View All'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <Link
                key={scheme.scheme_id}
                to={`/schemes/${scheme.scheme_id}`}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
                      {scheme.is_ongoing ? (i18n.language === 'hi' ? 'सक्रिय' : 'Active') : (i18n.language === 'hi' ? 'निष्क्रिय' : 'Inactive')}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {i18n.language === 'hi' ? scheme.name_hi : scheme.name_en}
                    </h3>
                  </div>
                  <div className="text-3xl ml-3">
                    {scheme.category === 'Agriculture' ? '🌾' :
                     scheme.category === 'Education' ? '📚' :
                     scheme.category === 'Healthcare' || scheme.category === 'Health' ? '🏥' :
                     scheme.category === 'Employment' ? '💼' :
                     scheme.category === 'Housing' ? '🏠' : '📋'}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {i18n.language === 'hi' ? scheme.description_hi : scheme.description_en}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {i18n.language === 'hi' ? 'लाभ राशि' : 'Benefit Amount'}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{parseFloat(scheme.benefit_amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-orange-100">
                {i18n.language === 'hi' ? 'सरकारी योजनाएं' : i18n.language === 'bn' ? 'সরকারি প্রকল্প' : 'Government Schemes'}
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">
                {i18n.language === 'hi' ? 'सक्रिय उपयोगकर्ता' : i18n.language === 'bn' ? 'সক্রিয় ব্যবহারকারী' : 'Active Users'}
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-orange-100">
                {i18n.language === 'hi' ? 'आवेदन संसाधित' : i18n.language === 'bn' ? 'আবেদন প্রক্রিয়াকৃত' : 'Applications Processed'}
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">13</div>
              <div className="text-orange-100">
                {i18n.language === 'hi' ? 'भाषाएं समर्थित' : i18n.language === 'bn' ? 'ভাষা সমর্থিত' : 'Languages Supported'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {i18n.language === 'hi' ? 'आज ही शुरू करें' : i18n.language === 'bn' ? 'আজই শুরু করুন' : 'Get Started Today'}
          </h2>
          <p className="text-gray-600 mb-8">
            {i18n.language === 'hi'
              ? 'अपनी प्रोफ़ाइल बनाएं और अपने लिए सही योजनाएं खोजें'
              : i18n.language === 'bn'
              ? 'আপনার প্রোফাইল তৈরি করুন এবং আপনার জন্য সঠিক প্রকল্প আবিষ্কার করুন'
              : 'Create your profile and discover the right schemes for you'}
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {i18n.language === 'hi' ? 'अभी पंजीकरण करें' : i18n.language === 'bn' ? 'এখনই নিবন্ধন করুন' : 'Register Now'}
          </Link>
        </div>
      </section>
    </div>
  )
}
