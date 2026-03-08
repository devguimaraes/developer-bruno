import React from 'react';
import { siteConfig } from '@/config/site';
import { serializeJSONForScript } from '@/lib/utils';
import { getDefaultStructuredDataSchemas } from '@/lib/structured-data';

const StructuredData: React.FC = () => {
  if (!siteConfig.brazilianMarket) return null;

  const schemas = getDefaultStructuredDataSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJSONForScript(schema)
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
