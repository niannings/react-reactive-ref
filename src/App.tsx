import React, { useState } from 'react';
import DemoNormal from './Form/demo/DemoNormal';
import DemoValidate from './Form/demo/DemoValide';

import './App.css';

export default function Demo() {
    const [activeKey, setActiveKey] = useState(0);
    const content = [<DemoNormal />, <DemoValidate />];

    return (
        <div className="App">
            <div>
                <button onClick={() => setActiveKey(0)} className={activeKey === 0 ? 'active' : ''} style={{ marginRight: 20 }}>很多表单</button>
                <button onClick={() => setActiveKey(1)} className={activeKey === 1 ? 'active' : ''}>表单校验</button>
            </div>
            <div className="demo-box">{content[activeKey]}</div>
        </div>
    );
}
