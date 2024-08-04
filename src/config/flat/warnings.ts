import type { PluginFlatBaseConfig } from '../../types'

/**
 * more opinionated config.
 */
export default {
  rules: {
    'import-x/no-named-as-default': 1,
    'import-x/no-named-as-default-member': 1,
    'import-x/no-duplicates': 1,
  },
} satisfies PluginFlatBaseConfig;
