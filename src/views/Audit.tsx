/* 描述: 产品评审
 */

import * as React from "react";
import DocumentTitle from "react-document-title";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Divider,
} from "antd";

import { StarOutlined, StarTwoTone, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/audit.less";

import { formatDate } from "@/utils/valid";

class Audit extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      textBtn: "提交",
      title: "添加任务",
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
      visible: false,
      dataSource: [],
      status: null, // 0：待办 1：完成 2：删除
    };
  }

  render() {
    return (
      <DocumentTitle title={"产品评审"}>
        <div className="audit-container">
          <Header curActive={"/audit"} />
          <div className="content">
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              参赛者信息
            </Divider>
            <div className="item">
              参赛团队：
              <Cascader
                fieldNames={{ label: "name", value: "code", children: "items" }}
                placeholder="请选择"
              />
              <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品/模块： </span>
              <Cascader
                fieldNames={{ label: "name", value: "code", children: "items" }}
                placeholder="请选择"
              />
              <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品投票得分： </span>
              <InputNumber min={0} placeholder="默认0" />
            </div>
          </div>
          <div className="content">
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              用例
            </Divider>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              size="small"
            >
              <Form.Item label="运行结果" name="size" initialValue={1}>
                <Radio.Group>
                  <Radio value={1} defaultChecked>
                    成功
                  </Radio>
                  <Radio value={0}>失败</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="有断言且成功：">
                <Form.Item
                  style={{
                    display: "inline-flex",
                    marginBottom: "0",
                    width: "calc(25% - 4px)",
                  }}
                  name="sucess_assert"
                >
                  <InputNumber min={0} placeholder="默认0" />
                </Form.Item>
                <Form.Item
                  style={{
                    display: "inline-flex",
                    marginBottom: "0",
                    width: "calc(35% - 4px)",
                    marginLeft: "0px",
                  }}
                  name="sucess_no_assert"
                  label="无断言但成功："
                >
                  <InputNumber min={0} placeholder="默认0" />
                </Form.Item>
                <Form.Item
                  style={{
                    display: "inline-flex",
                    marginBottom: "0",
                    width: "calc(35% - 4px)",
                    marginLeft: "8px",
                  }}
                  name="failed_assert"
                  label="有断言但断言失败："
                >
                  <InputNumber min={0} placeholder="默认0" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="异常失败：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="总个数：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="代码行数：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="质量评分：">
                <InputNumber min={0} max={100} placeholder="0~100" />
              </Form.Item>{" "}
              <Form.Item label="有效性评分：">
                <InputNumber min={0} max={100} placeholder="0~100" />
              </Form.Item>
            </Form>
          </div>
          <div className="content">
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              覆盖率
            </Divider>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size="small"
            >
              <Form.Item label="行覆盖率：">
                <InputNumber min={0} max={100} />%
              </Form.Item>
              <Form.Item label="分支覆盖率：">
                <InputNumber min={0} max={100} />%
              </Form.Item>
              <Form.Item label="产品质量评分：">
                <InputNumber min={0} max={100} placeholder="0~100" />
              </Form.Item>
            </Form>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default Audit;
