import React from 'react';
import { version as babelVersion } from './babel/package.json';
import { Collapse, Statistic, List } from 'antd';
import 'brace';
import AceEditor from 'react-ace';
import Plugin from './components/Plugin';
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
      <div className={styles.Editor}>
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
      <div className={styles.Result}>
        {error ? (
          <pre>{error.toString()}</pre>
        ) : (
          <Collapse bordered={false} defaultActiveKey={['1', '2']}>
            {Object.keys(targets).length > 0 ? (
              <Collapse.Panel header="Minimum Browser Support" key="1">
                <List
                  grid={{ gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 6 }}
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
                renderItem={plugin => <Plugin plugin={plugin} />}
              />
            </Collapse.Panel>
          </Collapse>
        )}
      </div>
      <div className={styles.Footer}>
        <b>@babel/preset-env version: {babelVersion}</b>
        {' | Built with '}
        <a
          href="https://reactjs.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          React
        </a>
        {', '}
        <a href="https://ant.design" rel="noopener noreferrer" target="_blank">
          Ant Design
        </a>
        {', '}
        <a href="http://babeljs.io" rel="noopener noreferrer" target="_blank">
          Babel
        </a>
        {' and ❤| '}
        <a
          href="https://github.com/tanhauhau/babel-preset-env"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github
        </a>
      </div>
    </div>
  );
}

export default App;
