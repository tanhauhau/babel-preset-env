import React from 'react';
import { Button } from 'antd';
import 'brace';
import AceEditor from 'react-ace';
import useBabelPresetInfo from './useBabelPresetInfo';

import 'brace/mode/json';
import 'brace/theme/github';

// Render editor
function App() {
  const [value, setValue] = React.useState('');
  const [getPresetInfo, plugins, targets] = useBabelPresetInfo();
  return (
    <div>
      <AceEditor
        mode="json"
        theme="github"
        value={value}
        onChange={setValue}
        name="babel-preset-env"
        editorProps={{ $blockScrolling: true }}
      />
      <Button
        onClick={() => {
          getPresetInfo(value);
        }}
      >
        Run
      </Button>
      <div>{JSON.stringify(plugins)}</div>
      <div>{JSON.stringify(targets)}</div>
    </div>
  );
}


export default App;
