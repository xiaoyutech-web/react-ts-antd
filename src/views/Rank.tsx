/* 描述: 排名
 */

import * as React from "react";
import DocumentTitle from "react-document-title";
import { Column, Line } from "@ant-design/charts";
import { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Table,
  Space,
  Pagination,
  message,
  Select,
  Form,
  Input,
  DatePicker,
} from "antd";
import { StarOutlined, StarTwoTone, ExportOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/rank.less";
import {
  queryProductScoreList,
  addTask,
  editTask,
  updateTaskStatus,
  updateMark,
  deleteTask,
} from "@/utils/api";
import { formatDate, formatTime } from "@/utils/valid";

interface Task {
  id: number;
  title: string;
  content: string;
  gmt_expire: number;
  status: number;
  is_major: any;
}

interface Values {
  id?: number;
  title: string;
  date: any;
  content: string;
}

interface IState {
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  textBtn: string;
  title: string;
  visible: boolean;
  currentRowData: Values;
  status: any;
  columns: ColumnsType<Task>;
  dataSource: Task[];
  filteredInfo: any;
}

interface IProps {
  title: string;
  textBtn: string;
  visible: boolean;
  currentRowData: Values;
  onSubmitDrawer: (values: Values, type: number) => void;
  onCloseDrawer: () => void;
}

class Rank extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      filteredInfo: null,
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
      columns: [
        {
          title: "序号",
          key: "id",
          align: "center",
          render: (text: any, record: any, index: number) => {
            let num = (this.state.pageNo - 1) * 10 + index + 1;
            return num;
          },
        },
        {
          title: "参赛部门",
          dataIndex: "department",
          width: 150,
          key: "department",
        },
        {
          title: "参赛团队",
          dataIndex: "team",
          width: 150,
          key: "team",
        },
        {
          title: "被评审产品部门",
          dataIndex: "pdepartment",
          width: 150,
          key: "pdepartment",
          filters: [
            {text: '营业厅+App', value: 0},
            {text: '营业厅+H5', value: 1},
            {text: '营业厅', value: 2},
            {text: '敬请期待', value: 3},
            {text: '广东定制', value: 4},
            {text: '浙江定制', value: 5},
          ],
          // filteredValue: filteredInfo.pdepartment || null,
          // onFilter: (value, record) => record.type === value,
        },
        {
          title: "被评审产品",
          dataIndex: "product",
          key: "product",
        },
        {
          title: "被评审模块",
          dataIndex: "module",
          key: "module",
        },
        {
          title: "产品质量综合得分",
          dataIndex: "productOverallScore",
          key: "productOverallScore",
          width: 150,
        },
        {
          title: "产品质量投票得分",
          dataIndex: "productVotedScore",
          key: "productVotedScore",
          width: 150,
        },
        {
          title: "总分",
          dataIndex: "productFinalScore",
          key: "productFinalScore",
          width: 150,
        },
        {
          title: "提交日期",
          dataIndex: "gmt_expire",
          key: "gmt_expire",
          render: (text: any, record: any) => formatTime(record.gmt_expire),
        },
      ],
    };
  }

  componentDidMount() {
    console.log("componentDidMount===");
    this.getProductScoreList();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount===");
  }

  // 获取任务列表数据
  getProductScoreList = () => {
    const { pageNo, pageSize, status } = this.state;
    this.setState({
      loading: true,
    });

    let params = {};

    queryProductScoreList(params)
      .then((res: any) => {
        console.log("列表===", res);
        this.setState({
          loading: false,
        });

        if (res.code === 0 && res.data) {
          this.setState({
            dataSource: res.data,
            total: res.data.length,
          });
        } else {
          this.setState({
            dataSource: [],
            total: 0,
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };
 
 

  // 页码改变的回调，返回改变后的页码
  changePage = (pageNo: number) => {
    console.log("pageNo=", pageNo);
    this.setState(
      {
        pageNo,
      },
      () => {
        this.getProductScoreList();
      }
    );
  };

  // 筛选任务状态
  handleChange = (value: number) => {
    console.log("任务状态筛选===", typeof value === "string");
    this.setState(
      {
        status: typeof value === "string" ? null : value,
        pageNo: 1,
      },
      () => {
        this.getProductScoreList();
      }
    );
  };
  handleTableChange = (pagination:any, filters:any, sorter:any) => {
    // this.fetch({
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   pagination,
    //   ...filters,
    // });
    this.setState({
      filteredInfo: filters,
   
    });
  };
  render() {
    const {
      total,
      pageNo,
      pageSize,
      loading,
      dataSource,
      columns,
      visible,
      title,
      textBtn,
      currentRowData,filteredInfo 
    } = this.state;
    const { Option } = Select;

    const config: any = {
      data: dataSource,
      xField: "module",
      yField: "productFinalScore",
      label: {
        position: "middle",
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        product: { alias: "产品" },
        productFinalScore: { alias: "总分" },
      },
    };
    return (
      <DocumentTitle title={"排名"}>
        <div className="rank-container">
          <Header curActive={"/rank"} />

          <div className="content clearfix">
            <div className="list">
              <h2>排行榜</h2>
              <div className="list-right">
                <Space size="middle">
                  <Select
                    size="large"
                    onChange={this.handleChange}
                    style={{ width: 160 }}
                    allowClear
                    placeholder="请筛选部门"
                  >
                    <Option value="">全部</Option>
                    <Option value={0}>待办</Option>
                  </Select>
                  <Button type="primary" size="large">
                    <ExportOutlined /> 导出
                  </Button>
                </Space>
              </div>
            </div>
            <Column
              style={{
                autoFit: true,
                margin: 10,
                height: 250,
              }}
              {...config}
            />

            <Table
              bordered
              rowKey={(record) => record.id}
              dataSource={dataSource}
              columns={columns}
              loading={loading}
              // pagination={false}
              // onChange={this.changePage}
              pagination={{
                total: total,
                pageSize: pageSize,
              }}
              onChange={this.handleTableChange}
            />
            {/* <Pagination
              className="pagination"
              total={total}
              style={{ display: loading && total === 0 ? "none" : "" }}
              showTotal={(total) => `共 ${total} 条数据`}
              onChange={this.changePage}
              // current={pageNo}
              // showSizeChanger={false}
              defaultPageSize={pageSize}
              hideOnSinglePage={false}
            /> */}
          </div>

          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default Rank;
