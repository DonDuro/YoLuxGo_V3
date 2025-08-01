import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { Smartphone, Download, Apple } from "lucide-react";
import { SiGoogleplay } from "react-icons/si";

export function QRCodeSection() {
  const [iosQR, setIosQR] = useState<string>("");
  const [androidQR, setAndroidQR] = useState<string>("");
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  // Mobile web app URL - fully responsive web application
  const mobileAppUrl = window.location.origin + "/mobile";
  const iosAppUrl = mobileAppUrl; // Mobile-optimized web app
  const androidAppUrl = mobileAppUrl; // Mobile-optimized web app

  // Device detection
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  useEffect(() => {
    // Generate QR codes for both platforms
    QRCode.toDataURL(iosAppUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#0a1a2f", // Navy
        light: "#fdfdfb", // Cream
      },
    }).then(setIosQR);

    QRCode.toDataURL(androidAppUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#0a1a2f", // Navy
        light: "#fdfdfb", // Cream
      },
    }).then(setAndroidQR);
  }, [iosAppUrl, androidAppUrl]);

  return (
    <section className="py-24 bg-gradient-to-br from-cream via-white to-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-6">
            <Smartphone className="w-8 h-8 text-gold mr-3" />
            <h2 className="font-serif text-4xl font-bold text-navy">
              YoLuxGo<span className="text-gold text-xs align-super">™</span> Mobile Platform
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Experience discreet luxury on the go. Access the mobile-optimized YoLuxGo<span className="text-gold text-xs align-super">™</span> platform 
            for secure bookings, real-time tracking, and premium concierge services.
          </p>
        </motion.div>

        {/* Device-specific QR Code display */}
        <div className="max-w-4xl mx-auto">
          {/* Show both on desktop */}
          {!isAndroid && !isIOS && (
            <div className="grid md:grid-cols-2 gap-12">
              {/* iOS Section */}
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-center mb-6">
                    <Apple className="w-8 h-8 text-gray-800 mr-3" />
                    <h3 className="font-serif text-2xl font-bold text-navy">iOS Access</h3>
                  </div>
                  
                  {iosQR ? (
                    <div className="mb-6">
                      <img 
                        src={iosQR} 
                        alt="iOS App QR Code" 
                        className="mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-50 h-50 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    Scan with your iPhone camera or check availability
                  </p>
                  
                  <motion.button
                    className="bg-black/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                    disabled
                  >
                    <div className="flex items-center justify-center">
                      <Apple className="w-4 h-4 mr-2" />
                      Coming Soon - App Store
                    </div>
                  </motion.button>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    App Store: Coming Soon
                  </div>
                </div>
              </motion.div>

              {/* Android Section - Desktop */}
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-center mb-6">
                    <SiGoogleplay className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="font-serif text-2xl font-bold text-navy">Android Access</h3>
                  </div>
                  
                  {androidQR ? (
                    <div className="mb-6">
                      <img 
                        src={androidQR} 
                        alt="Android App QR Code" 
                        className="mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-50 h-50 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    Scan with your Android camera or check availability
                  </p>
                  
                  <div className="space-y-3">
                    <motion.button
                      className="bg-green-600/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <SiGoogleplay className="w-4 h-4 mr-2" />
                        Coming Soon - Google Play
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="bg-navy/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Coming Soon - APK Download
                      </div>
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <div>Google Play: Coming Soon</div>
                    <div>APK: Coming Soon</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Android-specific view - show only when on Android */}
          {isAndroid && (
            <div className="max-w-md mx-auto">
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-center mb-6">
                    <SiGoogleplay className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="font-serif text-2xl font-bold text-navy">Android Access</h3>
                  </div>
                  
                  {androidQR ? (
                    <div className="mb-6">
                      <img 
                        src={androidQR} 
                        alt="Android App QR Code" 
                        className="mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-50 h-50 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    Scan with your Android camera or check availability
                  </p>
                  
                  <div className="space-y-3">
                    <motion.button
                      className="bg-green-600/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <SiGoogleplay className="w-4 h-4 mr-2" />
                        Coming Soon - Google Play
                      </div>
                    </motion.button>
                    
                    <motion.button
                      className="bg-navy/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                      disabled
                    >
                      <div className="flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Coming Soon - APK Download
                      </div>
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <div>Google Play: Coming Soon</div>
                    <div>APK: Coming Soon</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* iOS-specific view - show only when on iOS */}
          {isIOS && (
            <div className="max-w-md mx-auto">
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-center mb-6">
                    <Apple className="w-8 h-8 text-gray-800 mr-3" />
                    <h3 className="font-serif text-2xl font-bold text-navy">iOS Access</h3>
                  </div>
                  
                  {iosQR ? (
                    <div className="mb-6">
                      <img 
                        src={iosQR} 
                        alt="iOS App QR Code" 
                        className="mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-50 h-50 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    Scan with your iPhone camera or check availability
                  </p>
                  
                  <motion.button
                    className="bg-black/50 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-colors duration-200 w-full"
                    disabled
                  >
                    <div className="flex items-center justify-center">
                      <Apple className="w-4 h-4 mr-2" />
                      Coming Soon - App Store
                    </div>
                  </motion.button>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    App Store: Coming Soon
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* APK Download Instructions */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gold/10 rounded-lg p-6 max-w-3xl mx-auto">
            <div className="text-gold text-2xl mb-3">📱</div>
            <h3 className="font-serif text-lg font-medium text-navy mb-4">
              Mobile App Development in Progress
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="text-center">
                <div className="font-medium text-navy mb-2">Step 1</div>
                <p>Native iOS and Android apps are currently in development</p>
              </div>
              <div className="text-center">
                <div className="font-medium text-navy mb-2">Step 2</div>
                <p>Meanwhile, enjoy the full mobile-optimized web experience</p>
              </div>
              <div className="text-center">
                <div className="font-medium text-navy mb-2">Step 3</div>
                <p>We'll notify you when the native apps become available</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}