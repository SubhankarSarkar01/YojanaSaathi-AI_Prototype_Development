import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { i18n } = useTranslation()

  return (
    <div className="min-h-screen -mx-4 -mt-4 -mb-4">
      {/* Full Screen Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${window.location.origin}/hero-background.jpg)`,
          }}
        >
          {/* Darker overlay to match reference */}
          <div className="absolute inset-0 bg-slate-900/75"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Main Heading - Exact match to reference */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {i18n.language === 'hi' 
                ? 'योजना साथी AI के साथ नागरिकों को सशक्त बनाना'
                : 'Empowering Citizens with Yojana Saathi AI'}
            </h1>
            
            {/* Subtitle - Exact match to reference */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-normal mb-10 max-w-3xl mx-auto">
              {i18n.language === 'hi'
                ? 'अपनी भाषा में सरकारी योजनाओं को आसानी से खोजें और आवेदन करें।'
                : 'Find and apply for government schemes effortlessly in your own language.'}
            </p>
            
            {/* CTA Buttons - Exact match to reference */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Blue Button */}
              <Link 
                to="/schemes" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all shadow-lg"
              >
                {i18n.language === 'hi' ? 'सभी योजनाएं देखें' : 'Browse All Schemes'}
              </Link>
              
              {/* Orange Button */}
              <Link 
                to="/profile/create" 
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition-all shadow-lg"
              >
                {i18n.language === 'hi' ? 'प्रोफ़ाइल बनाएं' : 'Create Profile'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
