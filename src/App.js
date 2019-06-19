import React from 'react';
import { version as babelVersion } from './babel/package.json';
import { Collapse, Statistic, List, Switch } from 'antd';
import 'brace';
import AceEditor from 'react-ace';
import Plugin, { diff } from './components/Plugin';
import useBabelPresetInfo from './useBabelPresetInfo';

import 'brace/mode/json';
import 'brace/theme/github';
import useDebounce from './useDebounce';

import 'antd/dist/antd.css';
import styles from './App.module.scss';
import { useQueryParams, getQueryParams } from './useQueryParams.js';

const {
  value: initialValue1 = '{}',
  value2: initialValue2 = '{}',
} = getQueryParams();
const initialUseDiff = initialValue2 !== '{}';
// Render editor
function App() {
  const [diffMode, setDiffMode] = React.useState(initialUseDiff);
  const [value1, setValue1] = React.useState(initialValue1);
  const [value2, setValue2] = React.useState(initialValue2);
  const debouncedValue1 = useDebounce(value1, 100);
  const debouncedValue2 = useDebounce(value2, 100);
  const [plugins1, targets1, error1] = useBabelPresetInfo(debouncedValue1);
  const [plugins2, targets2, error2] = useBabelPresetInfo(debouncedValue2);

  useQueryParams({ value: debouncedValue1, value2: debouncedValue2 });

  return (
    <div className={styles.App}>
      <div className={styles.Editor}>
        <div className={styles.EditorToolbar}>
          <Switch
            checkedChildren="Diff Mode"
            unCheckedChildren="Diff Mode"
            checked={diffMode}
            onChange={setDiffMode}
          />
        </div>
        <div className={styles.EditorContainer}>
          <AceEditor
            mode="json"
            theme="github"
            width="100%"
            height={diffMode ? '50%' : '100%'}
            value={value1}
            onChange={setValue1}
            name="code1"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
          {diffMode ? (
            <AceEditor
              mode="json"
              theme="github"
              width="100%"
              height={diffMode ? '50%' : '100%'}
              value={value2}
              onChange={setValue2}
              name="code2"
              showPrintMargin={false}
              editorProps={{ $blockScrolling: true }}
              setOptions={{ useWorker: false }}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.Result}>
        {error1 || error2 ? (
          <pre>{error1 ? error1.toString() : error2.toString()}</pre>
        ) : (
          <Collapse
            bordered={false}
            defaultActiveKey={['browser1', 'browser2', 'plugin']}
          >
            {Object.keys(targets1).length > 0 ? (
              <Collapse.Panel
                header={`Minimum Browser Support${diffMode ? ' 1' : ''}`}
                key="browser1"
              >
                <List
                  grid={{ gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 6 }}
                  dataSource={Object.keys(targets1)}
                  renderItem={target => (
                    <List.Item>
                      <Statistic title={target} value={targets1[target]} />
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            ) : null}
            {Object.keys(targets2).length > 0 ? (
              <Collapse.Panel
                header={`Minimum Browser Support${diffMode ? ' 2' : ''}`}
                key="browser2"
              >
                <List
                  grid={{ gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 6 }}
                  dataSource={Object.keys(targets2)}
                  renderItem={target => (
                    <List.Item>
                      <Statistic title={target} value={targets2[target]} />
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            ) : null}
            <Collapse.Panel header="Plugins" key="2">
              <List
                size="large"
                itemLayout="horizontal"
                dataSource={diffMode ? diff(plugins1, plugins2) : plugins1}
                renderItem={plugin => (
                  <Plugin plugin={plugin} diffMode={diffMode} />
                )}
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
