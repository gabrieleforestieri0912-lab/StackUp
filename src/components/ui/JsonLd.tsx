import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renderizza un blocco JSON-LD (schema.org) nel <head> via Next.js.
 * Usa dangerouslySetInnerHTML con stringify sicuro (escape di </script>).
 */
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
