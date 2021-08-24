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
import "@/styles/home.less";

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
        <div className="home-container">
          <Header curActive={"/audit"} />
          <div className="content">
            <Divider orientation="left">参赛者信息</Divider>
            参赛团队：
            <Cascader
              fieldNames={{ label: "name", value: "code", children: "items" }}
              placeholder="Please select"
            />
            被评审产品/模块：
            <Cascader
              fieldNames={{ label: "name", value: "code", children: "items" }}
              placeholder="Please select"
            />
          </div>
          <div>
            <Divider orientation="left">用例</Divider>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size="small"
            >
              <Form.Item label="运行结果" name="size">
                <Radio.Group>
                  <Radio value="1" defaultChecked>
                    成功
                  </Radio>
                  <Radio value="0">失败</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="有断言且成功：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="无断言但成功：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="有断言且断言失败：">
                <InputNumber min={0} />
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
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="有效性评分：">
                <InputNumber min={0} />
              </Form.Item>
            </Form>
          </div>
          <div>
            <Divider orientation="left">覆盖率</Divider>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size="small"
            >
              <Form.Item label="行覆盖率：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="分支覆盖率：">
                <InputNumber min={0} />
              </Form.Item>{" "}
              <Form.Item label="产品质量评分：">
                <InputNumber min={0} />
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
