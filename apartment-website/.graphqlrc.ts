import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const schemaUrl = process.env.GQL_API_URL;

if (!schemaUrl) {
  console.error(
    'Before GraphQL types can be generated, you need to set GQL_API_URL environment variable.'
  );
  process.exit(1);
}

const config = {
  overwrite: true,
  schema: schemaUrl,
  documents: ['./graphql/**/*.graphql', './graphql/**/*.gql'],
  generates: {
    'gql/': {
      preset: 'client',
      plugins: [],
      config: {
        documentMode: 'string',
        useTypeImports: true,
        strictScalars: true,
        scalars: {},
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
