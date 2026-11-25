/**
 * Portfolio Configuration (Single Source of Truth)
 * ------------------------------------------------
 * Edit ONLY this file to update your profile, About Me, Featured & My Work
 * projects, skills, education, certifications, experience, or contact links.
 *
 * Automatic Behavior:
 * - Projects marked `featured: true` are highlighted in the Featured Projects
 *   section directly after About Me.
 * - While `projects` is empty ([]), the "My Work" section stays visible and
 *   displays clean preview layouts for a Flutter app and a website.
 * - While `experience` is empty ([]), the Experience section stays hidden.
 * - Only non-empty contact links are displayed publicly.
 */

const portfolioData = {
  profile: {
    name: "Ahmed Gamal Saeed",
    shortName: "Ahmed G. Saeed",
    role: "Software Engineer",
    location: "Giza, Egypt",
    graduationYear: "2026",
    tagline: "I build mobile applications with Flutter and develop modern web experiences.",
    specialty: "Flutter Mobile Applications & Web Development",
    photo: "assets/images/ahmed-headshot.png",

    // Verified contact details (CV remains hidden):
    email: "gamal6507@gmail.com",
    phone: "+201095930009",
    whatsappSameAsPhone: true,
    cvUrl: "",
    links: {
      github: "https://github.com/gamal6507-ops",
      linkedin: "https://www.linkedin.com/in/ahmed-gamal-saeed-717b54450/"
    },

    about: {
      eyebrow: "About Me",
      heading: "Engineering Digital Experiences.",
      paragraphs: [
        "I'm Ahmed Gamal Saeed, a Software Engineer and a 2026 Management Information Systems graduate based in Giza, Egypt, focused on cross-platform mobile and web engineering.",
        "I design and build responsive user interfaces alongside structured backend integrations, prioritizing practical workflows and bilingual English and Arabic support."
      ],
      facts: [
        { label: "Location", value: "Giza, Egypt" },
        { label: "Graduation", value: "Class of 2026" },
        { label: "Focus", value: "Mobile & Web" }
      ]
    },

    featuredSection: {
      eyebrow: "Featured Projects",
      heading: "Selected Highlights",
      subtitle:
        "A closer look at my flagship Flutter full-stack application and live production e-commerce website."
    },

    skills: {
      eyebrow: "Technical Skills",
      heading: "Technologies & Tools",
      subtitle:
        "Core languages, frameworks, data platforms, and tooling across mobile and web development.",
      groups: [
        {
          title: "Mobile Development",
          icon: "phone",
          items: ["Flutter", "Dart"]
        },
        {
          title: "Frontend Development",
          icon: "layout",
          items: ["HTML5", "CSS3", "JavaScript"]
        },
        {
          title: "Backend & Data",
          icon: "database",
          items: ["Node.js", "Firebase", "Supabase", "SQL"]
        },
        {
          title: "Development Tools",
          icon: "gitBranch",
          items: ["Git"]
        }
      ]
    },

    // Merged to avoid repeating Technologies & Tools; stays hidden while empty.
    capabilities: {
      items: []
    },

    education: [
      {
        institution: "Madina Higher Institute for Management and Technology",
        field: "Management Information Systems — Programming Focus",
        graduation: "2026"
      }
    ],

    certifications: [
      { title: "Flutter Certificate" },
      { title: "ICDL — International Computer Driving Licence" }
    ],

    // Optional formal work experience (stays hidden while empty)
    experience: [],

    contact: {
      eyebrow: "Direct Contact",
      heading: "Let's Connect",
      description:
        "Have a project in mind or an opportunity to discuss? Feel free to get in touch.",
      mobileHeading: "Let's Connect",
      mobileDescription:
        "Have a project in mind or an opportunity to discuss? Feel free to get in touch."
    },

    footer: {
      subtitle: "Software Engineer",
      fieldNote: "Software Engineering · Giza, Egypt",
      copyright: "© Ahmed Gamal Saeed. All rights reserved."
    }
  },

  projects: [
    {
      title: "FIXO · Home Services",
      featured: true,
      featuredLabel: "Featured Flutter App",
      category: "flutter",
      description:
        "An Egyptian home services marketplace where customers can discover services and manage bookings, with separate workspaces for professionals and administrators.",
      highlights: [
        "Bilingual English & Arabic RTL interfaces with light and dark theme support",
        "Dedicated customer booking, provider, and administration workflows",
        "Structured REST backend with NestJS and PostgreSQL"
      ],
      screenshots: [
        {
          src: "assets/projects/fixo/home.png",
          label: "Home · English Light",
          alt: "FIXO customer home screen in English light mode"
        },
        {
          src: "assets/projects/fixo/home-ar.png",
          label: "Home · Arabic Dark",
          alt: "FIXO customer home screen in Arabic dark mode"
        },
        {
          src: "assets/projects/fixo/categories-light.png",
          label: "Categories · Light",
          alt: "FIXO 21 service categories grid in English light mode"
        },
        {
          src: "assets/projects/fixo/categories.png",
          label: "Categories · Dark",
          alt: "FIXO 21 service categories grid in English dark mode"
        },
        {
          src: "assets/projects/fixo/services-light.png",
          label: "Services · Light",
          alt: "FIXO available home services catalog with pricing in light mode"
        },
        {
          src: "assets/projects/fixo/services-catalog.png",
          label: "Services · Dark",
          alt: "FIXO available home services catalog with pricing in dark mode"
        },
        {
          src: "assets/projects/fixo/search-light.png",
          label: "Search · Light",
          alt: "FIXO live service search drawer filtering AC services in light mode"
        },
        {
          src: "assets/projects/fixo/search-services.png",
          label: "Search · Dark",
          alt: "FIXO live service search drawer filtering AC services in dark mode"
        },
        {
          src: "assets/projects/fixo/orders-light.png",
          label: "Orders · Light",
          alt: "FIXO My Orders list showing active bookings and live tracking in light mode"
        },
        {
          src: "assets/projects/fixo/orders.png",
          label: "Orders · Dark",
          alt: "FIXO My Orders list showing active bookings and live tracking in dark mode"
        }
      ],
      urls: {
        demo: "https://fixo-web-blue.vercel.app/",
        github: "https://github.com/gamal6507-ops/Fixo_Home_Services"
      },
      tags: ["Flutter", "NestJS", "PostgreSQL", "Riverpod"]
    },
    {
      title: "Twilight Perfume Store",
      featured: true,
      featuredLabel: "Featured Website",
      category: "web",
      description:
        "An Arabic perfume storefront with a responsive catalog, a persistent cart, checkout, and order tracking.",
      highlights: [
        "Responsive Arabic RTL storefront serving live catalog data from Supabase",
        "Filterable browsing across perfumes, body splash, mukhamaria, and body spray",
        "Persistent shopping cart, checkout flow, and order tracking"
      ],
      screenshots: [
        {
          src: "assets/projects/twilight/home.webp",
          alt: "Live desktop homepage of Twilight Perfume Store"
        },
        {
          src: "assets/projects/twilight/catalog.webp",
          alt: "Live Twilight Perfume Store product catalog with Arabic filters"
        }
      ],
      urls: {
        live: "https://twilight-perfume-store-five.vercel.app/"
      },
      tags: ["Next.js", "React", "TypeScript", "Supabase"]
    },
    {
      title: "Tawsela · توصيلة",
      category: "flutter",
      description:
        "An Arabic ride booking app for Egypt. Riders choose pickup and destination points on a map, and approved drivers can accept requests and manage trips.",
      statusNote: "Auth-gated web demo",
      screenshots: [
        {
          src: "assets/projects/tawsela/rider-home.webp",
          label: "Rider Home",
          alt: "Tawsela Arabic RTL Rider Home screen with central Cairo map and location controls"
        },
        {
          src: "assets/projects/tawsela/location-selection.webp",
          label: "Pickup Selection",
          alt: "Tawsela Pickup Selection screen with map marker placed on public Cairo location"
        },
        {
          src: "assets/projects/tawsela/destination-selection.webp",
          label: "Route Selection",
          alt: "Tawsela Destination and Route Selection showing pickup and destination markers across Cairo"
        },
        {
          src: "assets/projects/tawsela/ride-types.webp",
          label: "Ride Booking",
          alt: "Tawsela Ride Type selection and cash-on-arrival booking summary for car, motorcycle, and scooter"
        },
        {
          src: "assets/projects/tawsela/ride-history.webp",
          label: "Ride History",
          alt: "Tawsela Ride History tab empty state screen"
        },
        {
          src: "assets/projects/tawsela/payments.webp",
          label: "Payments",
          alt: "Tawsela Cash Payments policy and trip fare log screen"
        },
        {
          src: "assets/projects/tawsela/driver-space.webp",
          label: "Driver Onboarding",
          alt: "Tawsela Driver Onboarding registration form screen"
        }
      ],
      urls: {
        demo: "https://tawsela-kappa.vercel.app/",
        github: "https://github.com/gamal6507-ops/Tawsela"
      },
      tags: ["Flutter", "Dart", "Firebase", "Arabic RTL"]
    },
    {
      title: "Verve Store",
      category: "flutter",
      description:
        "A bilingual storefront with product browsing, a cart, customer accounts, and checkout backed by a Node.js order API.",
      statusNote: "Browse publicly · Sign in for cart & checkout",
      screenshots: [
        {
          src: "assets/projects/verve/home-light.png",
          label: "Home · English Light",
          alt: "Verve Store English light mode storefront with featured products carousel and trending catalog"
        },
        {
          src: "assets/projects/verve/home-ar-dark.png",
          label: "Home · Arabic Dark",
          alt: "Verve Store Arabic RTL dark mode storefront with localized store navigation"
        },
        {
          src: "assets/projects/verve/categories-light.png",
          label: "Categories · Light",
          alt: "Verve Store categories directory in light mode showing product counts"
        },
        {
          src: "assets/projects/verve/categories-dark.png",
          label: "Categories · Dark",
          alt: "Verve Store categories directory in dark mode showing product counts"
        },
        {
          src: "assets/projects/verve/search-light.png",
          label: "Search · Light",
          alt: "Verve Store live search results for Apple products in light mode"
        },
        {
          src: "assets/projects/verve/search-dark.png",
          label: "Search · Dark",
          alt: "Verve Store live search results for Apple products in dark mode"
        },
        {
          src: "assets/projects/verve/product-details-light.png",
          label: "Product · Light",
          alt: "Verve Store product details page with stock availability, quantity stepper, and add to cart in light mode"
        },
        {
          src: "assets/projects/verve/product-details-dark.png",
          label: "Product · Dark",
          alt: "Verve Store product details page with stock availability, quantity stepper, and add to cart in dark mode"
        },
        {
          src: "assets/projects/verve/favorites-light.png",
          label: "Wishlist · Light",
          alt: "Verve Store saved favorites list showing saved product in light mode"
        },
        {
          src: "assets/projects/verve/favorites-dark.png",
          label: "Wishlist · Dark",
          alt: "Verve Store saved favorites list showing saved product in dark mode"
        },
        {
          src: "assets/projects/verve/cart-dark.png",
          label: "Cart · Dark",
          alt: "Verve Store shopping cart with quantity controls, subtotal, and checkout summary in dark mode"
        },
        {
          src: "assets/projects/verve/cart-ar-light.png",
          label: "Cart · Arabic RTL",
          alt: "Verve Store shopping cart in native Arabic RTL light mode with localized totals"
        },
        {
          src: "assets/projects/verve/checkout-light.png",
          label: "Checkout · Light",
          alt: "Verve Store checkout preview showing delivery, payment methods, and order summary in light mode"
        },
        {
          src: "assets/projects/verve/checkout-dark.png",
          label: "Checkout · Dark",
          alt: "Verve Store checkout preview showing delivery, payment methods, and order summary in dark mode"
        }
      ],
      urls: {
        demo: "https://verve-store-delta.vercel.app/",
        github: "https://github.com/gamal6507-ops/E-Commerce-App"
      },
      tags: ["Flutter", "Firebase", "Node.js", "E-commerce"]
    },
    {
      title: "News App",
      category: "flutter",
      description:
        "A bilingual news reader with categorized headlines, article search, saved stories, and light and dark themes.",
      statusNote: "Auth-gated web demo",
      screenshots: [
        {
          src: "assets/projects/news/home-light.png",
          label: "Home · English Light",
          alt: "News App Al Akhbar home feed with featured headline and latest news in English light mode"
        },
        {
          src: "assets/projects/news/home-dark.png",
          label: "Home · English Dark",
          alt: "News App Al Akhbar home feed with featured headline and latest news in English dark mode"
        },
        {
          src: "assets/projects/news/home-ar-light.png",
          label: "Home · Arabic Light",
          alt: "News App Al Akhbar interface in native Arabic RTL light mode"
        },
        {
          src: "assets/projects/news/home-egypt-light.png",
          label: "Egypt Region · Light",
          alt: "News App regional feed displaying local Egyptian headlines and sports coverage"
        },
        {
          src: "assets/projects/news/category-business-dark.png",
          label: "Business · Dark",
          alt: "News App Business category headlines in dark mode"
        },
        {
          src: "assets/projects/news/category-business-light.png",
          label: "Business · Light",
          alt: "News App Business category headlines in light mode"
        },
        {
          src: "assets/projects/news/article-details-light.png",
          label: "Article · Light",
          alt: "News App article reader showing photo, byline, date, summary, and full article action in light mode"
        },
        {
          src: "assets/projects/news/article-details-dark.png",
          label: "Article · Dark",
          alt: "News App article reader showing photo, byline, date, summary, and full article action in dark mode"
        },
        {
          src: "assets/projects/news/search-dark.png",
          label: "Search · Dark",
          alt: "News App article search results for Technology in dark mode"
        },
        {
          src: "assets/projects/news/search-light.png",
          label: "Search · Light",
          alt: "News App article search results for Technology in light mode"
        },
        {
          src: "assets/projects/news/saved-dark.png",
          label: "Bookmarks · Dark",
          alt: "News App saved bookmarked stories list in dark mode"
        },
        {
          src: "assets/projects/news/settings-ar-dark.png",
          label: "Settings · Arabic Dark",
          alt: "News App settings screen with theme, language, notifications, and region controls in Arabic dark mode"
        }
      ],
      urls: {
        demo: "https://news-app-five-kappa-90.vercel.app/",
        github: "https://github.com/gamal6507-ops/News_App_"
      },
      tags: ["Flutter", "Dart", "Cubit", "Firebase"]
    },
    {
      title: "Movies",
      category: "flutter",
      description:
        "A movie and TV discovery app with watchlists, viewing history, Arabic and English interfaces, and a collection of licensed short films with in-app playback.",
      screenshots: [
        {
          src: "assets/projects/movies/screen-1.webp",
          label: "Onboarding · Welcome",
          alt: "Movies Flutter web demo welcome onboarding screen"
        },
        {
          src: "assets/projects/movies/screen-2.webp",
          label: "Onboarding · Watchlists",
          alt: "Movies Flutter web demo watchlist discovery slide"
        },
        {
          src: "assets/projects/movies/home-discover.png",
          label: "Home · Discover",
          alt: "Movies Home Discover screen featuring Available Now carousel and Free Cinema section"
        },
        {
          src: "assets/projects/movies/home-arabic-rtl.png",
          label: "Home · Arabic RTL",
          alt: "Movies Home screen in native Arabic RTL interface"
        },
        {
          src: "assets/projects/movies/browse-all.png",
          label: "Browse · All Genres",
          alt: "Movies Browse catalog with media type filters, genre chips, and movie posters"
        },
        {
          src: "assets/projects/movies/browse-tv-series.png",
          label: "Browse · TV Series",
          alt: "Movies Browse catalog filtered to TV Series with ratings and years"
        },
        {
          src: "assets/projects/movies/search-empty.png",
          label: "Search · Trending",
          alt: "Movies Search screen displaying Trending Searches discovery chips"
        },
        {
          src: "assets/projects/movies/search-results.png",
          label: "Search · Results",
          alt: "Movies live search results grid displaying movie and series posters"
        },
        {
          src: "assets/projects/movies/movie-details-film.png",
          label: "Movie Details",
          alt: "Movies detail screen showing trailer button, runtime, rating, awards, and screenshots"
        },
        {
          src: "assets/projects/movies/movie-details.png",
          label: "Series · Episodes",
          alt: "Movies TV series details showing Season 1 and episode breakdown"
        },
        {
          src: "assets/projects/movies/free-cinema.png",
          label: "Free Cinema",
          alt: "Movies Free Cinema collection of open-licensed short films"
        },
        {
          src: "assets/projects/movies/film-player.png",
          label: "Video Player",
          alt: "Movies built-in video player streaming an open-licensed short film with playback controls"
        }
      ],
      urls: {
        demo: "https://movie-app-web-psi.vercel.app/"
      },
      tags: ["Flutter", "Dart", "Firebase", "Video Playback"]
    }
  ]
};

window.PORTFOLIO_DATA = portfolioData;
