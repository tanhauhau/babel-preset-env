import React from 'react';
import { List, Icon } from 'antd';
import pluginMap from '../babel/data/plugins.json';

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

export default function Plugin({ plugin }) {
  return (
    <List.Item.Meta
      title={
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={`https://babeljs.io/docs/en/babel-plugin-${plugin[0]}`}
        >
          {plugin[0]} <Icon type="link" />
        </a>
      }
      description={
        <>
          <div>{JSON.stringify(plugin[1])}</div>
          <div>
            <PlatformList platforms={pluginMap[plugin[0]]} />
          </div>
        </>
      }
    />
  );
}

function PlatformList({ platforms }) {
  if (typeof platforms !== 'object') return null;
  return (
    <>
      <b>{'Requires: '}</b>
      {Object.keys(platforms).map(platform => {
        const iconClass = ICON_MAP[platform];
        const icon = iconClass ? <i class={iconClass} /> : <b>{platform}</b>;
        return (
          <span style={{ marginRight: 12 }}>
            {icon} {platforms[platform]}
          </span>
        );
      })}
    </>
  );
}
