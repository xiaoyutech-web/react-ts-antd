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
import {
  queryProductScoreList,
  queryTeamList,
  queryProductList,
  submitProductScore,
} from "@/utils/api";
import { formatDate, isEmpty } from "@/utils/valid";
import { FormInstance } from "antd/lib/form";
interface Team {
  value: string;
  label: string;
}
interface ProductScore {
  testCaseRunable: number;
  testCaseAssertSuccess: number;
  testCaseNoAssertSuccess: number;
  testCaseAssertFailed: number;
  testCaseExceptionFailed: number;
  testCaseNumber: number;
  testCaseQuality: number;
  testCaseEfficiency: number;
  productCodeLine: number;
  productDensity: number;
  testCaseLineCoverage: number;
  testCaseBranchCoverage: number;
  productQualityScore: number;
  productFinalScore: number;
  productOverallScore: number;
  productVotedScore: number;
}
interface IState {
  total: number;
  pageNo: number;
  pageSize: number;

  did: string;
  tid: string;
  pdid: string;
  pid: string;
  mid: string;
  edit: boolean;
  testCaseRunable: number;
  productVotedScore: number;
  testCaseDensity: number; //计算出
  productOverallScore: number; //计算出
  productFinalScore: number; //计算出

  productScoreItem: ProductScore;
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
      productScoreItem: {
        testCaseRunable: 0,
        testCaseAssertSuccess: 0,
        testCaseNoAssertSuccess: 0,
        testCaseAssertFailed: 0,
        testCaseExceptionFailed: 0,
        testCaseNumber: 0,
        testCaseQuality: 0,
        testCaseEfficiency: 0,
        productCodeLine: 0,
        productDensity: 0,
        testCaseLineCoverage: 0,
        testCaseBranchCoverage: 0,
        productQualityScore: 0,
        productFinalScore: 0,
        productOverallScore: 0,
        productVotedScore: 0,
      },
      status: null, // 0：新建 1：完成 2：删除

      edit: true,

      did: "",
      tid: "",
      pdid: "",
      pid: "",
      mid: "",
      testCaseRunable: 1,
      productVotedScore: 0.0,

      testCaseDensity: 0, //计算出
      productOverallScore: 0.0, //计算出
      productFinalScore: 0.0, //计算出

      teamOptions: [],
      productOptions: [],
    };
  }
  formRef = React.createRef<FormInstance>();
  displayRender = (label: any) => {
    return label[label.length - 1];
  };
  limitNumber = (value: any) => {
    return !isNaN(value) ? String(value).replace(/^0(0+)|[^\d]+/g, "") : "";
  };
  onRunableChange = (e: any) => {
    // console.log("onRunableChange:" + e.target.value);
    if (e.target.value === 0) {
      //失败
      this.formRef.current!.setFieldsValue({
        testCaseAssertSuccess: 0,
        testCaseNoAssertSuccess: 0,
        testCaseAssertFailed: 0,
      });
    }
    this.setState({
      testCaseRunable: e.target.value,
    });
  };

  onTeamChange = (label: any) => {
    console.log("onTeamChange:" + label);
    this.setState({
      did: label[0],
      tid: label[1],
    });
  };
  onProductChange = (label: any) => {
    console.log("onProductChange:" + label);
    this.setState({
      pdid: label[0],
      pid: label[1],
      mid: label[2],
    });
  };
  onVotedScoreChange = (value: any) => {
    console.log("onVotedScoreChange:" + value);
    this.setState({
      productVotedScore: value,
    });
    this.onInputChange();
  };
  autoCalValue = (values: any) => {
    values.productVotedScore = this.state.productVotedScore;
    values.testCastDensity = this.calTestCaseDensity(
      values.testCaseAssertSuccess,
      values.productCodeLine
    );
    values.productOverallScore = this.calProductOverallScore(values);
    values.productFinalScore =
      values.testCastDensity + values.productOverallScore;
  };
  //刷新得分情况
  onInputChange = () => {
    let values = this.formRef.current!.getFieldsValue();
    console.log("onInputChange:" + values);
    this.autoCalValue(values);
    this.setState({
      productOverallScore: values.productOverallScore,
      productFinalScore: values.productFinalScore,
    });
  };
  componentDidMount() {
    console.log("componentDidMount===");
    //当去当前评审状态
    this.handleGetProductInfo();
  }

  // 获取任务列表数据
  handleGetProductInfo = () => {
    queryProductScoreList()
      .then((res: any) => {
        console.log("queryProductScoreList===", res);
        this.setState({
          loading: false,
        });

        if (res.code === 0) {
          if (res.data.size === 1) {
            //如果没有评审过，那么进行新建
            this.setState({
              edit: true,
            });
            this.handleGetTeamList();
            this.handleGetProductList();
          } else {
            //有评审，展示数据
            this.setState({
              edit: false,
            });
          }
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

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
  calTestCaseDensity = (testCaseAssertSuccess: any, productCodeLine: any) => {
    if (isEmpty(productCodeLine) || productCodeLine === 0) {
      return 0;
    }
    if (isEmpty(testCaseAssertSuccess)) {
      return 0;
    }
    return (testCaseAssertSuccess * 1000) / productCodeLine; // 返回2位小数
  };
  calProductOverallScore = (values: any) => {
    let sum = 0;
    if (!isEmpty(values.testCaseQuality)) {
      sum += values.testCaseQuality * 0.2;
    }
    if (!isEmpty(values.testCaseEfficiency)) {
      sum += values.testCaseEfficiency * 0.1;
    }
    sum += values.testCastDensity * 0.3;
    if (!isEmpty(values.testCaseLineCoverage)) {
      sum += values.testCaseLineCoverage * 0.2;
    }
    if (!isEmpty(values.testCaseBranchCoverage)) {
      sum += values.testCaseBranchCoverage * 0.1;
    }
    if (!isEmpty(values.productQualityScore)) {
      sum += values.productQualityScore * 0.1;
    }
    return sum; // 返回2位小数
  };

  onSubmit = () => {
    if (isEmpty(this.state.tid) || isEmpty(this.state.mid)) {
      message.error("请完善参赛团队/被评审产品模块信息");
      return;
    }
    let values = this.formRef.current!.getFieldsValue();
    values.did = this.state.did;
    values.tid = this.state.tid;
    values.pdid = this.state.pdid;
    values.pid = this.state.pid;
    values.mid = this.state.mid;
    console.log("onSubmit values:===", values);
    this.autoCalValue(values);
    console.log("onSubmit===", values);
    submitProductScore(values).then((res: any) => {
      console.log("submitProductScore===", res);
      if (res.code === 0) {
        message.success("提交成功");
      } else {
        message.error(res.message);
      }
    });
  };

  render() {
    const {
      teamOptions,
      productOptions,
      testCaseRunable,
      edit,
      productScoreItem,
    } = this.state;

    const info = (
      <div className="content">
        <div>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            参赛者信息
          </Divider>
          <div className="item">
            参赛团队：
            {productScoreItem.testCaseNoAssertSuccess}
            <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品/模块： </span>
            {productScoreItem.testCaseNoAssertSuccess}
            <span> &nbsp; &nbsp; &nbsp; &nbsp;被评审产品投票得分： </span>
            {productScoreItem.testCaseNoAssertSuccess}
          </div>
        </div>
        <div>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            用例
          </Divider>
          <Form
            onFieldsChange={this.onInputChange}
            ref={this.formRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            layout="horizontal"
            size="small"
          >
            <Form.Item label="运行结果" name="testCaseRunable">
              {productScoreItem.testCaseRunable === 1 ? "成功" : "失败"}
            </Form.Item>
            <Form.Item label="有断言且成功：">
              <Form.Item
                style={{
                  display: "inline-flex",
                  marginBottom: "0",
                  width: "calc(25% - 4px)",
                }}
                name="testCaseAssertSuccess"
              >
                {productScoreItem.testCaseAssertSuccess}
              </Form.Item>
              <Form.Item
                name="testCaseNoAssertSuccess"
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
                name="testCaseAssertFailed"
                label="有断言但断言失败："
              >
                {productScoreItem.testCaseAssertFailed}
              </Form.Item>
            </Form.Item>
            <Form.Item label="异常失败：" name="testCaseExceptionFailed">
              {productScoreItem.testCaseExceptionFailed}
            </Form.Item>{" "}
            <Form.Item label="总个数：" name="testCaseNumber">
              {productScoreItem.testCaseNumber}
            </Form.Item>{" "}
            <Form.Item label="代码行数：" name="productCodeLine">
              {productScoreItem.productCodeLine}
            </Form.Item>{" "}
            <Form.Item label="质量评分：" name="testCaseQuality">
              {productScoreItem.testCaseQuality}
            </Form.Item>{" "}
            <Form.Item label="有效性评分：" name="testCaseEfficiency">
              {productScoreItem.testCaseEfficiency}
            </Form.Item>
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              覆盖率
            </Divider>
            <Form.Item name="testCaseLineCoverage" label="行覆盖率：">
              {productScoreItem.testCaseLineCoverage}
            </Form.Item>
            <Form.Item name="testCaseBranchCoverage" label="分支覆盖率：">
              {productScoreItem.testCaseBranchCoverage}
            </Form.Item>
            <Form.Item name="productQualityScore" label="产品质量评分：">
              {productScoreItem.productQualityScore}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
    const editInfo = (
      <div className="content">
        <div>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            参赛者信息
          </Divider>
          <div className="item">
            参赛团队：
            <Cascader
              onChange={this.onTeamChange}
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
              onChange={this.onProductChange}
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
            <InputNumber
              onChange={this.onVotedScoreChange}
              min={0}
              max={100}
              placeholder="0~100"
            />
          </div>
        </div>
        <div>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            用例
          </Divider>
          <Form
            onFieldsChange={this.onInputChange}
            ref={this.formRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            layout="horizontal"
            size="small"
          >
            <Form.Item
              label="运行结果"
              name="testCaseRunable"
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
                name="testCaseAssertSuccess"
              >
                <InputNumber
                  formatter={this.limitNumber}
                  parser={this.limitNumber}
                  disabled={testCaseRunable === 0}
                  min={0}
                  placeholder="默认0"
                />
              </Form.Item>
              <Form.Item
                name="testCaseNoAssertSuccess"
                style={{
                  display: "inline-flex",
                  marginBottom: "0",
                  width: "calc(35% - 4px)",
                  marginLeft: "0px",
                }}
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
                name="testCaseAssertFailed"
                label="有断言但断言失败："
              >
                <InputNumber
                  disabled={testCaseRunable === 0}
                  min={0}
                  placeholder="默认0"
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="异常失败：" name="testCaseExceptionFailed">
              <InputNumber min={0} />
            </Form.Item>{" "}
            <Form.Item label="总个数：" name="testCaseNumber">
              <InputNumber min={0} />
            </Form.Item>{" "}
            <Form.Item label="代码行数：" name="productCodeLine">
              <InputNumber min={0} />
            </Form.Item>{" "}
            <Form.Item label="质量评分：" name="testCaseQuality">
              <InputNumber min={0} max={100} placeholder="0~100" />
            </Form.Item>{" "}
            <Form.Item label="有效性评分：" name="testCaseEfficiency">
              <InputNumber min={0} max={100} placeholder="0~100" />
            </Form.Item>
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              覆盖率
            </Divider>
            <Form.Item name="testCaseLineCoverage" label="行覆盖率：">
              <InputNumber min={0} max={100}></InputNumber>
            </Form.Item>
            <Form.Item name="testCaseBranchCoverage" label="分支覆盖率：">
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item name="productQualityScore" label="产品质量评分：">
              <InputNumber min={0} max={100} placeholder="0~100" />
            </Form.Item>
          </Form>
        </div>
      </div>
    );

    return (
      <DocumentTitle title={"产品评审"}>
        <div className="audit-container">
          <Header curActive={"/audit"} />
          {!edit ? info : editInfo}
          <Footer />
          <Affix offsetBottom={70} onChange={(affixed) => console.log(affixed)}>
            <div className="pannel">
              <span>投票得分：{this.state.productVotedScore}</span>
              <span>综合得分：{this.state.productOverallScore}</span>
              <span>总分：{this.state.productFinalScore}</span>
              <Button onClick={this.onSubmit}>提交</Button>
            </div>
          </Affix>
        </div>
      </DocumentTitle>
    );
  }
}

export default Audit;
