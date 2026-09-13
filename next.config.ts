import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/html/home.html' },
        { source: '/our-story', destination: '/html/our-story.html' },
        { source: '/faq', destination: '/html/faq.html' },
        { source: '/contactus', destination: '/html/contactus.html' },
        { source: '/directors', destination: '/html/directors.html' },
        { source: '/overview', destination: '/html/overview.html' },
        { source: '/apply', destination: '/html/apply.html' },
        { source: '/apply-2', destination: '/html/apply-2.html' },
        { source: '/intenpositions', destination: '/html/intenpositions.html' },
        { source: '/new-index-1', destination: '/html/new-index-1.html' },
        { source: '/new-page-2', destination: '/html/new-page-2.html' },
        { source: '/photo-gallery-1', destination: '/html/photo-gallery-1.html' },
        { source: '/sawarly', destination: '/html/sawarly.html' },
        { source: '/updates', destination: '/html/updates.html' },
        { source: '/inscription', destination: '/html/inscription.html' },
        { source: '/partner-1', destination: '/html/partner-1.html' },
        { source: '/schools', destination: '/html/schools.html' },
        { source: '/internship-application', destination: '/html/internship-application.html' },
        // Intercept form submissions
        { source: '/api/form/SaveFormSubmission', destination: '/api/intercept-form' },
        { source: '/universal/:path*', destination: 'https://www.lightscameralearn.org/universal/:path*' }
      ],
      afterFiles: [],
      fallback: [
        { source: '/api/:path*', destination: 'https://www.lightscameralearn.org/api/:path*' }
      ]
    };
  },
};

export default nextConfig;
