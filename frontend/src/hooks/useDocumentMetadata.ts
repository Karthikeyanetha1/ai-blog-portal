import { useEffect } from 'react';

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string | string[];
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any>;
}

export const useDocumentMetadata = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage,
  schema
}: MetadataProps) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes('Karthikeya Gurram') ? title : `${title} | Karthikeya Gurram`;
    document.title = fullTitle;

    // Helper function to set or create meta tag
    const setMetaTag = (name: string, value: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    };

    // 2. Update Description
    setMetaTag('description', description);
    setMetaTag('og:description', description, true);
    setMetaTag('twitter:description', description);

    // 3. Update Keywords
    if (keywords) {
      const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      setMetaTag('keywords', keywordsStr);
    }

    // 4. Update Open Graph details
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:url', window.location.href, true);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('twitter:image', ogImage);
    } else {
      const defaultImage = `${window.location.origin}/favicon.svg`;
      setMetaTag('og:image', defaultImage, true);
      setMetaTag('twitter:image', defaultImage);
    }

    // 5. Inject Structured Schema (JSON-LD)
    let scriptTag: HTMLScriptElement | null = null;
    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    // Cleanup function
    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, keywords, ogType, ogImage, schema]);
};
