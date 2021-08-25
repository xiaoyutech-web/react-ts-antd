/* 描述: 产品评审
 */
import * as React from "react";
import DocumentTitle from "react-document-title";
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

import { StarOutlined, StarTwoTone, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/audit.less";
import { queryTeamList, queryProductList } from "@/utils/api";
import { formatDate } from "@/utils/valid";

interface Team {
  value: string;
  label: string;
}

interface IState {
  total: number;
  pageNo: number;
  pageSize: number;
  productVotedScore: number;

  edit: boolean;
  testCaseRunable: number;
  testCaseAssertSuccess: number;
  testCaseNoAssertSuccess: number;
  testCaseAssertFailed: number;

  testCaseExceptionFailed: number;
  testCaseNumber: number;
  productCodeLine: number;
  testCaseQuality: number;
  testCaseEfficiency: number;

  testCaseLineCoverage: number;
  testCaseBranchCoverage: number;
  productQualityScore: number;

  productFinalScore: number; //计算出

  loading: boolean;
  textBtn: string;

  title: string;
  visible: boolean;

  status: any;
  teamOptions: Team[];
  productOptions: Team[];
}
class Audit extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      textBtn: "提交",
      title: "添加任务",
      visible: false,

      status: null, // 0：新建 1：完成 2：删除

      edit: true,
      productVotedScore: 0,

      testCaseRunable: 1,
      testCaseAssertSuccess: 0,
      testCaseNoAssertSuccess: 0,
      testCaseAssertFailed: 0,

      testCaseExceptionFailed: 0,
      testCaseNumber: 0,
      productCodeLine: 0,
      testCaseQuality: 0,
      testCaseEfficiency: 0,

      testCaseLineCoverage: 0,
      testCaseBranchCoverage: 0,
      productQualityScore: 0,

      productFinalScore: 0, //计算出
      teamOptions: [],
      productOptions: [],
    };
  }
  onRunableChange = (e: any) => {
    console.log("onRunableChange:" + e.target.value);
    this.setState({
      testCaseRunable: e.target.value,
    });
  };
  displayRender = (label: any) => {
    return label[label.length - 1];
  };

  componentDidMount() {
    console.log("componentDidMount===");
    //当去当前评审状态
    //如果没有评审过，那么进行新建
    this.handleGetTeamList();
    this.handleGetProductList();
  }

  handleGetTeamList = () => {
    queryTeamList().then((res: any) => {
      console.log("queryTeamList===", res);
      if (res.code === 0) {
        this.setState({
          teamOptions: res.data,
        });
      } else {
        message.error(res.message);
      }
    });
  };
  handleGetProductList = () => {
    queryProductList().then((res: any) => {
      console.log("queryProductList===", res);
      if (res.code === 0) {
        this.setState({
          productOptions: res.data,
        });
      } else {
        message.error(res.message);
      }
    });
  };
  render() {
    const { teamOptions, productOptions, testCaseRunable } = this.state;
    return (
      <DocumentTitle title={"产品评审"}>
        <div className="audit-container">

          <Header curActive={"/audit"} />
          <div className="content">
            <div>
              <Divider orientation="left" style={{ fontWeight: "bold" }}>
                参赛者信息
              </Divider>
              <div className="item">
                参赛团队：
                <Cascader
                  options={teamOptions}
                  expandTrigger="hover"
                  // displayRender={this.displayRender}
                  fieldNames={{
                    label: "label",
                    value: "value",
                    children: "children",
                  }}
                  placeholder="请选择"
                />
                <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品/模块： </span>
                <Cascader
                  options={productOptions}
                  expandTrigger="hover"
                  // displayRender={this.displayRender}
                  fieldNames={{
                    label: "label",
                    value: "value",
                    children: "children",
                  }}
                  placeholder="请选择"
                />
                <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品投票得分： </span>
                <InputNumber min={0} max={100} placeholder="0~100" />
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
                <Form.Item
                  label="运行结果"
                  name="size"
                  initialValue={testCaseRunable}
                >
                  <Radio.Group onChange={this.onRunableChange}>
                    <Radio value={1}>成功</Radio>
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
                    <InputNumber
                      disabled={testCaseRunable === 0}
                      min={0}
                      placeholder="默认0"
                    />
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
                    <InputNumber
                      disabled={testCaseRunable === 0}
                      min={0}
                      placeholder="默认0"
                    />
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
                    <InputNumber
                      disabled={testCaseRunable === 0}
                      min={0}
                      placeholder="默认0"
                    />
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
            <div>
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
          </div>

          <Footer />
          <Affix offsetBottom={70} onChange={(affixed) => console.log(affixed)}>
            <div className="pannel">
              <span>综合得分：90</span>
              <span>总分：95</span>
              <Button>提交</Button>
            </div>
          </Affix>
        </div>
      </DocumentTitle>
    );
  }
}

export default Audit;
