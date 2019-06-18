import React from 'react';
import normalizeOptions from './babel/src/normalize-options';
import moduleTransformations from './babel/src/module-transformations';
import getOptionSpecificExcludesFor from './babel/src/get-option-specific-excludes';
import getTargets from './babel/src/targets-parser';
import filterItems from './babel/src/filter-items';
import pluginList from './babel/data/plugins.json';
import {
  proposalPlugins,
  pluginSyntaxMap,
} from './babel/data/shipped-proposals';
import { filterStageFromList } from './babel/src/utils';

const pluginListWithoutProposals = filterStageFromList(
  pluginList,
  proposalPlugins
);

const transformIncludesAndExcludes = (opts: Array<string>): Object => {
  return opts.reduce(
    (result, opt) => {
      const target = opt.match(/^(es|es6|es7|esnext|web)\./)
        ? 'builtIns'
        : 'plugins';
      result[target].add(opt);
      return result;
    },
    {
      all: opts,
      plugins: new Set(),
      builtIns: new Set(),
    }
  );
};

function getPresetInformation(opts) {
  const {
    configPath,
    debug,
    exclude: optionsExclude,
    forceAllTransforms,
    ignoreBrowserslistConfig,
    include: optionsInclude,
    loose,
    modules,
    shippedProposals,
    spec,
    targets: optionsTargets,
    useBuiltIns,
    corejs: { version: corejs, proposals },
  } = normalizeOptions(opts);
  const targets = getTargets(optionsTargets, {
    ignoreBrowserslistConfig,
    configPath,
  });
  const include = transformIncludesAndExcludes(optionsInclude);
  const exclude = transformIncludesAndExcludes(optionsExclude);

  const transformTargets = forceAllTransforms || targets;

  const transformations = filterItems(
    shippedProposals ? pluginList : pluginListWithoutProposals,
    include.plugins,
    exclude.plugins,
    transformTargets,
    null,
    getOptionSpecificExcludesFor({ loose }),
    pluginSyntaxMap
  );

  const plugins = [];
  const pluginUseBuiltIns = useBuiltIns !== false;

  if (modules !== false && moduleTransformations[modules]) {
    // NOTE: not giving spec here yet to avoid compatibility issues when
    // transform-modules-commonjs gets its spec mode
    plugins.push([moduleTransformations[modules], { loose }]);
  }

  transformations.forEach(pluginName =>
    plugins.push([pluginName, { spec, loose, useBuiltIns: pluginUseBuiltIns }])
  );

  if (useBuiltIns === 'usage' || useBuiltIns === 'entry') {
    const regenerator = transformations.has('transform-regenerator');

    const pluginOptions = {
      corejs,
      polyfillTargets: targets,
      include: include.builtIns,
      exclude: exclude.builtIns,
      proposals,
      shippedProposals,
      regenerator,
      debug,
    };

    if (corejs) {
      if (useBuiltIns === 'usage') {
        if (corejs.major === 2) {
          plugins.push(['addCoreJS2UsagePlugin', pluginOptions]);
        } else {
          plugins.push(['addCoreJS3UsagePlugin', pluginOptions]);
        }
        if (regenerator) {
          plugins.push(['addRegeneratorUsagePlugin', pluginOptions]);
        }
      } else {
        if (corejs.major === 2) {
          plugins.push(['replaceCoreJS2EntryPlugin', pluginOptions]);
        } else {
          plugins.push(['replaceCoreJS3EntryPlugin', pluginOptions]);
          if (!regenerator) {
            plugins.push(['removeRegeneratorEntryPlugin', pluginOptions]);
          }
        }
      }
    }
  }
  return { plugins, targets: transformTargets };
}

export default function useBabelPresetInfo() {
  const [plugins, setPlugins] = React.useState([]);
  const [targets, setTargets] = React.useState([]);

  const getPresetInfo = value => {
    const options = JSON.parse(value);
    const { plugins, targets } = getPresetInformation(options);
    setPlugins(plugins);
    setTargets(targets);
  };
  return [getPresetInfo, plugins, targets];
}
