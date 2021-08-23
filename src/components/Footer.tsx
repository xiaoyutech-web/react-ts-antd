 /* 描述: 底部footer模板
 */

import * as React from 'react';
import '@/styles/footer.less';

export default class Footer extends React.Component {
    render () {
        return (
            <div className="footer-container">
                <div className="footer">
                    <div className="copyright">
                        Copyright@2021 中移（杭州）信息技术有限公司
                    </div>
                </div>
            </div>
        )
    }
}