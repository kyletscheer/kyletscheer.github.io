window.portfolioData = {
  // --- CORE IDENTITY ---
  identity: {
    name: "KYLE SCHEER",
    tagline: "Solo Developer, Global Traveler",
    profileImageURL: "url_to_kyle_scheer_photo", // Placeholder for image URL
    contactEmail: "hi[at]kylescheer[dot]com",
    copyright: "© 2023 Kyle Scheer"
  },

  // --- ABOUT ME ---
  about: {
    introGreeting: "Hi! Welcome to my website.\nClick below to explore.",
    missionStatement: "I'm a solo developer who builds apps and websites that tickle my curiosity. My philosophy is simple: All my work is a gift: always free, no ads, no subscriptions, and no locked features.",
    otherExperience: "Otherwise, I spend my time traveling and working in the outdoor education and disaster response sectors. I also have experience making websites, helping with digital organization, and providing tech support for individuals and businesses. I also tutor English (ESL) and standardized tests (ACT/SAT/GRE).",
    contactPitch: "If you’d like to get in touch or discuss a potential project, feel free to reach out through my email."
  },

  // --- APPS (Mobile/Tool Projects) ---
  // Note: The content you provided had multiple repeated app entries. I condensed them to unique entries.
  apps: [
    /*{
      title: "RunFit",
      description: "A random workout generator to keep your runs fun and varied.",
      imageURL: "url_to_runfit_screenshot",
      link: "#" // Placeholder
    },
    {
      title: "LingoLeap",
      description: "A phrase learning flashcard app designed for travelers on the go.",
      imageURL: "url_to_lingoleap_screenshot",
      link: "#" // Placeholder
    },*/
    {
      title: "Liar’s Dice Calculator",
      description: "Quickly calculate probabilities while playing Liar’s Dice.",
      imageURL: "images/liarsdiceapp_new.mp4",
      link: "https://www.kylescheer.com/test" // Placeholder
    },
    /*{
      title: "Currency Conversion Game",
      description: "Prepare for travel abroad by practicing currency conversions.",
      imageURL: "url_to_currency_conversion_game_screenshot",
      link: "#" // Placeholder
    }*/
  ],

  // --- WEB PROJECTS (Personal Projects List) ---
  // Note: I standardized the structure to include an optional 'date' for sorting/display.
  webProjects: [
    { title: "TravelCents - Currency Conversion Game", date: "Mar, 2025", description: "Prepare for travel abroad with this currency conversion game. Improve your mental math.", link: "https://www.kylescheer.com/travel-cents", screenshotURL: "images/travelcents_new.mp4" },
    { title: "ConvertQuest - Conversion Game", date: "Feb, 2025", description: "Convert measurements game (length, temp, mass, etc...) to improve your mental math.", link: "https://www.kylescheer.com/conversion-game", screenshotURL: "images/conversion-game_new.mp4" },
    { title: "Liars Dice Probability Calculator", date: "Dec, 2024", description: "Figure out probabilities for the game liar's dice.", link: "https://www.kylescheer.com/liars-dice", screenshotURL: "images/liars-dice_new.mp4" },
    { title: "Weekday from a Date", date: "Oct, 2024", description: "Find the weekday from a given date. Explainer, calculator, and 5-minute test.", link: "https://www.kylescheer.com/weekdays", screenshotURL: "images/weekday_new.mp4" },
    { title: "Estate Equitable Distribution", date: "Mar, 2022", description: "How can we distribute an estate in an equitable way, using just an equation?", link: "https://www.kylescheer.com/equitable-distribution", screenshotURL: "images/equitable_new.mp4" },
    { title: "Harry Potter Stats + Random Chapter Generator", date: "Dec, 2021", description: "Charts analyzing the Harry Potter books and a random chapter generator.", link: "https://www.kylescheer.com/harry_potter_stats", screenshotURL: "images/hp_new.mp4" },
    { title: "The Numbers Game", date: "Aug, 2021", description: "Get some digits. Put in some symbols. Complete the equation.", link: "https://www.kylescheer.com/numbers_game", screenshotURL: "images/numbers-game_new.mp4" },
    { title: "Last Letter Geography Game Analysis", date: "Dec, 2024", description: "Discover patterns in geographical place names to win the Last Letter Game.", link: "https://www.kylescheer.com/last-letter", screenshotURL: "images/lastletter_new.mp4" },
    { title: "Timor Numbers", date: "May, 2024", description: "Write out numbers in the various languages of Timor-Leste.", link: "https://www.kylescheer.com/timor_numbers", screenshotURL: "images/timornumbers_new.mp4" },
  //  { title: "Elo Rankings Generator", date: "Jul, 2023", description: "Pairwise decision-making, generated based on user input. Life priorities example page.", link: "https://www.kylescheer.com/pairwise", screenshotURL: "images/.webp" },
    { title: "Historicle", date: "Jun, 2023", description: "A Wordle knockoff using dates from history.", link: "https://www.kylescheer.com/historicle", screenshotURL: "images/historicle_new.mp4" },
    { title: "The Toilet Paper Problem", date: "Jul, 2022", description: "Toilet paper can be deceptive. How much have you really used?", link: "https://www.kylescheer.com/toilet-paper", screenshotURL: "images/tp_new.mp4" },
    { title: "Creating a Tree of Knowledge", date: "Jan, 2022", description: "Visualizing Wikipedia's list of academic disciplines to answer: 'What don't I know?'", link: "https://medium.com/@kyletscheer/on-creating-a-tree-of-knowledge-f099c1028bf6", screenshotURL: "images/tree_new.mp4" },
    { title: "Letters and Words", date: "Jul, 2021", description: "Some random tools where I play with letters and words.", link: "https://www.kylescheer.com/letters", screenshotURL: "images/letters_new.mp4" },
    { title: "Automate Your Finances", date: "Mar, 2021", description: "A simpler way to handle your money.", link: "https://www.kylescheer.com/bucket-finance", screenshotURL: "images/bucketfinance_new.mp4" },
    { title: "270 Game Guide", date: "Nov, 2020", description: "A far too in-depth guide on the 270 election game.", link: "https://medium.com/@kyletscheer/270-game-ultimate-strategy-guide-get-to-538-every-time-31a1cada5af0", screenshotURL: "images/270_new.mp4" },
    { title: "Event Combination Probability Calculator", date: "Jul, 2016", description: "Find the theoretical (and experimental) probability of event combinations occurring.", link: "https://www.kylescheer.com/probability", screenshotURL: "images/eventprobability_new.mp4" }
  ],

  // --- SERVICES ---
  // Organized into categories, with each category having a list of offerings.
  services: [
    {
      category: "Online Presence",
      icon: "🌐", // For theme reference
      items: [
        "Website Design & SEO",
        "Social Media Management",
        "Marketing & Customer Support"
      ]
    },
    {
      category: "Tech Solutions",
      icon: "⚙️", // For theme reference
      items: [
        "Marketing and Customer Support Systems",
        "Digital Product Development",
        "Document Management Systems",
        "Team Collaboration Software",
        "Data Collection & Analysis",
        "Hardware & Software Upgrades"
      ]
    },
    {
      category: "Tech Support",
      icon: "📞", // For theme reference
      items: [
        "Device Setup (printers, tablets, phones)",
        "Internet Troubleshooting",
        "Social Media Account Setup & Navigation",
        "Simplified, easy-to-understand solutions for all users."
      ]
    },
    {
      category: "Tutoring",
      icon: "📚", // For theme reference
      items: [
        "Personalized tutoring in English (ESL) and ACT/SAT/GRE exam prep.",
        "Lessons tailored to meet specific needs and goals."
      ]
    }
  ],

  // --- TESTIMONIALS ---
  testimonials: [
    {
      quote: "Working with Kyle was a great experience! He helped me translate my ideas into a highly functional and visually pleasing website. He took the time not only to build my website but also to provide me with instruction and coaching so that I could do some updating myself.",
      source: "Leslie J."
    }
    // You can add more testimonials here
  ],

  // --- OTHER LINKS / CONTACT ---
  links: [
    { title: "Buy Me a Coffee", url: "ko-fi.com", icon: "☕" },
    { title: "View Code on GitHub", url: "#", icon: "💻" },
    { title: "Email Me", url: "mailto:hi@kylescheer.com", icon: "📧" }
  ]
};