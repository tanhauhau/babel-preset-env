import React from 'react';
import { version as babelVersion } from './babel/package.json';
import { Collapse, Statistic, List, Icon } from 'antd';
import 'brace';
import AceEditor from 'react-ace';
import useBabelPresetInfo from './useBabelPresetInfo';

import 'brace/mode/json';
import 'brace/theme/github';
import useDebounce from './useDebounce';

import 'antd/dist/antd.css';
import styles from './App.module.scss';
import { useQueryParams, getQueryParams } from './useQueryParams.js';

const { value: initialValue = '{}' } = getQueryParams();

// Render editor
function App() {
  const [value, setValue] = React.useState(initialValue);
  const debouncedValue = useDebounce(value, 100);
  const [plugins, targets, error] = useBabelPresetInfo(debouncedValue);
  
  useQueryParams({ value: debouncedValue });

  return (
    <div className={styles.App}>
      <div className={styles.Container}>
        <b>@babel/preset-env version: {babelVersion}</b>
        <AceEditor
          mode="json"
          theme="github"
          width="100%"
          height="100%"
          value={value}
          onChange={setValue}
          name="babel-preset-env"
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          setOptions={{ useWorker: false }}
        />
      </div>
      <div className={styles.Container}>
        {error ? (
          <pre>{error.toString()}</pre>
        ) : (
          <Collapse bordered={false} defaultActiveKey={['1', '2']}>
            {Object.keys(targets).length > 0 ? (
              <Collapse.Panel header="Minimum Browser Support" key="1">
                <List
                  grid={{ gutter: 16, column: 4 }}
                  dataSource={Object.keys(targets)}
                  renderItem={target => (
                    <List.Item>
                      <Statistic title={target} value={targets[target]} />
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            ) : null}
            <Collapse.Panel header="Plugins" key="2">
              <List
                itemLayout="horizontal"
                dataSource={plugins}
                renderItem={plugin => (
                  <List.Item.Meta
                    title={
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`https://babeljs.io/docs/en/babel-plugin-${
                          plugin[0]
                        }`}
                      >
                        {plugin[0]} <Icon type="link" />
                      </a>
                    }
                    description={JSON.stringify(plugin[1])}
                  />
                )}
              />
            </Collapse.Panel>
          </Collapse>
        )}
      </div>
    </div>
  );
}

export default App;
