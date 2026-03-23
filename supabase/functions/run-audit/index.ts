const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Schema validation rules per type
const SCHEMA_RULES: Record<string, { required: string[]; recommended: string[] }> = {
  'Organization': { required: ['name', 'url'], recommended: ['logo', 'contactPoint', 'sameAs', 'address'] },
  'WebSite': { required: ['name', 'url'], recommended: ['potentialAction', 'publisher'] },
  'WebPage': { required: ['name'], recommended: ['description', 'breadcrumb', 'mainEntity'] },
  'Article': { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'publisher', 'dateModified', 'description'] },
  'NewsArticle': { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'publisher', 'dateModified', 'description'] },
  'BlogPosting': { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'publisher', 'dateModified', 'description'] },
  'Product': { required: ['name'], recommended: ['image', 'description', 'offers', 'brand', 'review', 'aggregateRating', 'sku'] },
  'LocalBusiness': { required: ['name', 'address'], recommended: ['telephone', 'openingHours', 'geo', 'image', 'priceRange', 'url'] },
  'FAQPage': { required: ['mainEntity'], recommended: [] },
  'BreadcrumbList': { required: ['itemListElement'], recommended: [] },
  'Event': { required: ['name', 'startDate', 'location'], recommended: ['description', 'image', 'endDate', 'performer', 'offers'] },
  'Person': { required: ['name'], recommended: ['url', 'image', 'jobTitle', 'sameAs'] },
  'Review': { required: ['itemReviewed', 'author', 'reviewRating'], recommended: ['datePublished', 'reviewBody'] },
  'HowTo': { required: ['name', 'step'], recommended: ['description', 'image', 'totalTime', 'estimatedCost'] },
  'VideoObject': { required: ['name', 'description', 'thumbnailUrl', 'uploadDate'], recommended: ['contentUrl', 'duration', 'embedUrl'] },
  'JobPosting': { required: ['title', 'description', 'datePosted', 'hiringOrganization'], recommended: ['employmentType', 'jobLocation', 'baseSalary', 'validThrough'] },
  'Recipe': { required: ['name'], recommended: ['image', 'author', 'prepTime', 'cookTime', 'recipeIngredient', 'recipeInstructions', 'nutrition'] },
  'Course': { required: ['name', 'provider'], recommended: ['description', 'offers'] },
  'SoftwareApplication': { required: ['name'], recommended: ['operatingSystem', 'applicationCategory', 'offers', 'aggregateRating'] },
  'Service': { required: ['name'], recommended: ['provider', 'serviceType', 'areaServed', 'description'] },
  'ImageObject': { required: ['contentUrl'], recommended: ['name', 'description', 'caption'] },
  'ContactPoint': { required: ['contactType'], recommended: ['telephone', 'email', 'areaServed'] },
  'Offer': { required: ['price', 'priceCurrency'], recommended: ['availability', 'url', 'itemCondition'] },
  'AggregateRating': { required: ['ratingValue', 'reviewCount'], recommended: ['bestRating', 'worstRating'] },
};

// Extract JSON-LD from HTML with thorough validation
function extractJsonLd(html: string): Array<{ raw: any; errors: string[]; warnings: string[] }> {
  const results: Array<{ raw: any; errors: string[]; warnings: string[] }> = [];
  const regex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const content = match[1].trim();
    if (!content) continue;

    try {
      const parsed = JSON.parse(content);
      const items = parsed['@graph'] ? parsed['@graph'] : (Array.isArray(parsed) ? parsed : [parsed]);

      for (const item of items) {
        const errors: string[] = [];
        const warnings: string[] = [];

        const type = item['@type'];
        if (!type) {
          errors.push('Missing @type property');
        }

        // Context validation
        if (!item['@context'] && !parsed['@context']) {
          warnings.push('Missing @context - should be "https://schema.org"');
        } else {
          const ctx = item['@context'] || parsed['@context'];
          const ctxStr = typeof ctx === 'object' ? JSON.stringify(ctx) : String(ctx);
          if (!ctxStr.includes('schema.org')) {
            warnings.push(`Unexpected @context: ${ctxStr}. Expected "https://schema.org"`);
          }
          // Check for http vs https
          if (typeof ctx === 'string' && ctx === 'http://schema.org') {
            warnings.push('Use "https://schema.org" instead of "http://schema.org"');
          }
        }

        // Validate against rules
        const typeStr = Array.isArray(type) ? type[0] : type;
        if (typeStr && SCHEMA_RULES[typeStr]) {
          const rules = SCHEMA_RULES[typeStr];
          for (const req of rules.required) {
            const val = item[req];
            if (val === undefined || val === null || val === '') {
              errors.push(`Missing required property "${req}" for ${typeStr}`);
            }
          }
          for (const rec of rules.recommended) {
            if (item[rec] === undefined || item[rec] === null || item[rec] === '') {
              warnings.push(`Missing recommended property "${rec}" for ${typeStr}`);
            }
          }
        }

        // Validate property values
        for (const [key, value] of Object.entries(item)) {
          if (key.startsWith('@')) continue;

          // Empty values
          if (value === '' || value === null) {
            errors.push(`Empty value for property "${key}"`);
          }

          // URL validation
          if (typeof value === 'string' && (key.toLowerCase().includes('url') || key === 'logo' || key === 'image' || key === 'sameAs')) {
            if (value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('//') && !value.startsWith('/') && !value.startsWith('data:')) {
              errors.push(`Invalid URL in "${key}": ${value}`);
            }
          }

          // Date validation for date properties
          if (typeof value === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('time'))) {
            if (value && isNaN(Date.parse(value))) {
              errors.push(`Invalid date format in "${key}": ${value}`);
            }
          }
        }

        // Check for duplicate @type across entities (same type appearing multiple times on page)
        results.push({ raw: item, errors, warnings });
      }
    } catch (e) {
      results.push({ raw: content, errors: [`Invalid JSON: ${(e as Error).message}`], warnings: [] });
    }
  }

  return results;
}

// Extract Microdata from HTML
function extractMicrodata(html: string): Array<{ raw: any; errors: string[]; warnings: string[] }> {
  const results: Array<{ raw: any; errors: string[]; warnings: string[] }> = [];
  const itemScopeRegex = /<[^>]+itemscope[^>]*itemtype\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = itemScopeRegex.exec(html)) !== null) {
    const itemType = match[1];
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!itemType.includes('schema.org')) {
      warnings.push(`itemtype does not reference schema.org: ${itemType}`);
    }

    const typeName = itemType.split('/').pop() || 'Unknown';
    results.push({
      raw: { '@type': typeName, '@source': 'microdata', 'itemtype': itemType },
      errors,
      warnings,
    });
  }

  return results;
}

// Extract RDFa from HTML
function extractRdfa(html: string): Array<{ raw: any; errors: string[]; warnings: string[] }> {
  const results: Array<{ raw: any; errors: string[]; warnings: string[] }> = [];
  const typeofRegex = /<[^>]+typeof\s*=\s*["']([^"']+)["'][^>]*vocab\s*=\s*["']([^"']+)["'][^>]*>|<[^>]+vocab\s*=\s*["']([^"']+)["'][^>]*typeof\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = typeofRegex.exec(html)) !== null) {
    const typeName = match[1] || match[4] || 'Unknown';
    const vocab = match[2] || match[3] || '';
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!vocab.includes('schema.org')) {
      warnings.push(`RDFa vocab does not reference schema.org: ${vocab}`);
    }

    results.push({
      raw: { '@type': typeName, '@source': 'rdfa', 'vocab': vocab },
      errors,
      warnings,
    });
  }

  return results;
}

// Comprehensive SEO analysis
function analyzeSeo(html: string, url: string): Array<{ category: string; severity: string; title: string; description: string; evidence?: string; fix_plan?: string; impact_score: number; effort: string }> {
  const issues: Array<{ category: string; severity: string; title: string; description: string; evidence?: string; fix_plan?: string; impact_score: number; effort: string }> = [];

  // Title tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/<[^>]*>/g, '') : '';
  if (!title) {
    issues.push({ category: 'seo', severity: 'critical', title: 'Missing title tag', description: 'Page has no title tag. This is critical for SEO and browser display.', fix_plan: 'Add a <title> tag inside <head> with a descriptive title under 60 characters.', impact_score: 15, effort: 'low' });
  } else if (title.length > 60) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Title tag too long', description: `Title is ${title.length} characters. Google typically truncates at ~60.`, evidence: title, fix_plan: 'Shorten the title to under 60 characters while keeping primary keywords.', impact_score: 4, effort: 'low' });
  } else if (title.length < 10) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Title tag too short', description: `Title is only ${title.length} characters. Aim for 30-60 characters.`, evidence: title, fix_plan: 'Expand the title to be more descriptive (30-60 characters).', impact_score: 4, effort: 'low' });
  }

  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';
  if (!metaDesc) {
    issues.push({ category: 'seo', severity: 'critical', title: 'Missing meta description', description: 'No meta description found. Search engines use this for snippets.', fix_plan: 'Add <meta name="description" content="..."> with 120-160 characters summarizing the page.', impact_score: 10, effort: 'low' });
  } else if (metaDesc.length > 160) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Meta description too long', description: `Meta description is ${metaDesc.length} characters. Will be truncated in SERPs.`, evidence: metaDesc.substring(0, 100) + '...', fix_plan: 'Shorten to 120-160 characters.', impact_score: 3, effort: 'low' });
  } else if (metaDesc.length < 50) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Meta description too short', description: `Meta description is only ${metaDesc.length} characters. Aim for 120-160.`, evidence: metaDesc, fix_plan: 'Expand the meta description to 120-160 characters.', impact_score: 3, effort: 'low' });
  }

  // H1 tag
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    issues.push({ category: 'seo', severity: 'critical', title: 'Missing H1 tag', description: 'No H1 heading found. Every page should have exactly one H1.', fix_plan: 'Add a single H1 tag with the primary topic/keyword of the page.', impact_score: 8, effort: 'low' });
  } else if (h1Matches.length > 1) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Multiple H1 tags', description: `Found ${h1Matches.length} H1 tags. Best practice is exactly one H1 per page.`, fix_plan: 'Keep the most relevant H1 and change others to H2 or lower.', impact_score: 4, effort: 'low' });
  }

  // Heading hierarchy
  const headings = html.match(/<h[1-6][^>]*>/gi) || [];
  const headingLevels = headings.map(h => parseInt(h.match(/h([1-6])/i)?.[1] || '0'));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      issues.push({ category: 'seo', severity: 'info', title: 'Heading hierarchy skip', description: `Heading jumps from H${headingLevels[i - 1]} to H${headingLevels[i]}. Maintain proper hierarchy.`, fix_plan: 'Restructure headings to follow a logical H1 > H2 > H3 hierarchy.', impact_score: 2, effort: 'medium' });
      break;
    }
  }

  // Images without alt text
  const imgRegex = /<img[^>]*>/gi;
  const imgMatches = html.match(imgRegex) || [];
  const missingAlt = imgMatches.filter(img => !img.match(/alt\s*=\s*["'][^"']+["']/i));
  const emptyAlt = imgMatches.filter(img => img.match(/alt\s*=\s*["']\s*["']/i));
  if (missingAlt.length > 0) {
    issues.push({ category: 'seo', severity: 'warning', title: `${missingAlt.length} image(s) missing alt text`, description: 'Images without alt attributes hurt accessibility and image SEO.', evidence: `${missingAlt.length} of ${imgMatches.length} images lack alt text`, fix_plan: 'Add descriptive alt attributes to all meaningful images.', impact_score: Math.min(10, missingAlt.length * 2), effort: 'medium' });
  }
  if (emptyAlt.length > 0) {
    issues.push({ category: 'seo', severity: 'info', title: `${emptyAlt.length} image(s) with empty alt text`, description: 'Images with empty alt="" are treated as decorative. Ensure this is intentional.', impact_score: 1, effort: 'low' });
  }

  // Canonical tag
  const canonicalMatch = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["'][^>]*>/i)
    || html.match(/<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
  if (!canonicalMatch) {
    issues.push({ category: 'technical', severity: 'warning', title: 'Missing canonical tag', description: 'No canonical URL specified. This can cause duplicate content issues.', fix_plan: 'Add <link rel="canonical" href="..."> pointing to the preferred URL.', impact_score: 6, effort: 'low' });
  } else {
    const canonicalUrl = canonicalMatch[1];
    if (canonicalUrl && !canonicalUrl.startsWith('http')) {
      issues.push({ category: 'technical', severity: 'warning', title: 'Canonical URL is not absolute', description: `Canonical URL "${canonicalUrl}" should be an absolute URL.`, evidence: canonicalUrl, fix_plan: 'Use the full absolute URL including protocol and domain.', impact_score: 5, effort: 'low' });
    }
  }

  // Viewport meta
  const viewportMatch = html.match(/<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i);
  if (!viewportMatch) {
    issues.push({ category: 'technical', severity: 'critical', title: 'Missing viewport meta tag', description: 'No viewport meta tag found. Page may not be mobile-friendly.', fix_plan: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.', impact_score: 10, effort: 'low' });
  }

  // HTTPS check
  if (url.startsWith('http://')) {
    issues.push({ category: 'security', severity: 'critical', title: 'Not using HTTPS', description: 'Site is served over HTTP. HTTPS is a ranking factor.', fix_plan: 'Configure SSL certificate and redirect all HTTP traffic to HTTPS.', impact_score: 12, effort: 'medium' });
  }

  // Open Graph tags
  const ogTitle = html.match(/<meta[^>]*property\s*=\s*["']og:title["'][^>]*>/i);
  const ogDesc = html.match(/<meta[^>]*property\s*=\s*["']og:description["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]*property\s*=\s*["']og:image["'][^>]*>/i);
  if (!ogTitle || !ogDesc || !ogImage) {
    const missing = [!ogTitle && 'og:title', !ogDesc && 'og:description', !ogImage && 'og:image'].filter(Boolean);
    issues.push({ category: 'seo', severity: 'info', title: 'Missing Open Graph tags', description: `Missing: ${missing.join(', ')}. These improve social media sharing.`, fix_plan: 'Add Open Graph meta tags for better social media previews.', impact_score: 2, effort: 'low' });
  }

  // Twitter Card
  const twitterCard = html.match(/<meta[^>]*name\s*=\s*["']twitter:card["'][^>]*>/i);
  if (!twitterCard) {
    issues.push({ category: 'seo', severity: 'info', title: 'Missing Twitter Card meta', description: 'No Twitter Card meta tag found.', fix_plan: 'Add <meta name="twitter:card" content="summary_large_image">.', impact_score: 1, effort: 'low' });
  }

  // Robots meta
  const robotsMeta = html.match(/<meta[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i);
  if (robotsMeta && robotsMeta[1].includes('noindex')) {
    issues.push({ category: 'technical', severity: 'critical', title: 'Page set to noindex', description: 'This page has a noindex directive and will not appear in search results.', evidence: `robots content: "${robotsMeta[1]}"`, fix_plan: 'Remove noindex from robots meta if this page should be indexed.', impact_score: 15, effort: 'low' });
  }

  // Language attribute
  const langMatch = html.match(/<html[^>]*lang\s*=\s*["']([^"']*)["'][^>]*>/i);
  if (!langMatch) {
    issues.push({ category: 'seo', severity: 'info', title: 'Missing lang attribute', description: 'HTML element has no lang attribute.', fix_plan: 'Add lang attribute to <html> tag, e.g., <html lang="en">.', impact_score: 2, effort: 'low' });
  }

  // Internal links check
  const links = html.match(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi) || [];
  if (links.length < 3) {
    issues.push({ category: 'seo', severity: 'warning', title: 'Few internal links', description: `Only ${links.length} links found on page. Internal linking improves crawlability.`, fix_plan: 'Add relevant internal links to other pages on your site.', impact_score: 4, effort: 'medium' });
  }

  // Lazy loading
  if (imgMatches.length > 3) {
    const lazyImages = imgMatches.filter(img => img.match(/loading\s*=\s*["']lazy["']/i));
    if (lazyImages.length === 0) {
      issues.push({ category: 'performance', severity: 'info', title: 'No lazy-loaded images', description: `${imgMatches.length} images found but none use lazy loading.`, fix_plan: 'Add loading="lazy" to below-the-fold images.', impact_score: 3, effort: 'low' });
    }
  }

  // Hreflang validation
  const hreflangTags = html.match(/<link[^>]*hreflang\s*=\s*["'][^"']*["'][^>]*>/gi) || [];
  if (hreflangTags.length > 0) {
    const invalidHreflang = hreflangTags.filter(tag => !tag.match(/href\s*=\s*["'][^"']+["']/i));
    if (invalidHreflang.length > 0) {
      issues.push({ category: 'seo', severity: 'warning', title: 'Invalid hreflang tags', description: `${invalidHreflang.length} hreflang tag(s) missing href attribute.`, fix_plan: 'Ensure all hreflang tags include both hreflang and href attributes.', impact_score: 5, effort: 'low' });
    }
  }

  // Charset
  const charsetMatch = html.match(/<meta[^>]*charset\s*=\s*["']?([^"'\s>]+)/i);
  if (!charsetMatch) {
    issues.push({ category: 'technical', severity: 'info', title: 'Missing charset declaration', description: 'No charset meta tag found. Browsers may misinterpret character encoding.', fix_plan: 'Add <meta charset="utf-8"> as the first element in <head>.', impact_score: 2, effort: 'low' });
  }

  // Favicon
  const faviconMatch = html.match(/<link[^>]*rel\s*=\s*["'](icon|shortcut icon)["'][^>]*>/i);
  if (!faviconMatch) {
    issues.push({ category: 'technical', severity: 'info', title: 'Missing favicon', description: 'No favicon link tag found.', fix_plan: 'Add <link rel="icon" href="/favicon.ico">.', impact_score: 1, effort: 'low' });
  }

  return issues;
}

// Improved score calculation - per-page issues are normalized
function calculateScores(allIssues: Array<{ category: string; severity: string; impact_score: number }>, pageCount: number) {
  // Count unique issues by title to avoid over-penalizing repeated per-page issues
  const uniqueIssueMap = new Map<string, { category: string; severity: string; impact_score: number; count: number }>();

  for (const issue of allIssues) {
    const key = `${issue.category}:${(issue as any).title || ''}`;
    const existing = uniqueIssueMap.get(key);
    if (existing) {
      existing.count++;
      // Use max impact score for duplicate issues
      existing.impact_score = Math.max(existing.impact_score, issue.impact_score);
    } else {
      uniqueIssueMap.set(key, { ...issue, count: 1 });
    }
  }

  const maxScore = 100;
  const categoryScores: Record<string, number> = {
    technical: maxScore,
    seo: maxScore,
    schema: maxScore,
    content: maxScore,
    security: maxScore,
    performance: maxScore,
  };

  const severityMultiplier: Record<string, number> = {
    critical: 1.0,
    warning: 0.5,
    info: 0.15,
  };

  for (const [, issue] of uniqueIssueMap) {
    const multiplier = severityMultiplier[issue.severity] || 0.3;
    // Scale deduction based on how many pages are affected (log scale to prevent over-penalizing)
    const affectedRatio = Math.min(1, issue.count / Math.max(1, pageCount));
    const scaleFactor = 1 + Math.log2(1 + affectedRatio * 3); // 1.0 to ~3.0
    const deduction = issue.impact_score * multiplier * Math.min(scaleFactor, 2.5);

    if (categoryScores[issue.category] !== undefined) {
      categoryScores[issue.category] = Math.max(0, categoryScores[issue.category] - deduction);
    }
  }

  const overall = Math.round(
    categoryScores.technical * 0.25 +
    categoryScores.seo * 0.30 +
    categoryScores.schema * 0.20 +
    categoryScores.content * 0.10 +
    categoryScores.security * 0.10 +
    categoryScores.performance * 0.05
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    technical: Math.round(categoryScores.technical),
    onpage: Math.round(categoryScores.seo),
    schema: Math.round(categoryScores.schema),
    crawl_health: Math.round((categoryScores.technical + categoryScores.performance) / 2),
    content: Math.round(categoryScores.content),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  let auditId: string | null = null;

  try {
    const body = await req.json();
    auditId = body.audit_id;

    // Get audit details
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single();

    if (auditError || !audit) {
      throw new Error(`Audit not found: ${auditError?.message}`);
    }

    // Update status to crawling
    await supabase.from('audits').update({ status: 'crawling' }).eq('id', auditId);

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    let targetUrl = audit.url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    console.log(`Starting crawl for: ${targetUrl}, max pages: ${audit.max_pages}`);

    // Start Firecrawl crawl
    const crawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
        limit: Math.min(audit.max_pages, 100),
        maxDepth: audit.max_depth,
        scrapeOptions: {
          formats: ['html', 'links'],
        },
      }),
    });

    const crawlData = await crawlResponse.json();

    if (!crawlResponse.ok) {
      throw new Error(`Firecrawl error: ${JSON.stringify(crawlData)}`);
    }

    const crawlId = crawlData.id;
    if (!crawlId) {
      throw new Error('No crawl ID returned from Firecrawl');
    }

    console.log(`Crawl started, ID: ${crawlId}`);

    // Poll for crawl completion (up to 8 minutes)
    let crawlResults = null;
    for (let attempt = 0; attempt < 96; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(`https://api.firecrawl.dev/v1/crawl/${crawlId}`, {
        headers: { 'Authorization': `Bearer ${firecrawlKey}` },
      });
      const statusData = await statusResponse.json();

      if (statusData.status === 'completed') {
        crawlResults = statusData.data || [];
        console.log(`Crawl completed: ${crawlResults.length} pages`);
        await supabase.from('audits').update({
          pages_crawled: crawlResults.length,
          pages_total: crawlResults.length,
        }).eq('id', auditId);
        break;
      }

      if (statusData.status === 'failed') {
        throw new Error(`Crawl failed: ${statusData.error || 'Unknown error'}`);
      }

      // Update progress
      const completed = statusData.completed || 0;
      const total = statusData.total || audit.max_pages;
      await supabase.from('audits').update({
        pages_crawled: completed,
        pages_total: total,
      }).eq('id', auditId);
    }

    if (!crawlResults) {
      throw new Error('Crawl timed out');
    }

    // Update status to analyzing
    await supabase.from('audits').update({ status: 'analyzing' }).eq('id', auditId);

    // Process each page
    const allIssues: any[] = [];
    const pageBatch: any[] = [];

    for (const pageData of crawlResults) {
      const pageUrl = pageData.metadata?.sourceURL || pageData.metadata?.url || targetUrl;
      const html = pageData.html || pageData.rawHtml || '';
      const statusCode = pageData.metadata?.statusCode || 200;

      if (!html && statusCode >= 200 && statusCode < 300) continue; // Skip empty successful pages

      // Extract page metadata
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1].trim().replace(/<[^>]*>/g, '') : '';
      const metaDescMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
        || html.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
      const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : '';
      const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ');
      const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
      const canonicalMatch = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["'][^>]*>/i)
        || html.match(/<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : null;
      const robotsMeta = html.match(/<meta[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i);
      const robotsContent = robotsMeta ? robotsMeta[1] : null;
      const isIndexable = !robotsContent?.includes('noindex');

      // Extract schema markup
      const jsonLdEntities = extractJsonLd(html);
      const microdataEntities = extractMicrodata(html);
      const rdfaEntities = extractRdfa(html);
      const hasSchema = jsonLdEntities.length > 0 || microdataEntities.length > 0 || rdfaEntities.length > 0;
      const schemaTypes = [
        ...jsonLdEntities.map(e => e.raw?.['@type']).filter(Boolean),
        ...microdataEntities.map(e => e.raw?.['@type']).filter(Boolean),
        ...rdfaEntities.map(e => e.raw?.['@type']).filter(Boolean),
      ].map(t => Array.isArray(t) ? t[0] : t).filter(Boolean);

      pageBatch.push({
        pageUrl,
        statusCode,
        pageTitle,
        metaDesc,
        h1,
        wordCount,
        hasSchema,
        schemaTypes,
        htmlSize: html.length,
        canonical,
        robotsContent,
        isIndexable,
        jsonLdEntities,
        microdataEntities,
        rdfaEntities,
        html,
      });
    }

    // Batch insert pages
    const pageInserts = pageBatch.map(p => ({
      audit_id: auditId,
      url: p.pageUrl,
      status_code: p.statusCode,
      title: p.pageTitle || null,
      meta_description: p.metaDesc || null,
      h1: p.h1 || null,
      word_count: p.wordCount,
      has_schema: p.hasSchema,
      schema_types: p.schemaTypes,
      html_size: p.htmlSize,
      canonical_url: p.canonical,
      robots_meta: p.robotsContent,
      is_indexable: p.isIndexable,
    }));

    const { data: insertedPages, error: pagesError } = await supabase
      .from('pages')
      .insert(pageInserts)
      .select('id, url');

    if (pagesError) {
      console.error('Error batch inserting pages:', pagesError);
      throw new Error(`Failed to insert pages: ${pagesError.message}`);
    }

    // Map URLs to page IDs
    const urlToPageId = new Map<string, string>();
    for (const p of (insertedPages || [])) {
      urlToPageId.set(p.url, p.id);
    }

    // Process schema entities and SEO issues for each page
    const schemaInserts: any[] = [];

    for (const page of pageBatch) {
      const pageId = urlToPageId.get(page.pageUrl);
      if (!pageId) continue;

      const allSchemaEntities = [
        ...page.jsonLdEntities.map((e: any) => ({ ...e, format: 'json-ld' })),
        ...page.microdataEntities.map((e: any) => ({ ...e, format: 'microdata' })),
        ...page.rdfaEntities.map((e: any) => ({ ...e, format: 'rdfa' })),
      ];

      for (const entity of allSchemaEntities) {
        const typeStr = entity.raw?.['@type'];
        const isValid = entity.errors.length === 0;
        const propCount = typeof entity.raw === 'object' ? Object.keys(entity.raw).filter((k: string) => !k.startsWith('@')).length : 0;
        const typeKey = Array.isArray(typeStr) ? typeStr[0] : typeStr;
        const rules = typeKey && SCHEMA_RULES[typeKey];
        const hasRequired = rules ? rules.required.every((r: string) => entity.raw?.[r]) : true;

        schemaInserts.push({
          audit_id: auditId,
          page_id: pageId,
          schema_type: Array.isArray(typeStr) ? typeStr.join(', ') : (typeStr || 'Unknown'),
          source_format: entity.format,
          raw_json: entity.raw,
          is_valid: isValid,
          errors: entity.errors,
          warnings: entity.warnings,
          properties_count: propCount,
          has_required_fields: hasRequired,
        });

        for (const err of entity.errors) {
          allIssues.push({
            audit_id: auditId, page_id: pageId, category: 'schema', severity: 'critical',
            title: `Schema error: ${typeKey || 'Unknown'}`, description: err,
            evidence: JSON.stringify(entity.raw).substring(0, 500),
            impact_score: 8, effort: 'low',
          });
        }
        for (const warn of entity.warnings) {
          allIssues.push({
            audit_id: auditId, page_id: pageId, category: 'schema', severity: 'warning',
            title: `Schema warning: ${typeKey || 'Unknown'}`, description: warn,
            impact_score: 3, effort: 'low',
          });
        }
      }

      if (!page.hasSchema) {
        allIssues.push({
          audit_id: auditId, page_id: pageId, category: 'schema', severity: 'critical',
          title: 'No structured data found', description: 'This page has no schema markup (JSON-LD, Microdata, or RDFa).',
          fix_plan: 'Add JSON-LD schema markup appropriate for your page type.',
          impact_score: 12, effort: 'medium',
        });
      }

      // SEO analysis
      const seoIssues = analyzeSeo(page.html, page.pageUrl);
      for (const issue of seoIssues) {
        allIssues.push({ ...issue, audit_id: auditId, page_id: pageId });
      }

      // Content analysis
      if (page.wordCount < 300 && page.isIndexable) {
        allIssues.push({
          audit_id: auditId, page_id: pageId, category: 'content', severity: 'warning',
          title: 'Thin content', description: `Page has only ${page.wordCount} words. Aim for 300+ for indexable pages.`,
          fix_plan: 'Add more relevant, high-quality content.', impact_score: 6, effort: 'high',
        });
      }

      // Status code issues
      if (page.statusCode >= 400) {
        allIssues.push({
          audit_id: auditId, page_id: pageId, category: 'technical', severity: 'critical',
          title: `HTTP ${page.statusCode} error`, description: `Page returned status ${page.statusCode}.`,
          fix_plan: page.statusCode === 404 ? 'Fix the broken link or set up a redirect.' : 'Investigate and fix the server error.',
          impact_score: 12, effort: 'medium',
        });
      } else if (page.statusCode >= 300 && page.statusCode < 400) {
        allIssues.push({
          audit_id: auditId, page_id: pageId, category: 'technical', severity: 'info',
          title: `HTTP ${page.statusCode} redirect`, description: `Page returned a redirect (${page.statusCode}).`,
          fix_plan: 'Update internal links to point directly to the final URL.',
          impact_score: 3, effort: 'low',
        });
      }
    }

    // Batch insert schema entities
    if (schemaInserts.length > 0) {
      const { error: schemaError } = await supabase.from('schema_entities').insert(schemaInserts);
      if (schemaError) console.error('Error inserting schema entities:', schemaError);
    }

    // Batch insert issues
    if (allIssues.length > 0) {
      // Insert in chunks of 500 to avoid payload limits
      for (let i = 0; i < allIssues.length; i += 500) {
        const chunk = allIssues.slice(i, i + 500);
        const { error: issuesError } = await supabase.from('issues').insert(chunk);
        if (issuesError) console.error('Error inserting issues chunk:', issuesError);
      }
    }

    // Calculate scores
    const scores = calculateScores(allIssues, pageBatch.length);

    // Update audit with final results
    await supabase.from('audits').update({
      status: 'completed',
      overall_score: scores.overall,
      technical_score: scores.technical,
      onpage_score: scores.onpage,
      schema_score: scores.schema,
      crawl_health_score: scores.crawl_health,
      content_score: scores.content,
      completed_at: new Date().toISOString(),
    }).eq('id', auditId);

    console.log(`Audit completed. Score: ${scores.overall}`);

    return new Response(JSON.stringify({ success: true, scores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Audit error:', error);

    if (auditId) {
      try {
        await supabase.from('audits').update({
          status: 'failed',
          error_message: (error as Error).message,
        }).eq('id', auditId);
      } catch (e) {
        console.error('Failed to update audit status:', e);
      }
    }

    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
