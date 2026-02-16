export const mockScores = {
  overall: 72,
  technical: 85,
  onPage: 68,
  schema: 55,
  crawlHealth: 90,
  content: 64,
};

export const mockIssues = [
  {
    id: '1',
    severity: 'critical' as const,
    title: 'Missing Organization schema on homepage',
    description: 'The homepage lacks an Organization schema markup, which is essential for brand knowledge panel eligibility.',
    pages: ['/'],
    category: 'schema',
    impact: 15,
    effort: 'low' as const,
  },
  {
    id: '2',
    severity: 'critical' as const,
    title: 'Duplicate title tags across 12 pages',
    description: 'Multiple pages share identical title tags, causing confusion for search engines about page uniqueness.',
    pages: ['/about', '/services', '/contact', '/blog/page-1', '/blog/page-2'],
    category: 'onpage',
    impact: 12,
    effort: 'medium' as const,
  },
  {
    id: '3',
    severity: 'warning' as const,
    title: 'JSON-LD syntax errors on product pages',
    description: 'Product schema contains invalid property names and missing required fields like "offers".',
    pages: ['/products/widget-a', '/products/widget-b', '/products/widget-c'],
    category: 'schema',
    impact: 10,
    effort: 'low' as const,
  },
  {
    id: '4',
    severity: 'warning' as const,
    title: 'Missing meta descriptions on 8 pages',
    description: 'Pages without meta descriptions may display auto-generated snippets in search results.',
    pages: ['/blog/post-1', '/blog/post-2', '/blog/post-3'],
    category: 'onpage',
    impact: 8,
    effort: 'low' as const,
  },
  {
    id: '5',
    severity: 'info' as const,
    title: 'No BreadcrumbList schema detected',
    description: 'Adding BreadcrumbList schema can enhance search result appearance with breadcrumb navigation.',
    pages: ['/products', '/blog', '/about'],
    category: 'schema',
    impact: 5,
    effort: 'low' as const,
  },
  {
    id: '6',
    severity: 'warning' as const,
    title: 'Redirect chains detected (3+ hops)',
    description: 'Some internal links pass through 3 or more redirects, wasting crawl budget and link equity.',
    pages: ['/old-page', '/legacy/services'],
    category: 'technical',
    impact: 7,
    effort: 'medium' as const,
  },
  {
    id: '7',
    severity: 'info' as const,
    title: 'Images missing lazy loading attribute',
    description: 'Below-the-fold images could benefit from loading="lazy" for improved page speed.',
    pages: ['/gallery', '/blog/post-1'],
    category: 'technical',
    impact: 4,
    effort: 'low' as const,
  },
];

export const mockPages = [
  { url: '/', title: 'Homepage', status: 200, schemaTypes: ['WebSite'], issues: 2, score: 65 },
  { url: '/about', title: 'About Us', status: 200, schemaTypes: [], issues: 3, score: 52 },
  { url: '/products', title: 'Products', status: 200, schemaTypes: ['Product', 'BreadcrumbList'], issues: 1, score: 78 },
  { url: '/products/widget-a', title: 'Widget A', status: 200, schemaTypes: ['Product'], issues: 2, score: 70 },
  { url: '/products/widget-b', title: 'Widget B', status: 200, schemaTypes: ['Product'], issues: 2, score: 68 },
  { url: '/blog', title: 'Blog', status: 200, schemaTypes: ['WebPage'], issues: 1, score: 75 },
  { url: '/blog/post-1', title: 'Getting Started Guide', status: 200, schemaTypes: ['Article'], issues: 2, score: 71 },
  { url: '/blog/post-2', title: 'Best Practices', status: 200, schemaTypes: ['Article'], issues: 1, score: 80 },
  { url: '/contact', title: 'Contact Us', status: 200, schemaTypes: ['LocalBusiness'], issues: 1, score: 82 },
  { url: '/services', title: 'Services', status: 200, schemaTypes: [], issues: 4, score: 45 },
  { url: '/old-page', title: 'Legacy Page', status: 301, schemaTypes: [], issues: 1, score: 30 },
  { url: '/gallery', title: 'Gallery', status: 200, schemaTypes: [], issues: 2, score: 58 },
];

export const mockSchemaLibrary = [
  {
    type: 'Organization',
    description: 'Represents a company, corporation, or other organizational entity.',
    useCases: ['Brand knowledge panels', 'Company information in search', 'Social profile linking'],
    requiredFields: ['@type', 'name', 'url'],
    recommendedFields: ['logo', 'sameAs', 'contactPoint', 'address', 'description'],
    example: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/example",
    "https://linkedin.com/company/example"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-5555",
    "contactType": "customer service"
  }
}`,
    category: 'business',
  },
  {
    type: 'LocalBusiness',
    description: 'A physical business with a local presence, including stores, restaurants, and offices.',
    useCases: ['Local search results', 'Google Maps integration', 'Business hours display'],
    requiredFields: ['@type', 'name', 'address'],
    recommendedFields: ['telephone', 'openingHours', 'geo', 'priceRange', 'image'],
    example: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Joe's Pizza",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001"
  },
  "telephone": "+1-555-555-5555",
  "openingHours": "Mo-Su 11:00-23:00"
}`,
    category: 'business',
  },
  {
    type: 'Product',
    description: 'An individual product with pricing, availability, and review information.',
    useCases: ['Product rich results', 'Shopping tabs', 'Price comparison'],
    requiredFields: ['@type', 'name'],
    recommendedFields: ['image', 'description', 'offers', 'review', 'aggregateRating', 'brand', 'sku'],
    example: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Executive Widget",
  "image": "https://example.com/widget.jpg",
  "description": "Premium quality widget for professionals",
  "brand": { "@type": "Brand", "name": "WidgetCo" },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}`,
    category: 'ecommerce',
  },
  {
    type: 'Article',
    description: 'A news, blog, or scholarly article with authorship and publication details.',
    useCases: ['Article rich results', 'Google News', 'Top stories carousel'],
    requiredFields: ['@type', 'headline', 'image', 'datePublished'],
    recommendedFields: ['author', 'publisher', 'dateModified', 'description', 'mainEntityOfPage'],
    example: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Schema Markup",
  "image": "https://example.com/article-hero.jpg",
  "datePublished": "2025-01-15",
  "dateModified": "2025-02-01",
  "author": {
    "@type": "Person",
    "name": "Jane Developer"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog"
  }
}`,
    category: 'content',
  },
  {
    type: 'FAQPage',
    description: 'A page containing a list of frequently asked questions and answers.',
    useCases: ['FAQ rich results', 'Expanded search snippets', 'Voice search answers'],
    requiredFields: ['@type', 'mainEntity'],
    recommendedFields: [],
    example: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is schema markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Schema markup is structured data added to web pages to help search engines understand content."
      }
    }
  ]
}`,
    category: 'content',
  },
  {
    type: 'BreadcrumbList',
    description: 'Navigation breadcrumbs showing the page hierarchy.',
    useCases: ['Breadcrumb trail in search results', 'Improved URL display'],
    requiredFields: ['@type', 'itemListElement'],
    recommendedFields: [],
    example: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products" }
  ]
}`,
    category: 'navigation',
  },
  {
    type: 'WebSite',
    description: 'Represents the website itself, often used with SearchAction for sitelinks search box.',
    useCases: ['Sitelinks search box', 'Site name in search results'],
    requiredFields: ['@type', 'name', 'url'],
    recommendedFields: ['potentialAction', 'description'],
    example: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example Site",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`,
    category: 'general',
  },
  {
    type: 'HowTo',
    description: 'Step-by-step instructions for completing a task.',
    useCases: ['How-to rich results', 'Step-by-step display in search'],
    requiredFields: ['@type', 'name', 'step'],
    recommendedFields: ['image', 'totalTime', 'estimatedCost', 'supply', 'tool'],
    example: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Add Schema Markup",
  "step": [
    { "@type": "HowToStep", "name": "Choose schema type", "text": "Select the appropriate schema type for your content." },
    { "@type": "HowToStep", "name": "Generate JSON-LD", "text": "Use a schema generator to create the markup." }
  ]
}`,
    category: 'content',
  },
  {
    type: 'Event',
    description: 'An event happening at a certain time and location.',
    useCases: ['Event rich results', 'Google Events listings'],
    requiredFields: ['@type', 'name', 'startDate', 'location'],
    recommendedFields: ['endDate', 'description', 'image', 'offers', 'performer', 'organizer'],
    example: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "SEO Conference 2025",
  "startDate": "2025-06-15T09:00",
  "endDate": "2025-06-17T17:00",
  "location": {
    "@type": "Place",
    "name": "Convention Center",
    "address": "456 Conference Ave, San Francisco, CA"
  }
}`,
    category: 'events',
  },
  {
    type: 'VideoObject',
    description: 'A video with metadata for video search results.',
    useCases: ['Video rich results', 'Video carousels', 'Google Video search'],
    requiredFields: ['@type', 'name', 'description', 'thumbnailUrl', 'uploadDate'],
    recommendedFields: ['duration', 'contentUrl', 'embedUrl', 'interactionStatistic'],
    example: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Schema Markup Tutorial",
  "description": "Learn how to implement schema markup",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "uploadDate": "2025-01-15",
  "duration": "PT10M30S",
  "contentUrl": "https://example.com/video.mp4"
}`,
    category: 'media',
  },
];

export const mockAudits = [
  { id: '1', url: 'https://example.com', date: '2025-02-14', pages: 47, score: 72, status: 'completed' as const },
  { id: '2', url: 'https://myshop.io', date: '2025-02-10', pages: 123, score: 58, status: 'completed' as const },
  { id: '3', url: 'https://blog.dev', date: '2025-02-08', pages: 31, score: 85, status: 'completed' as const },
];

export const mockRoadmapTasks = [
  { id: '1', title: 'Add Organization schema to homepage', impact: 15, effort: 'low', category: 'Quick Win', status: 'todo', estimatedTime: '15 min' },
  { id: '2', title: 'Fix duplicate title tags', impact: 12, effort: 'medium', category: 'Developer Task', status: 'todo', estimatedTime: '1 hour' },
  { id: '3', title: 'Fix JSON-LD syntax on product pages', impact: 10, effort: 'low', category: 'Quick Win', status: 'todo', estimatedTime: '20 min' },
  { id: '4', title: 'Write unique meta descriptions', impact: 8, effort: 'medium', category: 'Content Task', status: 'todo', estimatedTime: '2 hours' },
  { id: '5', title: 'Add BreadcrumbList schema', impact: 5, effort: 'low', category: 'Quick Win', status: 'todo', estimatedTime: '10 min' },
  { id: '6', title: 'Fix redirect chains', impact: 7, effort: 'medium', category: 'Developer Task', status: 'todo', estimatedTime: '45 min' },
];
