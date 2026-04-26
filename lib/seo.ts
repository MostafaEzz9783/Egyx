import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.defaultPoster,
  keywords = []
}: MetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image]
    }
  };
}

export function buildMovieJsonLd(input: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  genre: string[];
  aggregateRating?: number;
  duration?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: input.title,
    description: input.description,
    image: input.image,
    url: input.url,
    datePublished: input.datePublished,
    genre: input.genre,
    duration: input.duration ? `PT${input.duration}M` : undefined,
    aggregateRating: input.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: input.aggregateRating,
          bestRating: 10,
          worstRating: 1
        }
      : undefined
  };
}

export function buildSeriesJsonLd(input: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  genre: string[];
  aggregateRating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: input.title,
    description: input.description,
    image: input.image,
    url: input.url,
    datePublished: input.datePublished,
    genre: input.genre,
    aggregateRating: input.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: input.aggregateRating,
          bestRating: 10,
          worstRating: 1
        }
      : undefined
  };
}
