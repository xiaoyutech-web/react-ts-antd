/* 描述: 底部footer模板
 */

import * as React from "react";
import "@/styles/audit.less";
import {
  Form,
  Input,
  Button,
  Radio,
  message,
  Cascader,
  Affix,
  InputNumber,
  TreeSelect,
  Switch,
  Divider,
} from "antd";
const ScoreInfo = (props: any) => {
  const { productScoreItem } = props;
  const result = () => {
    if (productScoreItem.testCaseRunable === 1) {
      return "成功";
    } else if (productScoreItem.testCaseRunable === 0) {
      return "失败";
    } else {
      return "--";
    }
  };

  return (
    <div className="content">
      <div>
        <Divider orientation="left" style={{ fontWeight: "bold" }}>
          参赛者信息
        </Divider>
        <div className="item">
          参赛团队：
          {productScoreItem.department}/{productScoreItem.team}
          <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品/模块： </span>
          {productScoreItem.pdepartment}/{productScoreItem.product}/{" "}
          {productScoreItem.module}
          <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品投票得分： </span>
          {productScoreItem.productVotedScore}
        </div>
      </div>
      <div>
        <Divider orientation="left" style={{ fontWeight: "bold" }}>
          用例
        </Divider>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          layout="horizontal"
          size="small"
        >
          <Form.Item label="运行结果">{result()}</Form.Item>
          <Form.Item label="有断言且成功：">
            <Form.Item
              style={{
                display: "inline-flex",
                marginBottom: "0",
                width: "calc(25% - 4px)",
              }}
            >
              {productScoreItem.testCaseAssertSuccess}
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-flex",
                marginBottom: "0",
                width: "calc(35% - 4px)",
                marginLeft: "0px",
              }}
              label="无断言但成功："
            >
              {productScoreItem.testCaseNoAssertSuccess}
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-flex",
                marginBottom: "0",
                width: "calc(35% - 4px)",
                marginLeft: "8px",
              }}
              label="有断言但断言失败："
            >
              {productScoreItem.testCaseAssertFailed}
            </Form.Item>
          </Form.Item>
          <Form.Item label="异常失败：">
            {productScoreItem.testCaseExceptionFailed}
          </Form.Item>{" "}
          <Form.Item label="总个数：">
            {productScoreItem.testCaseNumber}
          </Form.Item>{" "}
          <Form.Item label="代码行数：">
            {productScoreItem.productCodeLine}
          </Form.Item>{" "}
          <Form.Item label="质量评分：">
            {productScoreItem.testCaseQuality}
          </Form.Item>{" "}
          <Form.Item label="有效性评分：">
            {productScoreItem.testCaseEfficiency}
          </Form.Item>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            覆盖率
          </Divider>
          <Form.Item label="行覆盖率：">
            {productScoreItem.testCaseLineCoverage}
          </Form.Item>
          <Form.Item label="分支覆盖率：">
            {productScoreItem.testCaseBranchCoverage}
          </Form.Item>
          <Form.Item label="产品质量评分：">
            {productScoreItem.productQualityScore}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default ScoreInfo;
