import React from 'react';
import { List, Icon, Tag } from 'antd';
import pluginMap from '../babel/data/plugins.json';
import styles from './Plugin.module.scss';

const ALL_PLATFORMS = [
  'chrome',
  'firefox',
  'safari',
  'ie',
  'edge',
  'opera',
  'ios',
  'android',
  'node',
  'samsung',
  'electron',
  'phantom',
];

const ICON_MAP = {
  chrome: 'fab fa-chrome',
  edge: 'fab fa-edge',
  firefox: 'fab fa-firefox',
  safari: 'fab fa-safari',
  node: 'fab fa-node-js',
  ios: 'fab fa-apple',
  opera: 'fab fa-opera',
  ie: 'fab fa-internet-explorer',
  android: 'fab fa-android',
};

export default function Plugin({ plugin, diffMode, selectedPlatforms }) {
  let added = false;
  let removed = false;
  if (diffMode) {
    const inFirst = plugin[plugin.length - 2];
    const inSecond = plugin[plugin.length - 1];
    if (!inFirst && inSecond) {
      added = true;
    } else if (inFirst && !inSecond) {
      removed = true;
    }
  }

  return (
    <List.Item.Meta
      title={
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={`https://babeljs.io/docs/en/babel-plugin-${plugin[0]}`}
        >
          {plugin[0]} <Icon type="link" />{' '}
          {added && <Tag color="green">2nd config only</Tag>}{' '}
          {removed && <Tag color="red">1st config only</Tag>}
        </a>
      }
      description={
        <>
          <div>{JSON.stringify(plugin[1])}</div>
          <div>
            <PlatformList
              platforms={pluginMap[plugin[0]]}
              selectedPlatforms={selectedPlatforms}
            />
          </div>
        </>
      }
    />
  );
}

function PlatformList({ platforms, selectedPlatforms }) {
  if (typeof platforms !== 'object') return null;
  return (
    <>
      <b>{'Requires: '}</b>
      {ALL_PLATFORMS.map(platform => {
        const iconClass = ICON_MAP[platform];
        const icon = iconClass ? <i className={iconClass} /> : <b>{platform}</b>;
        const selected = platform in selectedPlatforms;
        return (
          <span
            key={platform}
            className={selected ? styles.itemSelected : styles.item}
          >
            {icon} {platforms[platform] || '-'}
          </span>
        );
      })}
    </>
  );
}

export function diff(plugins1, plugins2) {
  const map = {};
  const results = [];
  for (const plugin of plugins1) {
    const pluginDiff = [...plugin, true, false];
    results.push(pluginDiff);
    map[plugin[0]] = pluginDiff;
  }
  for (const plugin of plugins2) {
    let pluginDiff = map[plugin[0]];
    if (pluginDiff !== undefined) {
      pluginDiff[pluginDiff.length - 1] = true;
    } else {
      pluginDiff = [...plugin, false, true];
      results.push(pluginDiff);
      map[plugin[0]] = pluginDiff;
    }
  }
  return results;
}
