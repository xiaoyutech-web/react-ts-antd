/* 描述: 产品评审
 */
import * as React from "react";
import * as math from "mathjs";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
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
import store from "@/store";
import { StarOutlined, StarTwoTone, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/audit.less";
import {
  queryProductScoreList,
  queryTeamList,
  queryProductList,
  submitProductScore,
  updateProductScore,
} from "@/utils/api";
import { formatDate, isEmpty } from "@/utils/valid";
const precision = 4;
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
  testCaseDensity: number;
  testCaseLineCoverage: number;
  testCaseBranchCoverage: number;
  productQualityScore: number;
  productFinalScore: number;
  productOverallScore: number;
  productVotedScore: number;
  sid: string;
  did: string;
  tid: string;
  pdid: string;
  pid: string;
  mid: string;
  department: string;
  pdepartment: string;
  team: string;
  product: string;
  module: string;
}
interface IState {
  total: number;
  pageNo: number;
  pageSize: number;

  // did: string;
  // tid: string;
  // pdid: string;
  // pid: string;
  // mid: string;
  edit: boolean;
  // testCaseRunable: number;
  // productVotedScore: number;
  // testCaseDensity: number; //计算出
  // productOverallScore: number; //计算出
  // productFinalScore: number; //计算出

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
        testCaseRunable: 1,
        testCaseAssertSuccess: 0,
        testCaseNoAssertSuccess: 0,
        testCaseAssertFailed: 0,
        testCaseExceptionFailed: 0,
        testCaseNumber: 0,
        testCaseQuality: 0,
        testCaseEfficiency: 0,
        productCodeLine: 0,
        testCaseDensity: 0,
        testCaseLineCoverage: 0,
        testCaseBranchCoverage: 0,
        productQualityScore: 0,
        productFinalScore: 0,
        productOverallScore: 0,
        productVotedScore: 0,
        sid: "",
        did: "",
        tid: "",
        pdid: "",
        pid: "",
        mid: "",
        department: "--",
        pdepartment: "--",
        team: "--",
        product: "--",
        module: "--",
      },
      status: null, // 0：新建 1：完成 2：删除

      edit: false,

      // did: "",
      // tid: "",
      // pdid: "",
      // pid: "",
      // mid: "",
      // testCaseRunable: 1,
      // productVotedScore: 0.0,

      // testCaseDensity: 0, //计算出
      // productOverallScore: 0.0, //计算出
      // productFinalScore: 0.0, //计算出

      teamOptions: [],
      productOptions: [],
    };
  }

  formRef = React.createRef<FormInstance>();
  displayRender = (label: any) => {
    return label[label.length - 1];
  };
  limitNumber = (value: any) => {
    //整数
    return String(value).replace(/^0(0+)|[^\d]+/g, "");
    // return !isNaN(value) ? String(value).replace(/^0(0+)|[^\d]+/g, "") : "";
  };
  limitPrecisionNumber = (value: any) => {
    //可输入小数，只有一个小数点
    var result = String(value).replace(/[^\d.]/g, "");
    var dot = result.split(".").length - 1;
    if (dot > 1) {
      return result.substr(0, result.lastIndexOf("."));
    }
    return result;
    // return String(value).replace(/[^\d.]/g,"");
    // return String(value).replace(/^0(0+)|[^\d]+/g, "");
    // return !isNaN(value) ? String(value).replace(/^0(0+)|[^\d]+/g, "") : "";
  };
  onTeamChange = (label: any) => {
    console.log("onTeamChange:" + label);
    let data = Object.assign({}, this.state.productScoreItem, {
      did: label[0],
      tid: label[1],
    });
    this.setState({
      productScoreItem: data,
    });
  };
  onProductChange = (label: any) => {
    console.log("onProductChange:" + label);
    let data = Object.assign({}, this.state.productScoreItem, {
      pdid: label[0],
      pid: label[1],
      mid: label[2],
    });
    this.setState({
      productScoreItem: data,
    });
  };
  onVotedScoreChange = (value: any) => {
    let values = Object.assign({}, this.state.productScoreItem, {
      productVotedScore: value,
    });
    console.log("onVotedScoreChange:" + JSON.stringify(values));
    this.autoCalValue(values, value);
    console.log("onVotedScoreChange after cal:" + JSON.stringify(values));
    let data = Object.assign({}, values, {
      testCaseDensity: values.testCaseDensity,
      productOverallScore: values.productOverallScore,
      productFinalScore: values.productFinalScore,
    });
    this.setState({
      productScoreItem: data,
    });
  };

  //刷新得分情况
  onInputChange = () => {
    let values = this.formRef.current!.getFieldsValue(); //
    console.log("onInputChange:" + JSON.stringify(values));
    this.autoCalValue(values, this.state.productScoreItem.productVotedScore);
    console.log("onInputChange after cal:" + JSON.stringify(values));
    let data = Object.assign({}, this.state.productScoreItem, {
      testCaseDensity: values.testCaseDensity,
      productOverallScore: values.productOverallScore,
      productFinalScore: values.productFinalScore,
    });
    this.setState({
      productScoreItem: data,
    });
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
    let data = Object.assign({}, this.state.productScoreItem, {
      testCaseRunable: e.target.value,
    });
    this.setState({
      productScoreItem: data,
    });
  };
  componentDidMount() {
    console.log("componentDidMount===");
    //当去当前评审状态
    this.handleGetProductScoreInfo();
    this.handleGetTeamList();
    this.handleGetProductList();
  }

  // 获取任务列表数据
  handleGetProductScoreInfo = () => {
    this.setState({
      loading: true,
    });
    var param = {
      tid: (store.getState() as any).user.data.tid,
    };
    queryProductScoreList(param)
      .then((res: any) => {
        console.log("queryProductScoreList===", res);
        this.setState({
          loading: false,
        });

        if (res.code === 0) {
          if (res.data.length >= 1) {
            //有评审，展示数据
            this.setState({
              edit: false,
              productScoreItem: res.data[0],
            });
          } else {
            //如果没有评审过，那么进行新建
            this.setState({
              edit: true,
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
        if (!isEmpty(res.message)) {
          message.error(res.message);
        }
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
        if (!isEmpty(res.message)) {
          message.error(res.message);
        }
      }
    });
  };
  autoCalValue = (values: any, productVotedScore: any) => {
    values.productVotedScore = productVotedScore;
    values.testCaseDensity = this.calTestCaseDensity(
      values.testCaseAssertSuccess,
      values.productCodeLine
    );
    values.productOverallScore = this.calProductOverallScore(values);
    values.productFinalScore = parseFloat(
      math.format(
        math.add(
          math.bignumber(values.productVotedScore),
          math.bignumber(values.productOverallScore)
        ),
        { precision: precision }
      )
    );
  };
  calTestCaseDensity = (testCaseAssertSuccess: any, productCodeLine: any) => {
    if (isEmpty(productCodeLine) || productCodeLine === 0) {
      return 0;
    }
    if (isEmpty(testCaseAssertSuccess)) {
      return 0;
    }
    var testCaseDensity = math.format(
      math.divide(
        math.bignumber(testCaseAssertSuccess * 1000),
        math.bignumber(productCodeLine)
      ),
      { precision: precision }
    ); // 返回2位小数
    //  Math.round(0.222222,2);
    console.info(
      "testCaseDensity:" +
        testCaseDensity +
        "," +
        (testCaseAssertSuccess * 1000) / productCodeLine +
        "," +
        parseFloat(testCaseDensity)
    );

    return parseFloat(testCaseDensity);
  };
  calProductOverallScore = (values: any) => {
    var sum = 0;
    if (!isEmpty(values.testCaseQuality)) {
      sum = math
        .chain(math.bignumber(values.testCaseQuality))
        .multiply(math.bignumber(0.2))
        .add(math.bignumber(sum))
        .done();
      // sum += values.testCaseQuality * 0.2;
    }
    if (!isEmpty(values.testCaseEfficiency)) {
      sum = math
        .chain(math.bignumber(values.testCaseEfficiency))
        .multiply(math.bignumber(0.1))
        .add(math.bignumber(sum))
        .done();
      // sum += values.testCaseEfficiency * 0.1;
    }
    sum = math
      .chain(math.bignumber(values.testCaseDensity))
      .multiply(math.bignumber(0.3))
      .add(math.bignumber(sum))
      .done();
    // sum += values.testCaseDensity * 0.3;
    if (!isEmpty(values.testCaseLineCoverage)) {
      sum = math
        .chain(math.bignumber(values.testCaseLineCoverage))
        .multiply(math.bignumber(0.2))
        .add(math.bignumber(sum))
        .done();
      // sum += values.testCaseLineCoverage * 0.2;
    }
    if (!isEmpty(values.testCaseBranchCoverage)) {
      sum = math
        .chain(math.bignumber(values.testCaseBranchCoverage))
        .multiply(math.bignumber(0.1))
        .add(math.bignumber(sum))
        .done();
      // sum += values.testCaseBranchCoverage * 0.1;
    }
    if (!isEmpty(values.productQualityScore)) {
      sum = math
        .chain(math.bignumber(values.productQualityScore))
        .multiply(math.bignumber(0.1))
        .add(math.bignumber(sum))
        .done();
      // sum += values.productQualityScore * 0.1;
    }
    return parseFloat(math.format(sum, { precision: precision })); // 返回2位小数
  };
  onEdit = () => {
    this.formRef.current!.setFieldsValue({
      testCaseRunable: this.state.productScoreItem.testCaseRunable,
      testCaseAssertSuccess: this.state.productScoreItem.testCaseAssertSuccess,
      testCaseNoAssertSuccess:
        this.state.productScoreItem.testCaseNoAssertSuccess,
      testCaseAssertFailed: this.state.productScoreItem.testCaseAssertFailed,
      testCaseExceptionFailed:
        this.state.productScoreItem.testCaseExceptionFailed,
      testCaseNumber: this.state.productScoreItem.testCaseNumber,
      testCaseQuality: this.state.productScoreItem.testCaseQuality,
      testCaseEfficiency: this.state.productScoreItem.testCaseEfficiency,
      productCodeLine: this.state.productScoreItem.productCodeLine,
      testCaseDensity: this.state.productScoreItem.testCaseDensity,
      testCaseLineCoverage: this.state.productScoreItem.testCaseLineCoverage,
      testCaseBranchCoverage:
        this.state.productScoreItem.testCaseBranchCoverage,
      productQualityScore: this.state.productScoreItem.productQualityScore,
      productFinalScore: this.state.productScoreItem.productFinalScore,
      productOverallScore: this.state.productScoreItem.productOverallScore,
      productVotedScore: this.state.productScoreItem.productVotedScore,
      department: this.state.productScoreItem.department,
      pdepartment: this.state.productScoreItem.pdepartment,
      team: this.state.productScoreItem.team,
      product: this.state.productScoreItem.product,
      module: this.state.productScoreItem.module,
    });
    this.setState({
      edit: true,
    });
  };
  onSubmit = () => {
    if (
      isEmpty(this.state.productScoreItem.tid) ||
      isEmpty(this.state.productScoreItem.mid)
    ) {
      message.error("请完善参赛团队/被评审产品模块信息");
      return;
    }
    let values = this.formRef.current!.getFieldsValue();
    values.sid = this.state.productScoreItem.sid;
    values.did = this.state.productScoreItem.did;
    values.tid = this.state.productScoreItem.tid;
    values.pdid = this.state.productScoreItem.pdid;
    values.pid = this.state.productScoreItem.pid;
    values.mid = this.state.productScoreItem.mid;
    this.autoCalValue(values, this.state.productScoreItem.productVotedScore);
    console.log("onSubmit===", values);
    if (this.state.edit) {
      updateProductScore(values).then((res: any) => {
        console.log("submitProductScore===", res);
        if (res.code === 0) {
          message.success("编辑成功");
          this.setState({
            edit: false,
          });
          this.handleGetProductScoreInfo();
        } else {
          message.error(res.message);
        }
      });
    } else {
      submitProductScore(values).then((res: any) => {
        console.log("submitProductScore===", res);
        if (res.code === 0) {
          message.success("提交成功");
          this.setState({
            edit: false,
          });
          this.handleGetProductScoreInfo();
        } else {
          message.error(res.message);
        }
      });
    }
  };
  result = () => {
    if (this.state.productScoreItem.testCaseRunable === 1) {
      return "成功";
    } else if (this.state.productScoreItem.testCaseRunable === 0) {
      return "失败";
    } else {
      return "--";
    }
  };
  render() {
    const { teamOptions, productOptions, edit, productScoreItem } = this.state;
    var selectdTeam = [productScoreItem.department, productScoreItem.team];
    var selectdProduct = [
      productScoreItem.pdepartment,
      productScoreItem.product,
      productScoreItem.module,
    ];

    const info = (
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
            ref={this.formRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            layout="horizontal"
            size="small"
          >
            <Form.Item label="运行结果">{this.result()}</Form.Item>
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
    const editInfo = (
      <div className="content">
        <div>
          <Divider orientation="left" style={{ fontWeight: "bold" }}>
            参赛者信息
          </Divider>
          <div className="item">
            参赛团队：
            <Cascader
              // onChange={this.onTeamChange}
              options={teamOptions}
              disabled={true}
              expandTrigger="hover"
              // displayRender={this.displayRender}
              defaultValue={selectdTeam}
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
              defaultValue={selectdProduct}
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
              formatter={this.limitPrecisionNumber}
              parser={this.limitPrecisionNumber}
              max={100}
              defaultValue={productScoreItem.productVotedScore}
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
              initialValue={productScoreItem.testCaseRunable}
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
                  disabled={productScoreItem.testCaseRunable === 0}
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
                  formatter={this.limitNumber}
                  parser={this.limitNumber}
                  disabled={productScoreItem.testCaseRunable === 0}
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
                  formatter={this.limitNumber}
                  parser={this.limitNumber}
                  disabled={productScoreItem.testCaseRunable === 0}
                  min={0}
                  placeholder="默认0"
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="异常失败：" name="testCaseExceptionFailed">
              <InputNumber
                min={0}
                formatter={this.limitNumber}
                parser={this.limitNumber}
              />
            </Form.Item>
            <Form.Item label="总个数：" name="testCaseNumber">
              <InputNumber
                min={0}
                formatter={this.limitNumber}
                parser={this.limitNumber}
              />
            </Form.Item>
            <Form.Item label="代码行数：" name="productCodeLine">
              <InputNumber
                min={0}
                formatter={this.limitNumber}
                parser={this.limitNumber}
              />
            </Form.Item>{" "}
            <Form.Item label="质量评分：" name="testCaseQuality">
              <InputNumber
                min={0}
                max={100}
                placeholder="0~100"
                formatter={this.limitPrecisionNumber}
                parser={this.limitPrecisionNumber}
              />
            </Form.Item>{" "}
            <Form.Item label="有效性评分：" name="testCaseEfficiency">
              <InputNumber
                min={0}
                max={100}
                placeholder="0~100"
                formatter={this.limitPrecisionNumber}
                parser={this.limitPrecisionNumber}
              />
            </Form.Item>
            <Divider orientation="left" style={{ fontWeight: "bold" }}>
              覆盖率
            </Divider>
            <Form.Item name="testCaseLineCoverage" label="行覆盖率：">
              <InputNumber
                min={0}
                max={100}
                formatter={this.limitNumber}
                parser={this.limitNumber}
              ></InputNumber>
            </Form.Item>
            <Form.Item name="testCaseBranchCoverage" label="分支覆盖率：">
              <InputNumber
                min={0}
                max={100}
                formatter={this.limitNumber}
                parser={this.limitNumber}
              />
            </Form.Item>
            <Form.Item name="productQualityScore" label="产品质量评分：">
              <InputNumber
                min={0}
                max={100}
                formatter={this.limitPrecisionNumber}
                parser={this.limitPrecisionNumber}
                placeholder="0~100"
              />
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
              投票得分：{productScoreItem.productVotedScore}
              <br />
              综合得分：{productScoreItem.productOverallScore}
              (其中密度分：
              {math.format(
                math
                  .chain(0.2)
                  .multiply(math.bignumber(productScoreItem.testCaseDensity))
                  .done(),
                { precision: precision }
              )}
              ) <br />
              总分：
              {productScoreItem.productFinalScore}
              <Button onClick={edit ? this.onSubmit : this.onEdit}>
                {edit ? "提交" : "编辑"}
              </Button>
            </div>
          </Affix>
        </div>
      </DocumentTitle>
    );
  }
}

export default Audit;
